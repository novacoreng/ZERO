import test from "node:test";import assert from "node:assert/strict";import{UPLOAD_POLICY,assertChunkSize,validateChunk,nextUploadState}from "../src/resumable-upload.js";
test("enforces chunk bounds",()=>{assertChunkSize(UPLOAD_POLICY.minChunkBytes);assert.throws(()=>assertChunkSize(1));});
test("validates encrypted chunk envelope",()=>assert.equal(validateChunk({uploadId:"upload_12345678901234",chunkIndex:0,offsetBytes:0,sizeBytes:1,ciphertext:new Uint8Array([1]),integrityDigest:new Uint8Array(32),nonce:new Uint8Array(12)},1),true));
test("rejects malformed chunk",()=>assert.equal(validateChunk({uploadId:"upload_12345678901234",chunkIndex:1,offsetBytes:0,sizeBytes:1,ciphertext:new Uint8Array([1]),integrityDigest:new Uint8Array(32),nonce:new Uint8Array(12)},1),false));
test("upload state machine is monotonic",()=>{assert.equal(nextUploadState("CREATED","UPLOADING"),"UPLOADING");assert.equal(nextUploadState("UPLOADING","FINALIZING"),"FINALIZING");assert.throws(()=>nextUploadState("AVAILABLE","UPLOADING"));});
test("transport never carries plaintext",()=>assert.equal(UPLOAD_POLICY.plaintextTransport,false));
