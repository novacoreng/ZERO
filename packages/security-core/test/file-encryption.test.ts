import test from "node:test";import assert from "node:assert/strict";import{FILE_ENCRYPTION_POLICY,validateFileKey,validateFileNonce,validateFileEncryptionEnvelope,buildFileAssociatedData}from "../src/file-encryption.js";
test("requires 256-bit object keys",()=>{assert.equal(validateFileKey(new Uint8Array(32)),true);assert.equal(validateFileKey(new Uint8Array(31)),false)});
test("requires 96-bit nonces",()=>{assert.equal(validateFileNonce(new Uint8Array(12)),true);assert.equal(validateFileNonce(new Uint8Array(24)),false)});
test("builds domain-separated associated data",()=>{assert.equal(new TextDecoder().decode(buildFileAssociatedData("obj_12345678901234","key_12345678901234")),"ZERO|1|zero.file.v1|obj_12345678901234|key_12345678901234")});
test("validates encrypted envelopes",()=>{assert.equal(validateFileEncryptionEnvelope({version:1,profile:"zero.file.v1",objectId:"obj_12345678901234",keyId:"key_12345678901234",nonce:new Uint8Array(12),ciphertext:new Uint8Array([1]),tag:new Uint8Array(16),plaintextSize:1,encryptedSize:1}),true)});
test("policy is client-side only",()=>assert.equal(FILE_ENCRYPTION_POLICY.serverPlaintext,false));
