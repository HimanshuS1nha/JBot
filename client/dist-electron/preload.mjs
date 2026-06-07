"use strict";
const electron = require("electron");
const api = {
  getToken: async () => await electron.ipcRenderer.invoke("token:get"),
  setToken: async (value) => await electron.ipcRenderer.invoke("token:set", value),
  deleteToken: async () => await electron.ipcRenderer.invoke("token:delete")
};
electron.contextBridge.exposeInMainWorld("electron", api);
