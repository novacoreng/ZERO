"use strict";
const fs=require("node:fs");
const path=require("node:path");
const crypto=require("node:crypto");
const PIN=/^[A-Z2-9]{4}(?:-[A-Z2-9]{4}){3}$/;
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function validMessage(message){
 return message&&typeof message==="object"&&!Array.isArray(message)&&typeof message.id==="string"&&UUID.test(message.id)&&typeof message.sender==="string"&&PIN.test(message.sender)&&typeof message.plaintext==="string"&&Buffer.byteLength(message.plaintext,"utf8")<=32768&&typeof message.receivedAt==="string"&&Number.isFinite(Date.parse(message.receivedAt))&&typeof message.expiresAt==="string"&&Number.isFinite(Date.parse(message.expiresAt));
}
function createInboxStore(directory,safeStorage,ownerPin){
 if(!safeStorage.isEncryptionAvailable())throw Error("OS encryption unavailable");
 fs.mkdirSync(directory,{recursive:true,mode:0o700});
 const file=path.join(directory,"inbox.v1");
 let messages={};
 if(fs.existsSync(file)){
  const record=JSON.parse(fs.readFileSync(file,"utf8"));
  if(record.version!==1||record.ownerPin!==ownerPin||typeof record.encrypted!=="string")throw Error("Inbox store identity mismatch");
  messages=JSON.parse(safeStorage.decryptString(Buffer.from(record.encrypted,"base64")));
  if(!messages||typeof messages!=="object"||Array.isArray(messages)||Object.keys(messages).length>5000||Object.entries(messages).some(([id,item])=>!validMessage(item)||id!==item.id))throw Error("Invalid inbox store");
 }
 function persist(){
  const encrypted=safeStorage.encryptString(JSON.stringify(messages)).toString("base64");
  const temp=file+"."+process.pid+"."+crypto.randomBytes(6).toString("hex");
  try{fs.writeFileSync(temp,JSON.stringify({version:1,ownerPin,encrypted}),{flag:"wx",mode:0o600});fs.renameSync(temp,file);}
  finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
 }
 function has(id){if(!UUID.test(id))throw Error("Invalid message ID");return Object.hasOwn(messages,id);}
 function save(message){
  if(!validMessage(message))throw Error("Invalid inbox message");
  pruneExpired();
  if(Date.parse(message.expiresAt)<=Date.now())throw Error("Expired inbox message");
  if(has(message.id))return false;
  if(Object.keys(messages).length>=5000)throw Error("Encrypted inbox capacity exceeded");
  const previous=messages;
  messages={...messages,[message.id]:{id:message.id,sender:message.sender,plaintext:message.plaintext,receivedAt:message.receivedAt,expiresAt:message.expiresAt}};
  try{persist();}catch(error){messages=previous;throw error;}
  return true;
 }
 function pruneExpired(){
  const now=Date.now();
  let changed=false;
  const previous=messages;
  const active={};
  for(const [id,item]of Object.entries(messages)){
   if(!item||!Number.isFinite(Date.parse(item.expiresAt))||Date.parse(item.expiresAt)<=now){changed=true;continue;}
   active[id]=item;
  }
  if(changed){messages=active;try{persist();}catch(error){messages=previous;throw error;}}
 }
 function list(){
  pruneExpired();
  return Object.values(messages).sort((a,b)=>a.receivedAt.localeCompare(b.receivedAt)).slice(-500);
 }
 return {has,save,list};
}
module.exports={createInboxStore};
