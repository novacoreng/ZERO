"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const os=require("node:os");
const path=require("node:path");
const {createInboxStore}=require("./inbox-store.cjs");
const directory=fs.mkdtempSync(path.join(os.tmpdir(),"zero-inbox-"));
const storage={isEncryptionAvailable:()=>true,encryptString:s=>Buffer.from(s).reverse(),decryptString:b=>Buffer.from(b).reverse().toString()};
const pin="ABCD-EFGH-JKLM-NPQR";
const message={id:"123e4567-e89b-42d3-a456-426614174000",sender:"STUV-WXYZ-2345-6789",plaintext:"Verified secret message",receivedAt:new Date().toISOString(),expiresAt:new Date(Date.now()+60000).toISOString()};
try{
 const first=createInboxStore(directory,storage,pin);
 assert.equal(first.has(message.id),false);
 assert.equal(first.save(message),true);
 assert.equal(first.save(message),false);
 assert.deepEqual(first.list(),[message]);
 const disk=fs.readFileSync(path.join(directory,"inbox.v1"),"utf8");
 assert.equal(disk.includes(message.plaintext),false);
 const reopened=createInboxStore(directory,storage,pin);
 assert.deepEqual(reopened.list(),[message]);
 assert.throws(()=>createInboxStore(directory,storage,"OTHER-DEVICE-0000"));
 assert.throws(()=>reopened.save({...message,id:"invalid"}));
}finally{fs.rmSync(directory,{recursive:true,force:true});}
console.log("ZERO persistent encrypted inbox tests passed");
