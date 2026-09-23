import test from "node:test";
import assert from "node:assert/strict";
import {
  PRODUCTION_HARDENING_POLICY,
  canPromoteToProduction,
  hasBlockingCritical,
  requiresSecurityException,
  validateArtifactDigest,
  validateReleaseSha,
} from "../src/production-hardening.js";

const evidence = {
  commitSha: "a".repeat(40),
  artifactDigest: "sha256:" + "b".repeat(64),
  sourceReviewed: true,
  dependencyLockVerified: true,
  migrationsReviewed: true,
  secretsScanPassed: true,
  securityTestsPassed: true,
  backupRestoreVerified: true,
  rollbackVerified: true,
  observabilityVerified: true,
  betaExitReviewed: true,
};

test("production release evidence requires immutable identifiers", () => {
  assert.equal(validateReleaseSha(evidence.commitSha), true);
  assert.equal(validateReleaseSha("not-a-sha"), false);
  assert.equal(validateArtifactDigest(evidence.artifactDigest), true);
  assert.equal(validateArtifactDigest("sha256:not-a-digest"), false);
});

test("critical and unresolved high findings block promotion", () => {
  const critical = { id: "f1", control: "CRYPTO", severity: "CRITICAL" as const, resolved: false };
  const high = { id: "f2", control: "AUTHZ", severity: "HIGH" as const, resolved: false };
  assert.equal(hasBlockingCritical([critical]), true);
  assert.equal(canPromoteToProduction(evidence, [critical]), false);
  assert.equal(canPromoteToProduction(evidence, [high]), false);
  assert.equal(requiresSecurityException(high), true);
});

test("fully evidenced release can promote when findings are resolved", () => {
  const resolved = { id: "f1", control: "WEB", severity: "HIGH" as const, resolved: true };
  assert.equal(canPromoteToProduction(evidence, [resolved]), true);
});

test("hardening policy preserves privacy and fail-closed controls", () => {
  assert.equal(PRODUCTION_HARDENING_POLICY.immutableReleaseRequired, true);
  assert.equal(PRODUCTION_HARDENING_POLICY.productionSecretsNeverInClient, true);
  assert.equal(PRODUCTION_HARDENING_POLICY.debugEndpointsDisabled, true);
  assert.equal(PRODUCTION_HARDENING_POLICY.featureFlagsFailClosedForSecurityControls, true);
});
