import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const alphabet="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function derivePin(pem){
 const key=crypto.createPublicKey(pem);
 if(key.asymmetricKeyType!=="ed25519")throw new Error("Only Ed25519 device keys are accepted");
 const digest=crypto.createHash("sha256").update(key.export({type:"spki",format:"der"})).digest();
 let value=BigInt("0x"+digest.subarray(0,10).toString("hex"));
 let result="";
 for(let i=0;i<16;i++){result=alphabet[Number(value%32n)]+result;value/=32n;}
 return result.match(/.{4}/g).join("-");
}
export class DeviceRegistry{
 constructor({file,clock=()=>Date.now()}){
  this.file=file;this.clock=clock;this.challenges=new Map();this.devices=new Map();this.sessions=new Map();this.encryptionKeys=new Map();
  if(file&&fs.existsSync(file)){
   const data=JSON.parse(fs.readFileSync(file,"utf8"));
   for(const entry of data.devices||[])this.devices.set(entry.pin,entry);
   for(const entry of data.encryptionKeys||[])this.encryptionKeys.set(entry.pin,entry);
  }
 }
 persist(){
  if(!this.file)return;
  fs.mkdirSync(path.dirname(this.file),{recursive:true,mode:0o700});
  const temp=this.file+"."+process.pid+"."+crypto.randomBytes(6).toString("hex")+".tmp";
  try{fs.writeFileSync(temp,JSON.stringify({version:1,devices:[...this.devices.values()],encryptionKeys:[...this.encryptionKeys.values()]}),{mode:0o600,flag:"wx"});fs.renameSync(temp,this.file);}
  finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
 }
 challenge(publicKey,purpose="register"){
  if(!["register","session"].includes(purpose))throw new Error("Invalid challenge purpose");
  if(typeof publicKey!=="string"||publicKey.length>2000)throw new Error("Invalid public key");
  const pin=derivePin(publicKey);
  const nonce="ZERO-AUTH-V1:"+crypto.randomBytes(32).toString("base64url");
  // Challenge is bound to the key, one-time, and expires after 60 seconds.
  this.challenges.set(nonce,{pin,publicKey,purpose,expires:this.clock()+60_000});
  if(this.challenges.size>10000)for(const [key,item] of this.challenges)if(item.expires<=this.clock())this.challenges.delete(key);
  return {pin,challenge:nonce,expiresInSeconds:60};
 }
 register({publicKey,challenge,signature}){
  const pending=this.challenges.get(challenge);
  this.challenges.delete(challenge);
  if(!pending||pending.purpose!=="register"||pending.expires<=this.clock()||pending.publicKey!==publicKey)throw new Error("Invalid or expired challenge");
  if(typeof signature!=="string"||!/^[A-Za-z0-9_-]{80,100}$/.test(signature))throw new Error("Invalid signature");
  const verified=crypto.verify(null,Buffer.from(challenge),crypto.createPublicKey(publicKey),Buffer.from(signature,"base64url"));
  if(!verified)throw new Error("Signature verification failed");
  const previous=this.devices.get(pending.pin);
  if(previous&&previous.publicKey!==publicKey)throw new Error("PIN collision");
  if(previous?.revoked)throw new Error("Device revoked");
  if(!previous){this.devices.set(pending.pin,{pin:pending.pin,publicKey,createdAt:new Date(this.clock()).toISOString(),revoked:false});this.persist();}
  return {pin:pending.pin,registered:true};
 }
 authenticate({publicKey,challenge,signature}){
  const pending=this.challenges.get(challenge);
  this.challenges.delete(challenge);
  if(!pending||pending.purpose!=="session"||pending.expires<=this.clock()||pending.publicKey!==publicKey)throw new Error("Invalid or expired session challenge");
  const registered=this.devices.get(pending.pin);
  if(!registered||registered.revoked||registered.publicKey!==publicKey)throw new Error("Device is not registered");
  if(typeof signature!=="string"||!/^[A-Za-z0-9_-]{80,100}$/.test(signature))throw new Error("Invalid signature");
  if(!crypto.verify(null,Buffer.from(challenge),crypto.createPublicKey(publicKey),Buffer.from(signature,"base64url")))throw new Error("Signature verification failed");
  const token=crypto.randomBytes(32).toString("base64url");
  const digest=crypto.createHash("sha256").update(token).digest("hex");
  const expires=this.clock()+15*60_000;
  this.sessions.set(digest,{pin:pending.pin,expires});
  return {accessToken:token,tokenType:"Bearer",expiresInSeconds:900,pin:pending.pin};
 }
 authorize(token){
  if(typeof token!=="string"||!/^[A-Za-z0-9_-]{43}$/.test(token))return null;
  const digest=crypto.createHash("sha256").update(token).digest("hex");
  const session=this.sessions.get(digest);
  if(!session||session.expires<=this.clock()){this.sessions.delete(digest);return null;}
  const device=this.devices.get(session.pin);
  return device&&!device.revoked?{pin:device.pin,publicKey:device.publicKey}:null;
 }
 publishEncryptionKey(pin,publicKey,signature){
  const device=this.devices.get(pin);
  if(!device||device.revoked)throw new Error("Device not registered");
  if(typeof publicKey!=="string"||publicKey.length>512)throw new Error("Invalid encryption public key");
  const key=crypto.createPublicKey(publicKey);
  if(key.asymmetricKeyType!=="x25519")throw new Error("Only X25519 encryption keys accepted");
  const canonical=key.export({format:"pem",type:"spki"}).toString();
  if(canonical!==publicKey)throw new Error("Noncanonical encryption key");
  if(typeof signature!=="string"||!/^[A-Za-z0-9_-]{80,100}$/.test(signature))throw new Error("Invalid signature");
  const statement="ZERO-ENCRYPTION-KEY-V1|"+pin+"|"+canonical;
  if(!crypto.verify(null,Buffer.from(statement),crypto.createPublicKey(device.publicKey),Buffer.from(signature,"base64url")))throw new Error("Invalid encryption key signature");
  const existing=this.encryptionKeys.get(pin);
  if(existing&&existing.publicKey!==canonical)throw new Error("Encryption key rotation not yet supported");
  if(!existing){
   this.encryptionKeys.set(pin,{pin,publicKey:canonical,signature,identityPublicKey:device.publicKey,createdAt:new Date(this.clock()).toISOString()});
   this.persist();
  }
  return {published:true,pin};
 }
 lookupEncryptionKey(pin){
  const device=this.lookup(pin),entry=this.encryptionKeys.get(pin);
  if(!device||!entry||entry.identityPublicKey!==device.publicKey)return null;
  return {...entry};
 }
 lookup(pin){
  if(typeof pin!=="string"||!(/^[A-Z2-9]{4}(?:-[A-Z2-9]{4}){3}$/.test(pin)))return null;
  const entry=this.devices.get(pin);
  return entry&&!entry.revoked?{pin:entry.pin,publicKey:entry.publicKey}:null;
 }
}
