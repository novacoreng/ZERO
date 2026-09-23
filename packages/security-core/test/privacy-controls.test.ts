import test from "node:test";import assert from "node:assert/strict";import{DEFAULT_PRIVACY_CONTROLS,canExposePresence,canSendReadReceipt,shouldHideNotificationContent,forwardingAllowed}from "../src/privacy-controls.js";
test("defaults minimize exposure",()=>{assert.equal(DEFAULT_PRIVACY_CONTROLS.presence,"CONTACTS");assert.equal(DEFAULT_PRIVACY_CONTROLS.linkPreviews,false);assert.equal(DEFAULT_PRIVACY_CONTROLS.notificationPrivacy,"SENDER_ONLY")});
test("presence respects contact visibility",()=>{assert.equal(canExposePresence("EVERYONE",false),true);assert.equal(canExposePresence("CONTACTS",false),false);assert.equal(canExposePresence("CONTACTS",true),true);assert.equal(canExposePresence("NOBODY",true),false)});
test("receipts follow privacy setting",()=>{assert.equal(canSendReadReceipt("NOBODY",true),false);assert.equal(canSendReadReceipt("EVERYONE",false),true)});
test("notification content can be hidden",()=>{assert.equal(shouldHideNotificationContent("FULL"),false);assert.equal(shouldHideNotificationContent("HIDDEN"),true)});
test("forwarding is explicit",()=>{assert.equal(forwardingAllowed("BLOCK"),false);assert.equal(forwardingAllowed("ALLOW"),true)});
