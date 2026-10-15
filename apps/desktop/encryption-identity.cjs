"use strict";
const crypto=require("node:crypto");
const fs=require("node:fs");
const path=require("node:path");
const {fingerprint}=require("./device-identity.cjs");
const {generateEncryptionKeys}=require("./secure-envelope.cjs");
function loadOrCreateEncryptionIdentity(directory,safeStorage,identity){
 if(!identity||!identity.privateKey||!identity.pin||fingerprint(identity.publicKey)!==identity.pin)throw new Error("Invalid signing identity");
 if(!safeStorage.isEncryptionAvailable())throw new Error("OS encryption unavailable");
 fs.mkdirSync(directory,{recursive:true,mode:0o700});
 const file=path.join(directory,"encryption-identity.v1");
 let publicKey,privateKey;
 if(fs.existsSync(file)){
  const record=JSON.parse(fs.readFileSync(file,"utf8"));
  if(record.version!==1||record.ownerPin!==identity.pin||typeof record.privateKeyEncrypted!=="string")throw new Error("Encryption identity record mismatch");
  privateKey=safeStorage.decryptString(Buffer.from(record.privateKeyEncrypted,"base64"));
  publicKey=crypto.createPublicKey(crypto.createPrivateKey(privateKey)).export({type:"spki",format:"pem"}).toString();
  if(publicKey!==record.publicKey)throw new Error("Encryption identity integrity failure");
 }else{
  const pair=generateEncryptionKeys();
  publicKey=pair.publicKey;privateKey=pair.privateKey;
  const record={version:1,ownerPin:identity.pin,publicKey,privateKeyEncrypted:safeStorage.encryptString(privateKey).toString("base64")};
  const fd=fs.openSync(file,"wx",0o600);
  try{fs.writeFileSync(fd,JSON.stringify(record));fs.fsyncSync(fd);}finally{fs.closeSync(fd);}
 }
 if(crypto.createPublicKey(publicKey).asymmetricKeyType!=="x25519")throw new Error("Invalid encryption key type");
 const statement="ZERO-ENCRYPTION-KEY-V1|"+identity.pin+"|"+publicKey;
 const signature=crypto.sign(null,Buffer.from(statement),crypto.createPrivateKey(identity.privateKey)).toString("base64url");
 return {publicKey,privateKey,signature};
}
function verifyPublishedKey(expectedPin,record){
 if(!record||record.pin!==expectedPin||typeof record.identityPublicKey!=="string"||typeof record.publicKey!=="string"||typeof record.signature!=="string")return false;
 try{
  if(fingerprint(record.identityPublicKey)!==expectedPin)return false;
  const key=crypto.createPublicKey(record.publicKey);
  if(key.asymmetricKeyType!=="x25519"||key.export({type:"spki",format:"pem"}).toString()!==record.publicKey)return false;
  return crypto.verify(null,Buffer.from("ZERO-ENCRYPTION-KEY-V1|"+expectedPin+"|"+record.publicKey),crypto.createPublicKey(record.identityPublicKey),Buffer.from(record.signature,"base64url"));
 }catch{return false;}
}
module.exports={loadOrCreateEncryptionIdentity,verifyPublishedKey};
