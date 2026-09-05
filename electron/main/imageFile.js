const { open, readFile, stat } = require("fs/promises");
const { basename } = require("path");

// Image types Discord renders inline, with the signature bytes that prove it.
// Extensions lie, so the file header decides whether we accept a file at all.
const IMAGE_TYPES = [
  {
    mimeType: "image/png",
    signature: (header) =>
      header.subarray(0, 8).equals(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
      ),
  },
  {
    mimeType: "image/jpeg",
    signature: (header) =>
      header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff,
  },
  {
    mimeType: "image/gif",
    signature: (header) => /^GIF8[79]a$/.test(header.subarray(0, 6).toString("latin1")),
  },
  {
    mimeType: "image/bmp",
    signature: (header) => header.subarray(0, 2).toString("latin1") === "BM",
  },
  {
    mimeType: "image/webp",
    signature: (header) =>
      header.subarray(0, 4).toString("latin1") === "RIFF" &&
      header.subarray(8, 12).toString("latin1") === "WEBP",
  },
];

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "bmp", "webp"];

// Nothing gets past Discord's largest boost tier, and unboosted servers stop
// well below that, so anything in between is worth a warning but not a block
const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;
const WARN_UPLOAD_BYTES = 25 * 1024 * 1024;

// Base64 previews are held in memory by the renderer, so only build small ones
const MAX_PREVIEW_BYTES = 8 * 1024 * 1024;

const HEADER_BYTES = 12;

// Trims the trailing zero so limits read as "25 MB", not "25.0 MB"
const formatBytes = (bytes) =>
  `${Number((bytes / (1024 * 1024)).toFixed(1))} MB`;

// Reads the first bytes of a file to work out what it actually is
async function readHeader(path) {
  const handle = await open(path, "r");

  try {
    const { buffer, bytesRead } = await handle.read(
      Buffer.alloc(HEADER_BYTES),
      0,
      HEADER_BYTES,
      0
    );
    return buffer.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
}

// Validates a path and describes it for the renderer, or explains the refusal.
// Called again just before sending, in case the file moved in the meantime.
async function inspectImageFile(path, { withPreview = true } = {}) {
  try {
    const stats = await stat(path);

    if (!stats.isFile()) {
      return { error: "That isn't a file." };
    }

    if (stats.size === 0) {
      return { error: "That file is empty." };
    }

    if (stats.size > MAX_UPLOAD_BYTES) {
      return {
        error: `That image is ${formatBytes(stats.size)}. Discord won't accept anything over ${formatBytes(MAX_UPLOAD_BYTES)}.`,
      };
    }

    const header = await readHeader(path);
    const type =
      header.length === HEADER_BYTES
        ? IMAGE_TYPES.find(({ signature }) => signature(header))
        : undefined;

    if (!type) {
      return {
        error: "That file isn't a readable image (PNG, JPG, GIF, BMP or WEBP).",
      };
    }

    return {
      path,
      name: basename(path),
      size: stats.size,
      mimeType: type.mimeType,
      warning:
        stats.size > WARN_UPLOAD_BYTES
          ? `This image is ${formatBytes(stats.size)} — servers without boosts cap uploads at ${formatBytes(WARN_UPLOAD_BYTES)}.`
          : null,
      preview:
        withPreview && stats.size <= MAX_PREVIEW_BYTES
          ? `data:${type.mimeType};base64,${(await readFile(path)).toString("base64")}`
          : null,
    };
  } catch (error) {
    return {
      error:
        error.code === "ENOENT"
          ? "That image is no longer at that location."
          : "Could not read that file: " + error.message,
    };
  }
}

module.exports = { IMAGE_EXTENSIONS, inspectImageFile };
