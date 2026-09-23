import test from "node:test";
import assert from "node:assert/strict";
import {
  BETA_POLICY,
  canEnrollInControlledBeta,
  canReceiveBetaAccess,
  canWithdrawFromBeta,
  isFeedbackCategory,
  isBetaStatus,
  rejectSensitiveFeedback,
  validateBetaParticipantId,
  validateFeedbackId,
  validateInvitationId,
} from "../src/beta.js";

const safeEvidence = {
  knownCriticalFindings: 0,
  emergencyRollbackReady: true,
  killSwitchReady: true,
  backupRecoveryVerified: true,
  privacyNoticePublished: true,
  supportPathReady: true,
  securityReportingPathReady: true,
  telemetryContentFree: true,
};

test("beta policy is controlled and content-free", () => {
  assert.equal(BETA_POLICY.inviteOnly, true);
  assert.equal(BETA_POLICY.publicSignupDisabled, true);
  assert.equal(BETA_POLICY.productionClaimsForbidden, true);
  assert.equal(BETA_POLICY.messageContentTelemetryForbidden, true);
});

test("controlled beta requires operational safety evidence", () => {
  assert.equal(canEnrollInControlledBeta(safeEvidence), true);
  assert.equal(
    canEnrollInControlledBeta({ ...safeEvidence, knownCriticalFindings: 1 }),
    false,
  );
  assert.equal(
    canEnrollInControlledBeta({ ...safeEvidence, emergencyRollbackReady: false }),
    false,
  );
});

test("participant lifecycle and identifiers are explicit", () => {
  assert.equal(isBetaStatus("ACTIVE"), true);
  assert.equal(isBetaStatus("UNKNOWN"), false);
  assert.equal(validateBetaParticipantId("beta_123456789012"), true);
  assert.equal(validateInvitationId("invite_123456789012"), true);
  assert.equal(validateFeedbackId("feedback_123456789012"), true);
  assert.equal(canWithdrawFromBeta("ACTIVE"), true);
  assert.equal(canWithdrawFromBeta("REVOKED"), false);
});

test("beta access requires enrolled or active controlled participants", () => {
  assert.equal(canReceiveBetaAccess({ channel: "CONTROLLED_BETA", status: "ENROLLED" }), true);
  assert.equal(canReceiveBetaAccess({ channel: "CONTROLLED_BETA", status: "INVITED" }), false);
  assert.equal(canReceiveBetaAccess({ channel: "INTERNAL", status: "ACTIVE" }), false);
});

test("feedback categories and private-content rejection are explicit", () => {
  assert.equal(isFeedbackCategory("SECURITY"), true);
  assert.equal(isFeedbackCategory("UNKNOWN"), false);
  assert.equal(rejectSensitiveFeedback({ containsPrivateContent: true }), true);
  assert.equal(rejectSensitiveFeedback({ containsPrivateContent: false }), false);
});
