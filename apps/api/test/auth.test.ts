import test from "node:test";
import assert from "node:assert/strict";
import { normalizeEmail, normalizePhone, validateOtp, validatePasskeyCredentialId } from "../src/auth/validation.js";
import { shouldReauthenticate } from "../src/auth/policy.js";

test("normalizes email", () => assert.equal(normalizeEmail(" USER@Example.COM "), "user@example.com"));
test("normalizes phone formatting", () => assert.equal(normalizePhone(" +234 (801) 555-0100 "), "+2348015550100"));
test("accepts exactly six numeric OTP digits", () => {
  assert.equal(validateOtp("123456"), true);
  assert.equal(validateOtp("12345"), false);
  assert.equal(validateOtp("1234567"), false);
  assert.equal(validateOtp("12a456"), false);
});
test("requires reauthentication for sensitive changes", () => {
  assert.equal(shouldReauthenticate("change_email"), true);
  assert.equal(shouldReauthenticate("read_profile"), false);
});
test("rejects empty/short passkey identifiers", () => {
  assert.equal(validatePasskeyCredentialId("short"), false);
  assert.equal(validatePasskeyCredentialId("1234567890123456"), true);
});
