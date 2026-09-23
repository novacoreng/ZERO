import test from "node:test";
import assert from "node:assert/strict";
import {
  PUBLIC_SECURITY_LAUNCH_POLICY,
  canPublishSecurityLaunch,
  isAdvisorySeverity,
  isDisclosureStatus,
  publicClaimAllowed,
  requiresReporterPrivacy,
  validateAdvisoryId,
} from "../src/public-security-launch.js";

const evidence = {
  securityContactPublished: true,
  vulnerabilityDisclosurePolicyPublished: true,
  securityArchitecturePublished: true,
  privacyArchitecturePublished: true,
  transparencyPagePublished: true,
  advisoryProcessOperational: true,
  securityUpdateProcessOperational: true,
  releaseEvidenceAvailable: true,
  unresolvedCriticalPublicClaim: false,
};

test("public security launch requires the disclosure surface", () => {
  assert.equal(canPublishSecurityLaunch(evidence), true);
  assert.equal(
    canPublishSecurityLaunch({
      ...evidence,
      vulnerabilityDisclosurePolicyPublished: false,
    }),
    false,
  );
});

test("security identifiers and lifecycle are explicit", () => {
  assert.equal(validateAdvisoryId("ZERO-2026-0001"), true);
  assert.equal(validateAdvisoryId("ZERO-26-1"), false);
  assert.equal(isDisclosureStatus("RETEST"), true);
  assert.equal(isDisclosureStatus("UNKNOWN"), false);
  assert.equal(isAdvisorySeverity("CRITICAL"), true);
  assert.equal(isAdvisorySeverity("UNKNOWN"), false);
});

test("security claims cannot outrun evidence", () => {
  assert.equal(publicClaimAllowed("architecture is published", evidence), true);
  assert.equal(
    publicClaimAllowed("independent penetration test completed", {
      ...evidence,
      releaseEvidenceAvailable: false,
    }),
    false,
  );
});

test("reporter privacy is an explicit boundary", () => {
  assert.equal(requiresReporterPrivacy(true), true);
  assert.equal(PUBLIC_SECURITY_LAUNCH_POLICY.reporterPrivacyProtected, true);
});
