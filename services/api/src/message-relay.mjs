import crypto from "node:crypto";

const PIN=/^[A-Z2-9]{4}(?:-[A-Z2-9]{4}){3}$/;
const B64=/^[A-Za-z0-9_-]+$/;

/**
 * Local development relay. Accepts only opaque, client-encrypted envelopes.
 * Does not perform encryption, manage recipient keys, or establish E2EE.
 */
export class MessageRelay {
 constructor({clock=()=>Date.now(),maxPerRecipient=500}={}){
  this.clock=clock;
  this.maxPerRecipient=maxPerRecipient;
  this.queues=new Map();
 }
 send(sender,recipient,encrypted){
  if(!PIN.test(sender)||!PIN.test(recipient))throw new Error("Invalid sender or recipient");
  if(sender===recipient)throw new Error("Self messaging is unsupported");
  if(!encrypted||typeof encrypted!=="object"||Array.isArray(encrypted))throw new Error("Invalid envelope");
  const {algorithm,nonce,ciphertext}=encrypted;
  if(algorithm!=="xchacha20poly1305-v1")throw new Error("Unsupported encryption envelope");
  if(typeof nonce!=="string"||nonce.length!==32||!B64.test(nonce))throw new Error("Invalid nonce");
  if(typeof ciphertext!=="string"||ciphertext.length<24||ciphertext.length>87384||!B64.test(ciphertext))throw new Error("Invalid ciphertext");
  if(Object.keys(encrypted).some(key=>!["algorithm","nonce","ciphertext"].includes(key)))throw new Error("Unexpected envelope field");
  const queue=this.queues.get(recipient)||[];
  if(queue.length>=this.maxPerRecipient)throw new Error("Recipient inbox full");
  const record={id:crypto.randomUUID(),sender,recipient,encrypted:{algorithm,nonce,ciphertext},receivedAt:new Date(this.clock()).toISOString()};
  queue.push(record);
  this.queues.set(recipient,queue);
  return {id:record.id,queued:true};
 }
 inbox(recipient){
  if(!PIN.test(recipient))throw new Error("Invalid recipient");
  return (this.queues.get(recipient)||[]).map(record=>({...record,encrypted:{...record.encrypted}}));
 }
 acknowledge(recipient,id){
  if(!PIN.test(recipient)||typeof id!=="string")throw new Error("Invalid acknowledgement");
  const queue=this.queues.get(recipient)||[];
  const index=queue.findIndex(item=>item.id===id);
  if(index<0)return {acknowledged:false};
  queue.splice(index,1);
  return {acknowledged:true};
 }
}
