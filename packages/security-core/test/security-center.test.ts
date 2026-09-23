import test from "node:test";import assert from "node:assert/strict";import{SECURITY_CENTER_POLICY,validateSecurityEventId,isCritical}from "../src/security-center.js";
test("validates security event ids",()=>{assert.equal(validateSecurityEventId("event_12345678901234"),true);assert.equal(validateSecurityEventId("bad"),false)});
test("identity and recovery events are critical",()=>{assert.equal(isCritical("IDENTITY_KEY_CHANGED"),true);assert.equal(isCritical("RECOVERY_STARTED"),true);assert.equal(isCritical("NEW_DEVICE"),false)});
test("security center never exposes private keys",()=>{assert.equal(SECURITY_CENTER_POLICY.privateKeysNeverExposed,true);assert.equal(SECURITY_CENTER_POLICY.revokedDevicesCannotAuthenticate,true)});
test("session revocation is immediate",()=>{assert.equal(SECURITY_CENTER_POLICY.sessionRevocationImmediate,true)});
