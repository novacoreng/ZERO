"use strict";
const crypto=require("node:crypto");
const fs=require("node:fs");
const path=require("node:path");

function fingerprint(publicKeyPem){
 const der=crypto.createPublicKey(publicKeyPem).export({type:"spki",format:"der"});
 const digest=crypto.createHash("sha256").update(der).digest();
 // Public contact identifier, not an authentication credential.
 const alphabet="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
 let value=BigInt("0x"+digest.subarray(0,10).toString("hex"));
 let pin="";
 for(let i=0;i<16;i++){pin=alphabet[Number(value%BigInt(alphabet.length))]+pin;value/=BigInt(alphabet.length);}
 return pin.match(/.{1,4}/g).join("-");
}
function loadOrCreateIdentity(directory,safeStorage){
 if(!safeStorage.isEncryptionAvailable())throw new Error("OS secure storage is unavailable. Device activation is blocked.");
 fs.mkdirSync(directory,{recursive:true,mode:0o700});
 const file=path.join(directory,"identity.v1");
 if(fs.existsSync(file)){
  const data=JSON.parse(fs.readFileSync(file,"utf8"));
  if(data.version!==1||typeof data.publicKey!=="string"||typeof data.privateKeyEncrypted!=="string")throw new Error("Identity record is invalid");
  const privateKey=safeStorage.decryptString(Buffer.from(data.privateKeyEncrypted,"base64"));
  const derivedPublic=crypto.createPublicKey(crypto.createPrivateKey(privateKey)).export({type:"spki",format:"pem"}).toString();
  if(derivedPublic!==data.publicKey)throw new Error("Device identity integrity check failed");
  return {pin:fingerprint(data.publicKey),publicKey:data.publicKey,privateKey};
 }
 const keys=crypto.generateKeyPairSync("ed25519",{publicKeyEncoding:{type:"spki",format:"pem"},privateKeyEncoding:{type:"pkcs8",format:"pem"}});
 const record={version:1,publicKey:keys.publicKey,privateKeyEncrypted:safeStorage.encryptString(keys.privateKey).toString("base64")};
 const fd=fs.openSync(file,"wx",0o600);
 try{fs.writeFileSync(fd,JSON.stringify(record));fs.fsyncSync(fd);}finally{fs.closeSync(fd);}
 return {pin:fingerprint(keys.publicKey),publicKey:keys.publicKey,privateKey:keys.privateKey};
}
function signChallenge(identity,challenge){
 if(!identity||typeof identity.privateKey!=="string")throw new Error("Device identity unavailable");
 if(typeof challenge!=="string"||!/^ZERO-AUTH-V1:[A-Za-z0-9_-]{32,128}$/.test(challenge))throw new Error("Invalid authentication challenge");
 return crypto.sign(null,Buffer.from(challenge,"utf8"),crypto.createPrivateKey(identity.privateKey)).toString("base64url");
}
function verifyChallenge(publicKey,challenge,signature){
 if(typeof challenge!=="string"||!/^ZERO-AUTH-V1:[A-Za-z0-9_-]{32,128}$/.test(challenge))return false;
 if(typeof signature!=="string"||!/^[A-Za-z0-9_-]{80,100}$/.test(signature))return false;
 try{return crypto.verify(null,Buffer.from(challenge,"utf8"),crypto.createPublicKey(publicKey),Buffer.from(signature,"base64url"));}catch{return false;}
}
module.exports={fingerprint,loadOrCreateIdentity,signChallenge,verifyChallenge};
