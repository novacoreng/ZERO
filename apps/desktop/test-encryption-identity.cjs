"use strict";
const assert=require("node:assert/strict");
const crypto=require("node:crypto");
const fs=require("node:fs");
const os=require("node:os");
const path=require("node:path");
const {fingerprint}=require("./device-identity.cjs");
const {loadOrCreateEncryptionIdentity,verifyPublishedKey}=require("./encryption-identity.cjs");
const pair=crypto.generateKeyPairSync("ed25519",{publicKeyEncoding:{format:"pem",type:"spki"},privateKeyEncoding:{format:"pem",type:"pkcs8"}});
const identity={...pair,pin:fingerprint(pair.publicKey)};
const storage={isEncryptionAvailable:()=>true,encryptString:s=>Buffer.from(s).reverse(),decryptString:b=>Buffer.from(b).reverse().toString()};
const dir=fs.mkdtempSync(path.join(os.tmpdir(),"zero-encryption-test-"));
try{
 const first=loadOrCreateEncryptionIdentity(dir,storage,identity);
 const second=loadOrCreateEncryptionIdentity(dir,storage,identity);
 assert.equal(first.publicKey,second.publicKey);
 assert.equal(first.privateKey,second.privateKey);
 const record={pin:identity.pin,publicKey:first.publicKey,signature:first.signature,identityPublicKey:identity.publicKey};
 assert.equal(verifyPublishedKey(identity.pin,record),true);
 assert.equal(verifyPublishedKey("ABCD-EFGH-JKLM-NPQR",record),false);
 assert.equal(verifyPublishedKey(identity.pin,{...record,signature:"A".repeat(86)}),false);
 assert.equal(verifyPublishedKey(identity.pin,{...record,publicKey:crypto.generateKeyPairSync("x25519").publicKey.export({format:"pem",type:"spki"}).toString()}),false);
 assert.throws(()=>loadOrCreateEncryptionIdentity(dir,{isEncryptionAvailable:()=>false},identity));
}finally{fs.rmSync(dir,{recursive:true,force:true});}
console.log("ZERO signed and protected encryption identity tests passed");
