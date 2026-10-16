"use strict";
const {app,BrowserWindow,ipcMain,safeStorage}=require("electron");
const path=require("node:path");
const {loadOrCreateEncryptionIdentity,verifyPublishedKey}=require("./encryption-identity.cjs");
const {createSignedMessage,openSignedMessage}=require("./signed-message.cjs");
const {createReplayStore}=require("./replay-store.cjs");
const {createInboxStore}=require("./inbox-store.cjs");
const {loadOrCreateIdentity,signChallenge}=require("./device-identity.cjs");
let identity=null;
let encryptionIdentity=null;
let activationError=null;
let sessionToken=null;
let replayStore=null;
let inboxStore=null;
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
  encryptionIdentity=loadOrCreateEncryptionIdentity(path.join(app.getPath("userData"),"secure"),safeStorage,identity);
  replayStore=createReplayStore(path.join(app.getPath("userData"),"secure"),safeStorage,identity.pin);
  inboxStore=createInboxStore(path.join(app.getPath("userData"),"secure"),safeStorage,identity.pin);
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
 ipcMain.handle("zero:publish-encryption-key",async()=>{
  if(!identity||!encryptionIdentity||!sessionToken)return {published:false,error:"Connect your device first"};
  const base=process.env.ZERO_REGISTRY_URL;
  if(!base)return {published:false,error:"Registry not configured"};
  try{
   const url=new URL(base);
   if(url.protocol!=="https:"&&!(url.protocol==="http:"&&["localhost","127.0.0.1"].includes(url.hostname)))throw new Error("Invalid protocol");
   if(url.username||url.password||url.search||url.hash)throw new Error("Invalid URL");
   const controller=new AbortController();
   const timer=setTimeout(()=>controller.abort(),8000);
   try{
    const response=await fetch(new URL("/v1/encryption-keys/publish",url),{method:"POST",headers:{"content-type":"application/json",authorization:"Bearer "+sessionToken},body:JSON.stringify({publicKey:encryptionIdentity.publicKey,signature:encryptionIdentity.signature}),signal:controller.signal});
    if(response.status===401){sessionToken=null;return {published:false,error:"Session expired"};}
    if(!response.ok)throw new Error("Publication failed");
    const result=await response.json();
    if(result.pin!==identity.pin||result.published!==true)throw new Error("Invalid response");
    return {published:true,pin:identity.pin};
   }finally{clearTimeout(timer);}
  }catch{return {published:false,error:"Encryption key publication failed"};}
 });
 ipcMain.handle("zero:lookup-contact",async(_event,requestedPin)=>{
  if(!identity||!sessionToken)return {found:false,error:"Connect your device first"};
  if(typeof requestedPin!=="string"||!(/^[A-Z2-9]{4}(?:-[A-Z2-9]{4}){3}$/.test(requestedPin)))return {found:false,error:"Enter a valid ZERO PIN"};
  if(requestedPin===identity.pin)return {found:false,error:"This is your own device PIN"};
  const base=process.env.ZERO_REGISTRY_URL;
  if(!base)return {found:false,error:"Registry not configured"};
  try{
   const url=new URL(base);
   if(url.protocol!=="https:"&&!(url.protocol==="http:"&&["localhost","127.0.0.1"].includes(url.hostname)))throw new Error("Invalid protocol");
   if(url.username||url.password||url.search||url.hash)throw new Error("Invalid URL");
   const controller=new AbortController();
   const timer=setTimeout(()=>controller.abort(),8000);
   try{
    const response=await fetch(new URL("/v1/devices/"+encodeURIComponent(requestedPin),url),{signal:controller.signal,headers:{authorization:"Bearer "+sessionToken}});
    if(response.status===404)return {found:false,error:"No registered device with that PIN"};
    if(!response.ok)throw new Error("Lookup unavailable");
    const device=await response.json();
    const {fingerprint}=require("./device-identity.cjs");
    if(device.pin!==requestedPin||typeof device.publicKey!=="string"||fingerprint(device.publicKey)!==requestedPin)throw new Error("Contact identity mismatch");
    const keyResponse=await fetch(new URL("/v1/encryption-keys/"+encodeURIComponent(requestedPin),url),{signal:controller.signal});
    if(keyResponse.status===404)return {found:true,pin:requestedPin,publicKey:device.publicKey,encryptionReady:false};
    if(!keyResponse.ok)throw new Error("Key lookup failed");
    const keyRecord=await keyResponse.json();
    if(keyRecord.identityPublicKey!==device.publicKey||!verifyPublishedKey(requestedPin,keyRecord))throw new Error("Invalid encryption key signature");
    return {found:true,pin:requestedPin,publicKey:device.publicKey,encryptionReady:true};
   }finally{clearTimeout(timer);}
  }catch{return {found:false,error:"Contact verification failed"};}
 });
 ipcMain.handle("zero:send-message",async(_event,recipient,plaintext)=>{
  if(!identity||!encryptionIdentity||!sessionToken)return {sent:false,error:"Connect your device first"};
  if(typeof recipient!=="string"||!/^[A-Z2-9]{4}(?:-[A-Z2-9]{4}){3}$/.test(recipient)||recipient===identity.pin)return {sent:false,error:"Invalid recipient"};
  if(typeof plaintext!=="string"||!plaintext.trim()||Buffer.byteLength(plaintext,"utf8")>32768)return {sent:false,error:"Invalid message"};
  try{
   const base=process.env.ZERO_REGISTRY_URL;
   const url=new URL(base);
   if(url.protocol!=="https:"&&!(url.protocol==="http:"&&["localhost","127.0.0.1"].includes(url.hostname)))throw Error("Invalid protocol");
   if(url.username||url.password||url.search||url.hash)throw Error("Invalid URL");
   const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
   try{
    const keyResponse=await fetch(new URL("/v1/encryption-keys/"+recipient,url),{signal:controller.signal});
    if(!keyResponse.ok)throw Error("Recipient key unavailable");
    const record=await keyResponse.json();
    if(!verifyPublishedKey(recipient,record))throw Error("Unverified recipient key");
    const encrypted=createSignedMessage({identity,recipient,recipientPublicKey:record.publicKey,plaintext});
    const response=await fetch(new URL("/v1/messages/send",url),{method:"POST",headers:{"content-type":"application/json",authorization:"Bearer "+sessionToken},body:JSON.stringify({recipient,encrypted}),signal:controller.signal});
    if(response.status===401){sessionToken=null;throw Error("Session expired");}
    if(!response.ok)throw Error("Relay rejected message");
    const result=await response.json();
    if(result.queued!==true||typeof result.id!=="string")throw Error("Invalid relay response");
    return {sent:true,id:result.id,recipient};
   }finally{clearTimeout(timer);}
  }catch{return {sent:false,error:"Could not send encrypted message. Check contact key and connection."};}
 });
 ipcMain.handle("zero:read-messages",async()=>{
  if(!identity||!encryptionIdentity||!sessionToken)return {connected:false,error:"Connect your device first"};
  try{
   const url=new URL(process.env.ZERO_REGISTRY_URL);
   if(url.protocol!=="https:"&&!(url.protocol==="http:"&&["localhost","127.0.0.1"].includes(url.hostname)))throw Error("Invalid protocol");
   if(url.username||url.password||url.search||url.hash)throw Error("Invalid URL");
   const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
   try{
    const response=await fetch(new URL("/v1/messages/inbox",url),{headers:{authorization:"Bearer "+sessionToken},signal:controller.signal});
    if(response.status===401){sessionToken=null;return {connected:false,error:"Session expired"};}
    if(!response.ok)throw Error("Inbox unavailable");
    const result=await response.json();
    if(!Array.isArray(result.messages))throw Error("Invalid inbox");
    const messages=[];
    for(const item of result.messages.slice(0,500)){
     if(item.recipient!==identity.pin||typeof item.sender!=="string"||typeof item.id!=="string")continue;
     if(inboxStore.has(item.id)){
      // Retry acknowledgement after a previous network failure, without redisplaying.
      try{
       const retry=await fetch(new URL("/v1/messages/acknowledge",url),{method:"POST",headers:{"content-type":"application/json",authorization:"Bearer "+sessionToken},body:JSON.stringify({id:item.id}),signal:controller.signal});
       if(!retry.ok)console.warn("ZERO: replay acknowledgement retry failed");
      }catch{console.warn("ZERO: replay acknowledgement retry unavailable");}
      continue;
     }
     try{
      const senderResponse=await fetch(new URL("/v1/devices/"+item.sender,url),{signal:controller.signal});
      if(!senderResponse.ok)continue;
      const sender=await senderResponse.json();
      if(sender.pin!==item.sender||require("./device-identity.cjs").fingerprint(sender.publicKey)!==item.sender)continue;
      const plaintext=openSignedMessage({sender:item.sender,recipient:identity.pin,identityPublicKey:sender.publicKey,recipientPrivateKey:encryptionIdentity.privateKey,envelope:item.encrypted});
      // Persist decrypted content with OS encryption before acknowledging relay delivery.
      inboxStore.save({id:item.id,sender:item.sender,plaintext,receivedAt:item.receivedAt,expiresAt:item.expiresAt});
      const ack=await fetch(new URL("/v1/messages/acknowledge",url),{method:"POST",headers:{"content-type":"application/json",authorization:"Bearer "+sessionToken},body:JSON.stringify({id:item.id}),signal:controller.signal});
      if(!ack.ok)console.warn("ZERO: verified message acknowledgement pending");
     }catch{/* Unverified or malformed messages remain queued; never show plaintext. */}
    }
    return {connected:true,messages:inboxStore.list()};
   }finally{clearTimeout(timer);}
  }catch{return {connected:false,error:"Could not decrypt inbox"};}
 });
 ipcMain.handle("zero:inbox",async()=>{
  if(!identity||!sessionToken)return {connected:false,error:"Connect your device first"};
  const base=process.env.ZERO_REGISTRY_URL;
  if(!base)return {connected:false,error:"Registry not configured"};
  try{
   const url=new URL(base);
   if(url.protocol!=="https:"&&!(url.protocol==="http:"&&["localhost","127.0.0.1"].includes(url.hostname)))throw new Error("Invalid protocol");
   if(url.username||url.password||url.search||url.hash)throw new Error("Invalid URL");
   const controller=new AbortController();
   const timer=setTimeout(()=>controller.abort(),8000);
   try{
    const response=await fetch(new URL("/v1/messages/inbox",url),{headers:{authorization:"Bearer "+sessionToken},signal:controller.signal});
    if(response.status===401){sessionToken=null;return {connected:false,error:"Session expired. Connect again."};}
    if(!response.ok)throw new Error("Inbox unavailable");
    const result=await response.json();
    if(!Array.isArray(result.messages))throw new Error("Invalid inbox");
    // Never pass unverified ciphertext or plaintext to the renderer.
    return {connected:true,messages:result.messages.slice(0,500).map(m=>({id:String(m.id),sender:String(m.sender),receivedAt:String(m.receivedAt),expiresAt:String(m.expiresAt)}))};
   }finally{clearTimeout(timer);}
  }catch{return {connected:false,error:"Could not refresh inbox"};}
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
