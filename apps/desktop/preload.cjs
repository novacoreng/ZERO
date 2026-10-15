"use strict";
const {contextBridge,ipcRenderer}=require("electron");
contextBridge.exposeInMainWorld("ZERO_DESKTOP",Object.freeze({
 platform:process.platform,
 getIdentity:()=>ipcRenderer.invoke("zero:identity"),
 registerDevice:()=>ipcRenderer.invoke("zero:register"),
 authenticateDevice:()=>ipcRenderer.invoke("zero:authenticate"),
 getInbox:()=>ipcRenderer.invoke("zero:inbox"),
 lookupContact:(pin)=>ipcRenderer.invoke("zero:lookup-contact",pin)
}));
