import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  openAgentURL: (url) => ipcRenderer.invoke("open-agent-url", url),
  getAgentHTML: () => ipcRenderer.invoke("get-agent-html")
});
