import test from "node:test";
import assert from "node:assert/strict";
import {
  EXPIRATION_SECONDS,
  computeExpiresAt,
  isExpired,
  nextExpirationState,
  assertValidExpirationTransition,
} from "../src/message-expiration.js";

test("supports required expiration durations", () =>
  assert.deepEqual(EXPIRATION_SECONDS, {
    "10_SECONDS": 10,
    "1_MINUTE": 60,
    "10_MINUTES": 600,
    "1_HOUR": 3600,
    "6_HOURS": 21600,
    "24_HOURS": 86400,
    "3_DAYS": 259200,
    "7_DAYS": 604800,
  }));

test("computes authoritative expiry timestamp", () => {
  const d = new Date("2026-09-23T00:00:00Z");
  assert.equal(
    computeExpiresAt(d, "10_SECONDS").toISOString(),
    "2026-09-23T00:00:10.000Z",
  );
});

test("custom durations must be positive integers", () =>
  assert.throws(() => computeExpiresAt(new Date(), "CUSTOM", 0)));

test("expiration state progression is durable", () => {
  const e = new Date("2026-09-23T00:00:10Z");
  const n = new Date("2026-09-23T00:00:11Z");

  assert.equal(isExpired(n, e), true);
  assert.equal(nextExpirationState("ACTIVE", n, e), "EXPIRING");
  assert.equal(nextExpirationState("EXPIRING", n, e), "DESTROYING");
  assert.equal(nextExpirationState("DESTROYING", n, e), "DESTROYED");
});

test("invalid state transitions are rejected", () =>
  assert.throws(() => assertValidExpirationTransition("ACTIVE", "DESTROYED")));
