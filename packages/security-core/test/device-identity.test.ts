import test from "node:test";
import assert from "node:assert/strict";
import { DEVICE_IDENTITY_POLICY, validateDeviceId, validateDevicePlatform, validateDevicePublicMaterial } from "../src/device-identity.js";
test("accepts supported platforms", () => { assert.equal(validateDevicePlatform("ios"), true); assert.equal(validateDevicePlatform("android"), true); assert.equal(validateDevicePlatform("web"), true); assert.equal(validateDevicePlatform("desktop"), true); assert.equal(validateDevicePlatform("unknown"), false); });
test("validates opaque device ids", () => { assert.equal(validateDeviceId("device_12345678901234"), true); assert.equal(validateDeviceId("short"), false); assert.equal(validateDeviceId("device id with spaces"), false); });
test("bounds public key material", () => { assert.equal(validateDevicePublicMaterial(new Uint8Array(31)), false); assert.equal(validateDevicePublicMaterial(new Uint8Array(32)), true); assert.equal(validateDevicePublicMaterial(new Uint8Array(4097)), false); });
test("keeps private key boundary explicit", () => { assert.equal(DEVICE_IDENTITY_POLICY.privateKeysNeverLeaveDevice, true); assert.equal(DEVICE_IDENTITY_POLICY.serverStoresPublicMaterialOnly, true); assert.equal(DEVICE_IDENTITY_POLICY.zeroPinIsNotADeviceKey, true); });
