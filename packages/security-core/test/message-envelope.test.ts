import test from "node:test";
import assert from "node:assert/strict";
import {
  MESSAGE_POLICY,
  type MessageEnvelope,
  nextRetryDelay,
  validateMessageEnvelope,
  validateOpaqueId,
} from "../src/message-envelope.js";

test("validates opaque message identifiers", () => {
  assert.equal(validateOpaqueId("message_12345678901234"), true);
  assert.equal(validateOpaqueId("short"), false);
});

test("validates ciphertext-only message envelope", () => {
  const envelope: MessageEnvelope = {
    version: 1,
    messageId: "message_12345678901234",
    conversationId: "conversation_1234567",
    sessionId: "session_12345678901234",
    senderDeviceId: "device_12345678901234",
    clientSequence: 1,
    kind: "TEXT",
    ciphertext: new Uint8Array([1, 2]),
    aadDigest: new Uint8Array(32),
    createdAt: new Date().toISOString(),
  };
  assert.equal(validateMessageEnvelope(envelope), true);
});

test("rejects empty or oversized ciphertext", () => {
  const base: Omit<MessageEnvelope, "ciphertext"> = {
    version: 1,
    messageId: "message_12345678901234",
    conversationId: "conversation_1234567",
    sessionId: "session_12345678901234",
    senderDeviceId: "device_12345678901234",
    clientSequence: 1,
    kind: "TEXT",
    aadDigest: new Uint8Array(32),
    createdAt: new Date().toISOString(),
  };

  assert.equal(validateMessageEnvelope({ ...base, ciphertext: new Uint8Array() }), false);
  assert.equal(
    validateMessageEnvelope({
      ...base,
      ciphertext: new Uint8Array(MESSAGE_POLICY.maxEnvelopeBytes + 1),
    }),
    false,
  );
});

test("retry delay is bounded", () => {
  assert.equal(nextRetryDelay(0), 500);
  assert.equal(nextRetryDelay(3), 4000);
  assert.equal(nextRetryDelay(99), 60000);
});

test("keeps plaintext off the server", () =>
  assert.equal(MESSAGE_POLICY.plaintextServerStorage, false));
