const { app, BrowserWindow, dialog, shell, ipcMain } = require("electron");
const { release } = require("os");
const { join } = require("path");
const Store = require('electron-store');
// Imported rather than required so the bundler inlines it into the build
import { IMAGE_EXTENSIONS, inspectImageFile } from "./imageFile";
import { readFile } from "fs/promises";

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, "..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Initialize the Electron Store
const store = new Store();

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

let win = null;
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.PUBLIC, "index.html");

async function createWindow() {
  win = new BrowserWindow({
    title: "Discord Bot Messenger",
    icon: join(process.env.PUBLIC, "favicon.ico"),
    minWidth: 530,
    minHeight: 355,
    width: 530,
    height: 355,
    frame: false,
    focusable: true,
    transparent: false,
    alwaysOnTop: true,
    closable: true,
    maximizable: true,
    resizable: true,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

ipcMain.on("getFocusedWindow", (event) => {
  const window = BrowserWindow.getFocusedWindow();
  event.returnValue = window;
});

ipcMain.on("minimizeWindow", () => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) window.minimize();
});

ipcMain.on("toggleMaximize", () => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.isMaximized() ? window.unmaximize() : window.maximize();
  }
});

ipcMain.on("closeWindow", () => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) window.close();
});

ipcMain.handle("selectImageFile", async () => {
  const window = BrowserWindow.getFocusedWindow();
  const { canceled, filePaths } = await dialog.showOpenDialog(window, {
    title: "Select an image",
    buttonLabel: "Attach",
    properties: ["openFile"],
    filters: [{ name: "Images", extensions: IMAGE_EXTENSIONS }],
  });

  // Null means the user cancelled the dialog
  if (canceled || !filePaths.length) return null;

  return inspectImageFile(filePaths[0]);
});

// Messages are sent from here rather than the renderer for two reasons:
// discord.js builds uploads with undici's FormData and hands them to fetch,
// which is Chromium's fetch in a renderer and crashes the process outright;
// and its REST client reaches for the ESM-only file-type package, which Node
// cannot resolve from inside an asar in the portable build. Posting a message
// is one multipart request, so it is done here with Node's own fetch.
const DISCORD_API = "https://discord.com/api/v10";

ipcMain.handle("sendMessage", async (_event, { channelId, content, imagePath } = {}) => {
  if (!/^\d+$/.test(String(channelId ?? ""))) {
    return { error: "No channel selected." };
  }

  const token = store.get("discordBotTokenStorage");

  if (!token) {
    return { error: "No bot token saved. Open settings and add one." };
  }

  const form = new FormData();
  form.append("payload_json", JSON.stringify({ content }));

  if (imagePath) {
    // The file may have been moved or altered since it was picked
    const image = await inspectImageFile(imagePath, { withPreview: false });

    if (image.error) return image;

    const data = await readFile(image.path);
    form.append("files[0]", new Blob([data], { type: image.mimeType }), image.name);
  }

  try {
    const response = await fetch(`${DISCORD_API}/channels/${channelId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bot ${token}` },
      body: form,
    });

    if (!response.ok) {
      // Discord's own wording is more useful than a bare status code
      const body = await response.json().catch(() => ({}));
      return { error: body.message ?? `${response.status} ${response.statusText}` };
    }

    return { sent: true };
  } catch (error) {
    return { error: "Could not reach Discord: " + error.message };
  }
});

// New window example arg: new windows url
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
