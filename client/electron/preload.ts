import { contextBridge, ipcRenderer } from "electron";

// --------- Expose some API to the Renderer process ---------

export const api = {
  getToken: async (): Promise<string> => await ipcRenderer.invoke("token:get"),
  setToken: async (value: string) =>
    await ipcRenderer.invoke("token:set", value),
  deleteToken: async () => await ipcRenderer.invoke("token:delete"),
};

contextBridge.exposeInMainWorld("electron", api);
