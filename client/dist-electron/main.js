var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { nativeTheme, ipcMain, app, BrowserWindow, Menu } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import keytar from "keytar";
const _TokenStorage = class _TokenStorage {
  static async getToken() {
    return await keytar.getPassword(_TokenStorage.SERVICE, _TokenStorage.key);
  }
  static async setToken(value) {
    return await keytar.setPassword(
      _TokenStorage.SERVICE,
      _TokenStorage.key,
      value
    );
  }
  static async deleteToken() {
    return await keytar.deletePassword(_TokenStorage.SERVICE, _TokenStorage.key);
  }
};
__publicField(_TokenStorage, "key", "token");
__publicField(_TokenStorage, "SERVICE", "JBot");
let TokenStorage = _TokenStorage;
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
nativeTheme.themeSource = "dark";
ipcMain.handle("token:get", async () => await TokenStorage.getToken());
ipcMain.handle(
  "token:set",
  async (_, value) => await TokenStorage.setToken(value)
);
ipcMain.handle("token:delete", async () => await TokenStorage.deleteToken());
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  createWindow();
  const menu = Menu.buildFromTemplate([
    {
      label: "File",
      submenu: [{ label: "Exit", click: () => win == null ? void 0 : win.close() }]
    },
    {
      label: "About",
      submenu: [
        {
          label: "Version: 1.0.0"
        },
        {
          label: "Created By: Himanshu"
        }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
