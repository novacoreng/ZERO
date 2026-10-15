"use strict";
const crypto=require("node:crypto");

/**
 * Prototype encryption primitives. X25519 ephemeral-static ECDH, HKDF-SHA256,
 * AES-256-GCM, and AAD binding to sender/recipient PINs.
 * NOT a ratcheting protocol, and does not establish identity authentication.
 */
const PIN=/^[A-Z2-9]{4}(?:-[A-Z2-9]{4}){3}$/;
function generateEncryptionKeys(){
 return crypto.generateKeyPairSync("x25519",{
  publicKeyEncoding:{format:"pem",type:"spki"},
  privateKeyEncoding:{format:"pem",type:"pkcs8"}
 });
}
function derive(shared,salt,sender,recipient){
 return crypto.hkdfSync("sha256",shared,salt,Buffer.from("ZERO-ENVELOPE-V1|"+sender+"|"+recipient),32);
}
function encrypt({sender,recipient,recipientPublicKey,plaintext}){
 if(!PIN.test(sender)||!PIN.test(recipient)||sender===recipient)throw new Error("Invalid participants");
 if(typeof plaintext!=="string"||Buffer.byteLength(plaintext,"utf8")>32768||!plaintext.length)throw new Error("Invalid plaintext");
 const recipientKey=crypto.createPublicKey(recipientPublicKey);
 if(recipientKey.asymmetricKeyType!=="x25519")throw new Error("Recipient encryption key must be X25519");
 const ephemeral=crypto.generateKeyPairSync("x25519");
 const salt=crypto.randomBytes(32),nonce=crypto.randomBytes(12);
 const shared=crypto.diffieHellman({privateKey:ephemeral.privateKey,publicKey:recipientKey});
 const key=derive(shared,salt,sender,recipient);
 const aad=Buffer.from("ZERO-ENVELOPE-V1|"+sender+"|"+recipient);
 const cipher=crypto.createCipheriv("aes-256-gcm",key,nonce);
 cipher.setAAD(aad);
 const ciphertext=Buffer.concat([cipher.update(plaintext,"utf8"),cipher.final()]);
 const tag=cipher.getAuthTag();
 return {algorithm:"x25519-hkdf-aes256gcm-v1",ephemeralPublicKey:ephemeral.publicKey.export({format:"pem",type:"spki"}).toString(),salt:salt.toString("base64url"),nonce:nonce.toString("base64url"),ciphertext:Buffer.concat([ciphertext,tag]).toString("base64url")};
}
function decrypt({sender,recipient,recipientPrivateKey,envelope}){
 if(!PIN.test(sender)||!PIN.test(recipient)||!envelope||envelope.algorithm!=="x25519-hkdf-aes256gcm-v1")throw new Error("Invalid envelope");
 const ephemeral=crypto.createPublicKey(envelope.ephemeralPublicKey);
 if(ephemeral.asymmetricKeyType!=="x25519")throw new Error("Invalid ephemeral key");
 const privateKey=crypto.createPrivateKey(recipientPrivateKey);
 if(privateKey.asymmetricKeyType!=="x25519")throw new Error("Invalid recipient key");
 const salt=Buffer.from(envelope.salt,"base64url"),nonce=Buffer.from(envelope.nonce,"base64url"),payload=Buffer.from(envelope.ciphertext,"base64url");
 if(salt.length!==32||nonce.length!==12||payload.length<16||payload.length>32784)throw new Error("Invalid envelope lengths");
 const key=derive(crypto.diffieHellman({privateKey,publicKey:ephemeral}),salt,sender,recipient);
 const decipher=crypto.createDecipheriv("aes-256-gcm",key,nonce);
 decipher.setAAD(Buffer.from("ZERO-ENVELOPE-V1|"+sender+"|"+recipient));
 decipher.setAuthTag(payload.subarray(-16));
 return Buffer.concat([decipher.update(payload.subarray(0,-16)),decipher.final()]).toString("utf8");
}
module.exports={generateEncryptionKeys,encrypt,decrypt};
