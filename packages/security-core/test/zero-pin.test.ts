import test from "node:test";
import assert from "node:assert/strict";
import {
  ZERO_PIN_ALPHABET, ZERO_PIN_PATTERN, ZERO_PIN_POLICY,
  derivePinLookupDigest, generateZeroPin, isValidZeroPin, normalizeZeroPin
} from "../src/zero-pin.js";

test("normalizes and validates ZERO PINs", () => {
  assert.equal(normalizeZeroPin(" k7x9-42qm "), "K7X9-42QM");
  assert.equal(isValidZeroPin("K7X9-42QM"), true);
  assert.equal(isValidZeroPin("K7X9-42QI"), false);
  assert.equal(ZERO_PIN_PATTERN.test("K7X9-42QM"), true);
});

test("generates valid format from supplied randomness", () => {
  const pin = generateZeroPin(new Uint8Array([10,7,24,9,4,2,16,22]));
  assert.equal(pin.length, 9);
  assert.equal(isValidZeroPin(pin), true);
  assert.equal([...pin.replace("-", "")].every((c) => ZERO_PIN_ALPHABET.includes(c)), true);
});

test("rejects insufficient randomness", () => {
  assert.throws(() => generateZeroPin(new Uint8Array(7)));
});

test("lookup digest is keyed and deterministic", async () => {
  const secret = new Uint8Array(32).fill(7);
  const a = await derivePinLookupDigest("K7X9-42QM", secret);
  const b = await derivePinLookupDigest(" k7x9-42qm ", secret);
  assert.deepEqual(new Uint8Array(a), new Uint8Array(b));
  assert.equal(a.byteLength, 32);
});

test("PIN policy keeps identity and lookup protections explicit", () => {
  assert.equal(ZERO_PIN_POLICY.entropyBits, 40);
  assert.equal(ZERO_PIN_POLICY.lookup, "HMAC-SHA-256");
});
