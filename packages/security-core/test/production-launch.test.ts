import test from "node:test";
import assert from "node:assert/strict";
import {
  PRODUCTION_LAUNCH_POLICY,
  canLaunchProduction,
  hasCompleteLaunchEvidence,
  missingLaunchEvidence,
  validateArtifactDigest,
  validateReleaseSha,
} from "../src/production-launch.js";

const complete = {
  releaseSha: "a".repeat(40),
  artifactDigest: "sha256:" + "b".repeat(64),
  independentCryptoAuditCompleted: true,
  externalPenetrationTestCompleted: true,
  securityFindingsResolved: true,
  productionCloudControlsVerified: true,
  dependencyReviewCompleted: true,
  browserDeviceValidationCompleted: true,
  productionLoadEvidenceCompleted: true,
  disasterRecoveryExerciseCompleted: true,
  backupRestoreVerified: true,
  rollbackVerified: true,
  privacyLegalReviewCompleted: true,
  accessibilityValidationCompleted: true,
  operationalSupportReady: true,
  securityDisclosureReady: true,
  incidentResponseReady: true,
  monitoringReady: true,
  migrationReviewCompleted: true,
  releaseArtifactVerified: true,
};

test("launch evidence requires immutable release identity", () => {
  assert.equal(validateReleaseSha(complete.releaseSha), true);
  assert.equal(validateArtifactDigest(complete.artifactDigest), true);
});

test("complete evidence is launchable by contract", () => {
  assert.equal(hasCompleteLaunchEvidence(complete), true);
  assert.equal(canLaunchProduction(complete), true);
  assert.deepEqual(missingLaunchEvidence(complete), []);
});

test("missing external security evidence blocks production launch", () => {
  const evidence = { ...complete, independentCryptoAuditCompleted: false };
  assert.equal(canLaunchProduction(evidence), false);
  assert.equal(missingLaunchEvidence(evidence).includes("independentCryptoAuditCompleted"), true);
});

test("missing operational evidence is visible rather than silently accepted", () => {
  const evidence = { ...complete, productionLoadEvidenceCompleted: false, monitoringReady: false };
  const missing = missingLaunchEvidence(evidence);
  assert.equal(missing.includes("productionLoadEvidenceCompleted"), true);
  assert.equal(missing.includes("monitoringReady"), true);
});

test("launch policy forbids evidence-free production claims", () => {
  assert.equal(PRODUCTION_LAUNCH_POLICY.noLaunchClaimWithoutEvidence, true);
  assert.equal(PRODUCTION_LAUNCH_POLICY.independentCryptoAuditRequired, true);
});
