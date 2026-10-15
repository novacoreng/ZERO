import crypto from "node:crypto";

const PIN=/^[A-Z2-9]{4}(?:-[A-Z2-9]{4}){3}$/;
const B64=/^[A-Za-z0-9_-]+$/;

/**
 * Local development relay. Accepts only opaque, client-encrypted envelopes.
 * Does not perform encryption, manage recipient keys, or establish E2EE.
 */
export class MessageRelay {
 constructor({clock=()=>Date.now(),maxPerRecipient=500,defaultTtlMs=24*60*60*1000}={}){
  this.clock=clock;
  this.maxPerRecipient=maxPerRecipient;
  this.defaultTtlMs=defaultTtlMs;
  this.queues=new Map();
 }
 send(sender,recipient,encrypted,ttlSeconds){
  if(!PIN.test(sender)||!PIN.test(recipient))throw new Error("Invalid sender or recipient");
  if(sender===recipient)throw new Error("Self messaging is unsupported");
  if(!encrypted||typeof encrypted!=="object"||Array.isArray(encrypted))throw new Error("Invalid envelope");
  const {algorithm,nonce,ciphertext,salt,ephemeralPublicKey}=encrypted;
  if(algorithm!=="x25519-hkdf-aes256gcm-v1")throw new Error("Unsupported encryption envelope");
  if(typeof nonce!=="string"||nonce.length!==16||!B64.test(nonce))throw new Error("Invalid nonce");
  if(typeof salt!=="string"||salt.length!==43||!B64.test(salt))throw new Error("Invalid salt");
  if(typeof ephemeralPublicKey!=="string"||ephemeralPublicKey.length>256||ephemeralPublicKey.length<80)throw new Error("Invalid ephemeral public key");
  let key;
  try{key=crypto.createPublicKey(ephemeralPublicKey);}catch{throw new Error("Invalid ephemeral public key");}
  if(key.asymmetricKeyType!=="x25519")throw new Error("Invalid ephemeral public key");
  if(typeof ciphertext!=="string"||ciphertext.length<24||ciphertext.length>87384||!B64.test(ciphertext))throw new Error("Invalid ciphertext");
  if(Object.keys(encrypted).some(key=>!["algorithm","nonce","ciphertext","salt","ephemeralPublicKey"].includes(key)))throw new Error("Unexpected envelope field");
  this.purge(recipient);
  const queue=this.queues.get(recipient)||[];
  if(queue.length>=this.maxPerRecipient)throw new Error("Recipient inbox full");
  const ttl=ttlSeconds===undefined?this.defaultTtlMs:Number(ttlSeconds)*1000;
  if(!Number.isSafeInteger(ttl)||ttl<10_000||ttl>7*24*60*60*1000)throw new Error("Invalid message expiration");
  const record={id:crypto.randomUUID(),sender,recipient,encrypted:{algorithm,nonce,ciphertext,salt,ephemeralPublicKey},receivedAt:new Date(this.clock()).toISOString(),expiresAt:new Date(this.clock()+ttl).toISOString()};
  queue.push(record);
  this.queues.set(recipient,queue);
  return {id:record.id,queued:true};
 }
 purge(recipient){
  const existing=this.queues.get(recipient);
  if(!existing)return;
  const now=this.clock();
  const active=existing.filter(record=>Date.parse(record.expiresAt)>now);
  if(active.length)this.queues.set(recipient,active);
  else this.queues.delete(recipient);
 }
 inbox(recipient){
  if(!PIN.test(recipient))throw new Error("Invalid recipient");
  this.purge(recipient);
  return (this.queues.get(recipient)||[]).map(record=>({...record,encrypted:{...record.encrypted}}));
 }
 acknowledge(recipient,id){
  if(!PIN.test(recipient)||typeof id!=="string")throw new Error("Invalid acknowledgement");
  this.purge(recipient);
  const queue=this.queues.get(recipient)||[];
  const index=queue.findIndex(item=>item.id===id);
  if(index<0)return {acknowledged:false};
  queue.splice(index,1);
  return {acknowledged:true};
 }
}
