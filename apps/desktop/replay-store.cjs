"use strict";
const fs=require("node:fs");
const path=require("node:path");
const crypto=require("node:crypto");
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function createReplayStore(directory,safeStorage,ownerPin){
 if(!safeStorage.isEncryptionAvailable())throw Error("OS encryption unavailable");
 fs.mkdirSync(directory,{recursive:true,mode:0o700});
 const file=path.join(directory,"replay-store.v1");
 let entries={};
 if(fs.existsSync(file)){
  const record=JSON.parse(fs.readFileSync(file,"utf8"));
  if(record.version!==1||record.ownerPin!==ownerPin||typeof record.encrypted!=="string")throw Error("Replay store integrity failure");
  const decoded=JSON.parse(safeStorage.decryptString(Buffer.from(record.encrypted,"base64")));
  if(!decoded||typeof decoded!=="object"||Array.isArray(decoded))throw Error("Invalid replay store");
  entries=decoded;
 }
 function persist(){
  const record={version:1,ownerPin,encrypted:safeStorage.encryptString(JSON.stringify(entries)).toString("base64")};
  const tmp=file+"."+process.pid+"."+crypto.randomBytes(6).toString("hex");
  try{fs.writeFileSync(tmp,JSON.stringify(record),{mode:0o600,flag:"wx"});fs.renameSync(tmp,file);}
  finally{if(fs.existsSync(tmp))fs.unlinkSync(tmp);}
 }
 function seen(id){if(!UUID.test(id))throw Error("Invalid message ID");return Object.hasOwn(entries,id);}
 function record(id,expiresAt){
  if(!UUID.test(id)||typeof expiresAt!=="string"||!Number.isFinite(Date.parse(expiresAt)))throw Error("Invalid replay entry");
  if(seen(id))return false;
  const now=Date.now();
  for(const [key,expiration]of Object.entries(entries))if(Date.parse(expiration)<now-86400000)delete entries[key];
  if(Object.keys(entries).length>=20000)throw Error("Replay store capacity exceeded");
  entries[id]=expiresAt;
  persist();
  return true;
 }
 return {seen,record};
}
module.exports={createReplayStore};
