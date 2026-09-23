import test from "node:test";import assert from "node:assert/strict";import{sanitizeFilename,validateMediaKind,nextMediaState,SECURE_MEDIA_POLICY}from "../src/secure-media.js";
test("sanitizes filenames",()=>{assert.equal(sanitizeFilename("../photo\0\n.jpg"),".._photo _.jpg");assert.ok(sanitizeFilename("a".repeat(400)).length<=255)});
test("validates media kinds",()=>{assert.equal(validateMediaKind("IMAGE"),true);assert.equal(validateMediaKind("NOPE"),false)});
test("enforces processing lifecycle",()=>{assert.equal(nextMediaState("UNPROCESSED","START"),"SANITIZING");assert.equal(nextMediaState("SANITIZING","SUCCESS"),"SANITIZED");assert.equal(nextMediaState("SANITIZED","START"),"SANITIZED")});
test("privacy policy strips location/device metadata",()=>{assert.equal(SECURE_MEDIA_POLICY.stripGps,true);assert.equal(SECURE_MEDIA_POLICY.stripDeviceMetadata,true);assert.equal(SECURE_MEDIA_POLICY.metadataPlaintextStorage,false)});
