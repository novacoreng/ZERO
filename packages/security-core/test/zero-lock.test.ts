import test from "node:test";import assert from "node:assert/strict";import{ZERO_LOCK_POLICY,validateAutoLockSeconds,canUnlock,nextLockState}from "../src/zero-lock.js";
test("bounds auto lock",()=>{assert.equal(validateAutoLockSeconds(15),true);assert.equal(validateAutoLockSeconds(86400),true);assert.equal(validateAutoLockSeconds(14),false)});
test("unlock requires device availability",()=>{assert.equal(canUnlock("DEVICE_BIOMETRIC",true),true);assert.equal(canUnlock("ZERO_PIN",false),false)});
test("lock and panic transitions",()=>{assert.equal(nextLockState("UNLOCKED","LOCK"),"LOCKED");assert.equal(nextLockState("LOCKED","PANIC"),"PANIC_LOCKED")});
test("local key policy stays device bound",()=>{assert.equal(ZERO_LOCK_POLICY.privateKeysStayLocal,true);assert.equal(ZERO_LOCK_POLICY.secureStorageRequired,true)});
