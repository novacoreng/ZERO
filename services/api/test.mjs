import assert from "node:assert/strict";
import { health } from "./dist/index.js";

assert.deepEqual(health(), { status: "ok", service: "zero-api" });
console.log("API health contract test passed");
