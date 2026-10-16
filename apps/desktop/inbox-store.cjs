"use strict";
const fs=require("node:fs");
const path=require("node:path");
const crypto=require("node:crypto");
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function createInboxStore(directory,safeStorage,ownerPin){
 if(!safeStorage.isEncryptionAvailable())throw Error("OS encryption unavailable");
 fs.mkdirSync(directory,{recursive:true,mode:0o700});
 const file=path.join(directory,"inbox.v1");
 let messages={};
 if(fs.existsSync(file)){
  const record=JSON.parse(fs.readFileSync(file,"utf8"));
  if(record.version!==1||record.ownerPin!==ownerPin||typeof record.encrypted!=="string")throw Error("Inbox store identity mismatch");
  messages=JSON.parse(safeStorage.decryptString(Buffer.from(record.encrypted,"base64")));
  if(!messages||typeof messages!=="object"||Array.isArray(messages))throw Error("Invalid inbox store");
 }
 function persist(){
  const encrypted=safeStorage.encryptString(JSON.stringify(messages)).toString("base64");
  const temp=file+"."+process.pid+"."+crypto.randomBytes(6).toString("hex");
  try{fs.writeFileSync(temp,JSON.stringify({version:1,ownerPin,encrypted}),{flag:"wx",mode:0o600});fs.renameSync(temp,file);}
  finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
 }
 function has(id){if(!UUID.test(id))throw Error("Invalid message ID");return Object.hasOwn(messages,id);}
 function save(message){
  if(!message||!UUID.test(message.id)||typeof message.sender!=="string"||typeof message.plaintext!=="string"||typeof message.receivedAt!=="string"||typeof message.expiresAt!=="string"||!Number.isFinite(Date.parse(message.expiresAt)))throw Error("Invalid inbox message");
  if(has(message.id))return false;
  if(Object.keys(messages).length>=5000)throw Error("Encrypted inbox capacity exceeded");
  messages[message.id]={id:message.id,sender:message.sender,plaintext:message.plaintext,receivedAt:message.receivedAt,expiresAt:message.expiresAt};
  try{persist();}catch(error){delete messages[message.id];throw error;}
  return true;
 }
 function list(){
  const now=Date.now();
  let changed=false;
  for(const [id,item]of Object.entries(messages))if(Date.parse(item.expiresAt)<=now){delete messages[id];changed=true;}
  if(changed)persist();
  return Object.values(messages).sort((a,b)=>a.receivedAt.localeCompare(b.receivedAt)).slice(-500);
 }
 return {has,save,list};
}
module.exports={createInboxStore};
