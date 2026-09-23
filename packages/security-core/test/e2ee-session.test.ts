import test from "node:test";
import assert from "node:assert/strict";
import { E2EE_POLICY, assertE2eeProfile, validateCiphertextEnvelope, validateSessionId } from "../src/e2ee-session.js";

test("accepts the locked 1-to-1 E2EE profile", () => assert.equal(assertE2eeProfile("zero.msg.v1"), "zero.msg.v1"));
test("rejects unknown E2EE profiles", () => assert.throws(() => assertE2eeProfile("custom")));
test("validates ciphertext-only envelopes", () => { assert.equal(validateSessionId("session_12345678901234"), true); assert.equal(validateCiphertextEnvelope({version:1,sessionId:"session_12345678901234",senderDeviceId:"device_12345678901234",sequence:0,header:new Uint8Array([1]),ciphertext:new Uint8Array([2]),associatedDataDigest:new Uint8Array(32)}), true); });
test("keeps server plaintext and custom crypto forbidden", () => { assert.equal(E2EE_POLICY.plaintextServerStorage, false); assert.equal(E2EE_POLICY.plaintextServerProcessing, false); assert.equal(E2EE_POLICY.customCryptography, false); });
test("requires identity verification for key changes", () => assert.equal(E2EE_POLICY.identityVerificationRequiredForKeyChange, true));
