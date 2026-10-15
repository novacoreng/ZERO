"use strict";
const assert=require("node:assert/strict");
const crypto=require("node:crypto");
const {fingerprint}=require("./device-identity.cjs");
const {generateEncryptionKeys}=require("./secure-envelope.cjs");
const {createSignedMessage,openSignedMessage}=require("./signed-message.cjs");
const {verifyPublishedKey}=require("./encryption-identity.cjs");
function device(){
 const identity=crypto.generateKeyPairSync("ed25519",{publicKeyEncoding:{type:"spki",format:"pem"},privateKeyEncoding:{type:"pkcs8",format:"pem"}});
 identity.pin=fingerprint(identity.publicKey);
 const encryption=generateEncryptionKeys();
 const signature=crypto.sign(null,Buffer.from("ZERO-ENCRYPTION-KEY-V1|"+identity.pin+"|"+encryption.publicKey),crypto.createPrivateKey(identity.privateKey)).toString("base64url");
 return {identity,encryption,record:{pin:identity.pin,identityPublicKey:identity.publicKey,publicKey:encryption.publicKey,signature}};
}
const alice=device(),bob=device();
assert.equal(verifyPublishedKey(bob.identity.pin,bob.record),true);
assert.equal(verifyPublishedKey(alice.identity.pin,alice.record),true);
const outgoing=createSignedMessage({identity:alice.identity,recipient:bob.identity.pin,recipientPublicKey:bob.record.publicKey,plaintext:"Alice to Bob"});
assert.equal(openSignedMessage({sender:alice.identity.pin,recipient:bob.identity.pin,identityPublicKey:alice.identity.publicKey,recipientPrivateKey:bob.encryption.privateKey,envelope:outgoing}),"Alice to Bob");
const reply=createSignedMessage({identity:bob.identity,recipient:alice.identity.pin,recipientPublicKey:alice.record.publicKey,plaintext:"Bob to Alice"});
assert.equal(openSignedMessage({sender:bob.identity.pin,recipient:alice.identity.pin,identityPublicKey:bob.identity.publicKey,recipientPrivateKey:alice.encryption.privateKey,envelope:reply}),"Bob to Alice");
assert.throws(()=>openSignedMessage({sender:alice.identity.pin,recipient:bob.identity.pin,identityPublicKey:bob.identity.publicKey,recipientPrivateKey:bob.encryption.privateKey,envelope:outgoing}));
assert.throws(()=>openSignedMessage({sender:alice.identity.pin,recipient:bob.identity.pin,identityPublicKey:alice.identity.publicKey,recipientPrivateKey:alice.encryption.privateKey,envelope:outgoing}));
console.log("ZERO two-device crypto exchange tests passed (local only, no HTTP transport)");
