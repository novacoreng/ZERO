import test from "node:test";import assert from "node:assert/strict";import{ABUSE_POLICY,validateTrustLevel,decideAbuse,shouldInspectContent}from "../src/abuse-controls.js";
test("validates trust levels",()=>{assert.equal(validateTrustLevel("NEW"),true);assert.equal(validateTrustLevel("RESTRICTED"),true);assert.equal(validateTrustLevel("BAD"),false)});
test("abuse decisions avoid plaintext inspection",()=>{assert.equal(shouldInspectContent(),false);assert.equal(ABUSE_POLICY.automatedSignalsMetadataOnly,true)});
test("rate and auth signals produce friction",()=>{assert.equal(decideAbuse("AUTH_FAILURES","NEW").action,"CHALLENGE");assert.equal(decideAbuse("RATE_LIMIT","TRUSTED").action,"THROTTLE")});
test("report spikes route to review",()=>{assert.equal(decideAbuse("REPORT_SPIKE","STANDARD").action,"REVIEW")});
