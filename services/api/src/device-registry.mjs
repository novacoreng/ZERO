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
  this.file=file;this.clock=clock;this.challenges=new Map();this.devices=new Map();
  if(file&&fs.existsSync(file)){
   const data=JSON.parse(fs.readFileSync(file,"utf8"));
   for(const entry of data.devices||[])this.devices.set(entry.pin,entry);
  }
 }
 persist(){
  if(!this.file)return;
  fs.mkdirSync(path.dirname(this.file),{recursive:true,mode:0o700});
  const temp=this.file+"."+process.pid+"."+crypto.randomBytes(6).toString("hex")+".tmp";
  try{fs.writeFileSync(temp,JSON.stringify({version:1,devices:[...this.devices.values()]}),{mode:0o600,flag:"wx"});fs.renameSync(temp,this.file);}
  finally{if(fs.existsSync(temp))fs.unlinkSync(temp);}
 }
 challenge(publicKey){
  if(typeof publicKey!=="string"||publicKey.length>2000)throw new Error("Invalid public key");
  const pin=derivePin(publicKey);
  const nonce="ZERO-AUTH-V1:"+crypto.randomBytes(32).toString("base64url");
  // Challenge is bound to the key, one-time, and expires after 60 seconds.
  this.challenges.set(nonce,{pin,publicKey,expires:this.clock()+60_000});
  if(this.challenges.size>10000)for(const [key,item] of this.challenges)if(item.expires<=this.clock())this.challenges.delete(key);
  return {pin,challenge:nonce,expiresInSeconds:60};
 }
 register({publicKey,challenge,signature}){
  const pending=this.challenges.get(challenge);
  this.challenges.delete(challenge);
  if(!pending||pending.expires<=this.clock()||pending.publicKey!==publicKey)throw new Error("Invalid or expired challenge");
  if(typeof signature!=="string"||!/^[A-Za-z0-9_-]{80,100}$/.test(signature))throw new Error("Invalid signature");
  const verified=crypto.verify(null,Buffer.from(challenge),crypto.createPublicKey(publicKey),Buffer.from(signature,"base64url"));
  if(!verified)throw new Error("Signature verification failed");
  const previous=this.devices.get(pending.pin);
  if(previous&&previous.publicKey!==publicKey)throw new Error("PIN collision");
  if(previous?.revoked)throw new Error("Device revoked");
  if(!previous){this.devices.set(pending.pin,{pin:pending.pin,publicKey,createdAt:new Date(this.clock()).toISOString(),revoked:false});this.persist();}
  return {pin:pending.pin,registered:true};
 }
 lookup(pin){
  if(typeof pin!=="string"||!(/^[A-Z2-9]{4}(?:-[A-Z2-9]{4}){3}$/.test(pin)))return null;
  const entry=this.devices.get(pin);
  return entry&&!entry.revoked?{pin:entry.pin,publicKey:entry.publicKey}:null;
 }
}
