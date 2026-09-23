import test from "node:test";import assert from "node:assert/strict";import{FILE_POLICY,validateFileName,validateFileSize,validateMediaType,validateChunkSize,assertPackaging}from "../src/universal-file.js";
test("validates safe file names",()=>{assert.equal(validateFileName("photo.jpg"),true);assert.equal(validateFileName(""),false);assert.equal(validateFileName("bad\0name"),false)});
test("enforces object size",()=>{assert.equal(validateFileSize(0),true);assert.equal(validateFileSize(FILE_POLICY.maxObjectBytes),true);assert.equal(validateFileSize(FILE_POLICY.maxObjectBytes+1),false)});
test("validates media types",()=>{assert.equal(validateMediaType("image/jpeg"),true);assert.equal(validateMediaType("invalid"),false)});
test("validates chunk sizes",()=>{assert.equal(validateChunkSize(FILE_POLICY.minChunkBytes),true);assert.equal(validateChunkSize(FILE_POLICY.maxChunkBytes),true);assert.equal(validateChunkSize(1),false)});
test("folders must be packaged",()=>assert.throws(()=>assertPackaging("SINGLE_FILE",true)));
