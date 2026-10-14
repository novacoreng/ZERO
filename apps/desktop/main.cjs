"use strict";
const {app,BrowserWindow,ipcMain,safeStorage}=require("electron");
const path=require("node:path");
const {loadOrCreateIdentity}=require("./device-identity.cjs");
let identity=null;
let activationError=null;
function createWindow(){
 const win=new BrowserWindow({width:1050,height:740,minWidth:700,minHeight:520,backgroundColor:"#151216",title:"ZERO",autoHideMenuBar:true,webPreferences:{preload:path.join(__dirname,"preload.cjs"),contextIsolation:true,nodeIntegration:false,sandbox:true}});
 win.setMenuBarVisibility(false);
 win.webContents.setWindowOpenHandler(()=>({action:"deny"}));
 win.webContents.on("will-navigate",(event)=>event.preventDefault());
 win.loadFile(path.join(__dirname,"index.html"));
}
app.whenReady().then(()=>{
 try{
  identity=loadOrCreateIdentity(path.join(app.getPath("userData"),"secure"),safeStorage);
 }catch(error){activationError=error instanceof Error?error.message:"Device activation failed";}
 ipcMain.handle("zero:identity",()=>{
  if(!identity)return {activated:false,error:activationError||"Device identity unavailable"};
  return {activated:true,pin:identity.pin,publicKey:identity.publicKey};
 });
 createWindow();
 app.on("activate",()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
});
app.on("window-all-closed",()=>{if(process.platform!=="darwin")app.quit();});
