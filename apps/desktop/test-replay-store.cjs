"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const os=require("node:os");
const path=require("node:path");
const {createReplayStore}=require("./replay-store.cjs");
const dir=fs.mkdtempSync(path.join(os.tmpdir(),"zero-replay-"));
const safeStorage={isEncryptionAvailable:()=>true,encryptString:s=>Buffer.from(s).reverse(),decryptString:b=>Buffer.from(b).reverse().toString()};
const id="123e4567-e89b-42d3-a456-426614174000";
try{
 const first=createReplayStore(dir,safeStorage,"ABCD-EFGH-JKLM-NPQR");
 assert.equal(first.seen(id),false);
 assert.equal(first.record(id,new Date(Date.now()+60000).toISOString()),true);
 assert.equal(first.record(id,new Date(Date.now()+60000).toISOString()),false);
 const second=createReplayStore(dir,safeStorage,"ABCD-EFGH-JKLM-NPQR");
 assert.equal(second.seen(id),true);
 assert.throws(()=>createReplayStore(dir,safeStorage,"STUV-WXYZ-2345-6789"));
 assert.throws(()=>second.record("invalid",new Date().toISOString()));
}finally{fs.rmSync(dir,{recursive:true,force:true});}
console.log("ZERO encrypted replay store tests passed");
