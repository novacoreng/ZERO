import test from "node:test";import assert from "node:assert/strict";import{OFFLINE_POLICY,classifyConnection,retryDelaySeconds,nextOutboxState,validateOutboxId}from "../src/offline-low-bandwidth.js";
test("validates outbox ids",()=>{assert.equal(validateOutboxId("outbox_12345678901234"),true);assert.equal(validateOutboxId("bad"),false)});
test("classifies poor connections",()=>{assert.equal(classifyConnection(4000,0.02),"VERY_POOR");assert.equal(classifyConnection(1500,0.1),"POOR");assert.equal(classifyConnection(500,0.5),"FAIR");assert.equal(classifyConnection(100,10),"GOOD")});
test("retry backoff is bounded",()=>{assert.equal(retryDelaySeconds(0),2);assert.equal(retryDelaySeconds(20),300)});
test("outbox lifecycle",()=>{assert.equal(nextOutboxState("QUEUED","SEND"),"SENDING");assert.equal(nextOutboxState("SENDING","SUCCESS"),"SENT");assert.equal(nextOutboxState("SENDING","BLOCK"),"BLOCKED")});
test("offline queue never stores plaintext",()=>{assert.equal(OFFLINE_POLICY.encryptedOutboxOnly,true);assert.equal(OFFLINE_POLICY.plaintextOutboxStorage,false)});
