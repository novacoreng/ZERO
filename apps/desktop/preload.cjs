"use strict";
const {contextBridge,ipcRenderer}=require("electron");
contextBridge.exposeInMainWorld("ZERO_DESKTOP",Object.freeze({
 platform:process.platform,
 getIdentity:()=>ipcRenderer.invoke("zero:identity")
}));
