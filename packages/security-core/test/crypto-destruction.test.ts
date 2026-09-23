import test from "node:test";import assert from "node:assert/strict";import{DESTRUCTION_POLICY,nextDestructionState,assertDestructionTransition,validateDestructionTargetId,validateKeyVersion,destructionEvidenceDigest}from "../src/crypto-destruction.js";
test("validates destruction target identifiers",()=>{assert.equal(validateDestructionTargetId("key_12345678901234"),true);assert.equal(validateDestructionTargetId("bad"),false)});
test("validates key versions",()=>{assert.equal(validateKeyVersion(1),true);assert.equal(validateKeyVersion(0),false)});
test("destruction is terminal and idempotent",()=>{assert.equal(nextDestructionState("ACTIVE"),"DESTROYING");assert.equal(nextDestructionState("DESTROYING"),"DESTROYED");assert.equal(nextDestructionState("DESTROYED"),"DESTROYED")});
test("rejects resurrection",()=>assert.throws(()=>assertDestructionTransition("DESTROYED","ACTIVE")));
test("policy forbids server plaintext",()=>assert.equal(DESTRUCTION_POLICY.plaintextServerStorage,false));
test("evidence digest is deterministic",async()=>{const a=new Uint8Array([1,2,3]);const x=await destructionEvidenceDigest(a);const y=await destructionEvidenceDigest(a);assert.deepEqual(new Uint8Array(x),new Uint8Array(y))});
