"use strict";
const {contextBridge,ipcRenderer}=require("electron");
contextBridge.exposeInMainWorld("ZERO_DESKTOP",Object.freeze({
 platform:process.platform,
 getIdentity:()=>ipcRenderer.invoke("zero:identity"),
 registerDevice:()=>ipcRenderer.invoke("zero:register"),
 authenticateDevice:()=>ipcRenderer.invoke("zero:authenticate"),
 lookupContact:(pin)=>ipcRenderer.invoke("zero:lookup-contact",pin),
 publishEncryptionKey:()=>ipcRenderer.invoke("zero:publish-encryption-key"),
 sendMessage:(recipient,plaintext)=>ipcRenderer.invoke("zero:send-message",recipient,plaintext),
 readMessages:()=>ipcRenderer.invoke("zero:read-messages")
}));
