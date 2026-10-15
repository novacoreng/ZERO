"use strict";
const crypto=require("node:crypto");
const {fingerprint}=require("./device-identity.cjs");
const {encrypt,decrypt}=require("./secure-envelope.cjs");
const FIELDS=["algorithm","ephemeralPublicKey","salt","nonce","ciphertext"];
function payload(sender,recipient,envelope){
 if(!envelope||typeof envelope!=="object"||FIELDS.some(k=>typeof envelope[k]!=="string"))throw new Error("Invalid envelope");
 return Buffer.from(JSON.stringify(["ZERO-SIGNED-MESSAGE-V1",sender,recipient,...FIELDS.map(k=>envelope[k])]),"utf8");
}
function createSignedMessage({identity,recipient,recipientPublicKey,plaintext}){
 if(!identity||fingerprint(identity.publicKey)!==identity.pin)throw new Error("Invalid signing identity");
 const encrypted=encrypt({sender:identity.pin,recipient,recipientPublicKey,plaintext});
 const signature=crypto.sign(null,payload(identity.pin,recipient,encrypted),crypto.createPrivateKey(identity.privateKey)).toString("base64url");
 return {...encrypted,signature};
}
function openSignedMessage({sender,recipient,identityPublicKey,recipientPrivateKey,envelope}){
 if(fingerprint(identityPublicKey)!==sender)throw new Error("Sender PIN mismatch");
 if(typeof envelope?.signature!=="string"||!/^[A-Za-z0-9_-]{80,100}$/.test(envelope.signature))throw new Error("Missing sender signature");
 const verified=crypto.verify(null,payload(sender,recipient,envelope),crypto.createPublicKey(identityPublicKey),Buffer.from(envelope.signature,"base64url"));
 if(!verified)throw new Error("Sender signature mismatch");
 return decrypt({sender,recipient,recipientPrivateKey,envelope});
}
module.exports={createSignedMessage,openSignedMessage};
