import test from "node:test";import assert from "node:assert/strict";import{DATA_DROP_POLICY,validateDropId,validateDropTtl,validateMaxDownloads,canAccessDrop,nextDropState}from "../src/data-drop.js";
test("validates drop identifiers",()=>{assert.equal(validateDropId("drop_12345678901234"),true);assert.equal(validateDropId("bad"),false)});
test("enforces drop TTL",()=>{assert.equal(validateDropTtl(86400),true);assert.equal(validateDropTtl(DATA_DROP_POLICY.maxTtlSeconds),true);assert.equal(validateDropTtl(DATA_DROP_POLICY.maxTtlSeconds+1),false)});
test("validates download limits",()=>{assert.equal(validateMaxDownloads(undefined),true);assert.equal(validateMaxDownloads(1),true);assert.equal(validateMaxDownloads(0),false)});
test("expired and inactive drops deny access",()=>{const now=new Date("2026-09-23T00:00:00Z");assert.equal(canAccessDrop("ACTIVE",now,new Date("2026-09-23T00:01:00Z")),true);assert.equal(canAccessDrop("EXPIRED",now,new Date("2026-09-23T00:01:00Z")),false)});
test("drop lifecycle supports revoke and destroy",()=>{assert.equal(nextDropState("ACTIVE","REVOKE"),"REVOKED");assert.equal(nextDropState("REVOKED","DESTROY"),"DESTROYED")});
