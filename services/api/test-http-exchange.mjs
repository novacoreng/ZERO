import assert from "node:assert/strict";
import crypto from "node:crypto";
import {spawn} from "node:child_process";
import {createRequire} from "node:module";
import {fileURLToPath} from "node:url";
import {dirname,resolve} from "node:path";
const require=createRequire(import.meta.url);
const {fingerprint}=require("../../apps/desktop/device-identity.cjs");
const {generateEncryptionKeys}=require("../../apps/desktop/secure-envelope.cjs");
const {createSignedMessage,openSignedMessage}=require("../../apps/desktop/signed-message.cjs");
const {verifyPublishedKey}=require("../../apps/desktop/encryption-identity.cjs");
const serverFile=resolve(dirname(fileURLToPath(import.meta.url)),"src/server.mjs");
const port=20000+crypto.randomInt(20000);
const base="http://127.0.0.1:"+port;
const child=spawn(process.execPath,[serverFile],{env:{...process.env,PORT:String(port),ZERO_DEVICE_REGISTRY_FILE:""},stdio:["ignore","pipe","pipe"]});
let stderr="";
child.stderr.on("data",chunk=>{stderr+=chunk.toString();});
async function request(route,method="GET",body,token){
 const response=await fetch(base+route,{method,headers:{"content-type":"application/json",...(token?{authorization:"Bearer "+token}:{})},body:body===undefined?undefined:JSON.stringify(body)});
 return {status:response.status,data:await response.json()};
}
async function ready(){
 for(let i=0;i<100;i++){
  if(child.exitCode!==null)throw Error("API exited: "+stderr);
  try{const result=await request("/health");if(result.status===200)return;}catch{}
  await new Promise(resolve=>setTimeout(resolve,50));
 }
 throw Error("API startup timeout: "+stderr);
}
function makeDevice(){
 const identity=crypto.generateKeyPairSync("ed25519",{publicKeyEncoding:{type:"spki",format:"pem"},privateKeyEncoding:{type:"pkcs8",format:"pem"}});
 identity.pin=fingerprint(identity.publicKey);
 return {identity,encryption:generateEncryptionKeys()};
}
function sign(identity,statement){return crypto.sign(null,Buffer.from(statement),crypto.createPrivateKey(identity.privateKey)).toString("base64url");}
async function activate(device){
 const {identity,encryption}=device;
 const challenge=await request("/v1/devices/challenge","POST",{publicKey:identity.publicKey});
 assert.equal(challenge.status,200);
 assert.equal(challenge.data.pin,identity.pin);
 const registered=await request("/v1/devices/register","POST",{publicKey:identity.publicKey,challenge:challenge.data.challenge,signature:sign(identity,challenge.data.challenge)});
 assert.equal(registered.status,200);
 const authChallenge=await request("/v1/session/challenge","POST",{publicKey:identity.publicKey});
 const auth=await request("/v1/session/authenticate","POST",{publicKey:identity.publicKey,challenge:authChallenge.data.challenge,signature:sign(identity,authChallenge.data.challenge)});
 assert.equal(auth.status,200);
 const proof=sign(identity,"ZERO-ENCRYPTION-KEY-V1|"+identity.pin+"|"+encryption.publicKey);
 const published=await request("/v1/encryption-keys/publish","POST",{publicKey:encryption.publicKey,signature:proof},auth.data.accessToken);
 assert.equal(published.status,200);
 return auth.data.accessToken;
}
try{
 await ready();
 const alice=makeDevice(),bob=makeDevice();
 const aliceToken=await activate(alice),bobToken=await activate(bob);
 const bobKey=await request("/v1/encryption-keys/"+bob.identity.pin);
 assert.equal(bobKey.status,200);
 assert.equal(verifyPublishedKey(bob.identity.pin,bobKey.data),true);
 const encrypted=createSignedMessage({identity:alice.identity,recipient:bob.identity.pin,recipientPublicKey:bobKey.data.publicKey,plaintext:"ZERO integration: Alice to Bob"});
 const queued=await request("/v1/messages/send","POST",{recipient:bob.identity.pin,encrypted},aliceToken);
 assert.equal(queued.status,202);
 assert.equal(queued.data.queued,true);
 const inbox=await request("/v1/messages/inbox","GET",undefined,bobToken);
 assert.equal(inbox.status,200);
 assert.equal(inbox.data.messages.length,1);
 const item=inbox.data.messages[0];
 assert.equal(item.sender,alice.identity.pin);
 const sender=await request("/v1/devices/"+item.sender);
 assert.equal(sender.status,200);
 assert.equal(fingerprint(sender.data.publicKey),item.sender);
 assert.equal(openSignedMessage({sender:item.sender,recipient:bob.identity.pin,identityPublicKey:sender.data.publicKey,recipientPrivateKey:bob.encryption.privateKey,envelope:item.encrypted}),"ZERO integration: Alice to Bob");
 const acknowledged=await request("/v1/messages/acknowledge","POST",{id:item.id},bobToken);
 assert.equal(acknowledged.status,200);
 assert.equal(acknowledged.data.acknowledged,true);
 const empty=await request("/v1/messages/inbox","GET",undefined,bobToken);
 assert.equal(empty.data.messages.length,0);
 const unsigned=await request("/v1/messages/send","POST",{recipient:bob.identity.pin,encrypted:{...encrypted,signature:undefined}},aliceToken);
 assert.equal(unsigned.status,400);
 const unauthorized=await request("/v1/messages/inbox");
 assert.equal(unauthorized.status,401);
 console.log("ZERO HTTP two-device registration, authenticated encryption, relay and acknowledgement passed");
}finally{child.kill();}
