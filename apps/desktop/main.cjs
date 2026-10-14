"use strict";
const {app,BrowserWindow,ipcMain,safeStorage}=require("electron");
const path=require("node:path");
const {loadOrCreateIdentity,signChallenge}=require("./device-identity.cjs");
let identity=null;
let activationError=null;
let sessionToken=null;
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
 ipcMain.handle("zero:authenticate",async()=>{
  if(!identity)return {authenticated:false,error:"Device identity unavailable"};
  const base=process.env.ZERO_REGISTRY_URL;
  if(!base)return {authenticated:false,error:"Device registry is not configured"};
  try{
   const url=new URL(base);
   if(url.protocol!=="https:"&&!(url.protocol==="http:"&&["localhost","127.0.0.1"].includes(url.hostname)))throw new Error("Secure registry required");
   if(url.username||url.password||url.search||url.hash)throw new Error("Invalid registry URL");
   const controller=new AbortController();
   const timer=setTimeout(()=>controller.abort(),8000);
   try{
    async function post(route,body){
     const response=await fetch(new URL(route,url),{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body),signal:controller.signal});
     if(!response.ok)throw new Error("Authentication failed");
     return response.json();
    }
    const issued=await post("/v1/session/challenge",{publicKey:identity.publicKey});
    if(issued.pin!==identity.pin)throw new Error("PIN mismatch");
    const signed=signChallenge(identity,issued.challenge);
    const result=await post("/v1/session/authenticate",{publicKey:identity.publicKey,challenge:issued.challenge,signature:signed});
    if(result.pin!==identity.pin||typeof result.accessToken!=="string")throw new Error("Invalid authentication response");
    sessionToken=result.accessToken;
    return {authenticated:true,pin:identity.pin,expiresInSeconds:result.expiresInSeconds};
   }finally{clearTimeout(timer);}
  }catch{return {authenticated:false,error:"Device authentication failed. Register this PIN first."};}
 });
 ipcMain.handle("zero:register",async()=>{
  if(!identity)return {registered:false,error:"Local device identity unavailable"};
  const base=process.env.ZERO_REGISTRY_URL;
  if(!base)return {registered:false,error:"Device registry is not configured"};
  let url;
  try{
   url=new URL(base);
   if(url.protocol!=="https:"&&!(url.protocol==="http:"&&["localhost","127.0.0.1"].includes(url.hostname)))throw new Error("HTTPS is required");
   if(url.username||url.password||url.search||url.hash)throw new Error("Invalid registry URL");
  }catch{return {registered:false,error:"Invalid device registry URL"};}
  async function post(route,payload){
   const controller=new AbortController();
   const timer=setTimeout(()=>controller.abort(),8000);
   try{
    const response=await fetch(new URL(route,url),{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload),signal:controller.signal});
    if(!response.ok)throw new Error("Registry request failed");
    return await response.json();
   }finally{clearTimeout(timer);}
  }
  try{
   const issued=await post("/v1/devices/challenge",{publicKey:identity.publicKey});
   if(issued.pin!==identity.pin||typeof issued.challenge!=="string")throw new Error("Registry identity mismatch");
   const signature=signChallenge(identity,issued.challenge);
   const result=await post("/v1/devices/register",{publicKey:identity.publicKey,challenge:issued.challenge,signature});
   if(result.pin!==identity.pin||result.registered!==true)throw new Error("Registry response mismatch");
   return {registered:true,pin:identity.pin};
  }catch{return {registered:false,error:"Device registration failed. Check the registry connection."};}
 });
 createWindow();
 app.on("activate",()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
});
app.on("window-all-closed",()=>{if(process.platform!=="darwin")app.quit();});
