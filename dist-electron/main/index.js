"use strict";
const { app, BrowserWindow, shell, ipcMain } = require("electron");
const { release } = require("os");
const { join } = require("path");
const Store = require("electron-store");
process.env.DIST_ELECTRON = join(__dirname, "..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? join(process.env.DIST_ELECTRON, "../public") : process.env.DIST;
if (release().startsWith("6.1"))
  app.disableHardwareAcceleration();
if (process.platform === "win32")
  app.setAppUserModelId(app.getName());
if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}
new Store();
let win = null;
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");
async function createWindow() {
  win = new BrowserWindow({
    title: "Discord Bot Messenger",
    icon: join(process.env.PUBLIC, "favicon.ico"),
    minWidth: 530,
    minHeight: 410,
    width: 530,
    height: 410,
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
      devTools: true
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(url);
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  win.webContents.setWindowOpenHandler(({ url: url2 }) => {
    if (url2.startsWith("https:"))
      shell.openExternal(url2);
    return { action: "deny" };
  });
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin")
    app.quit();
});
app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized())
      win.restore();
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
  if (window)
    window.minimize();
});
ipcMain.on("toggleMaximize", () => {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.isMaximized() ? window.unmaximize() : window.maximize();
  }
});
ipcMain.on("closeWindow", () => {
  const window = BrowserWindow.getFocusedWindow();
  if (window)
    window.close();
});
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
//# sourceMappingURL=index.js.map
