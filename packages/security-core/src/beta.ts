export const BETA_POLICY = {
  channel: "CONTROLLED_BETA" as const,
  inviteOnly: true,
  publicSignupDisabled: true,
  productionClaimsForbidden: true,
  messageContentTelemetryForbidden: true,
  fileContentTelemetryForbidden: true,
  callContentTelemetryForbidden: true,
  preciseLocationTelemetryForbidden: true,
  conversationGraphTelemetryForbidden: true,
  crashReportsMustBeContentFree: true,
  securityReportsMustRemainLeastPrivilege: true,
  emergencyKillSwitchRequired: true,
  rollbackRequired: true,
  userDataExportRequired: true,
  userDataDeletionRequired: true,
} as const;

export const BETA_STATUSES = [
  "INVITED",
  "ENROLLED",
  "ACTIVE",
  "SUSPENDED",
  "REVOKED",
  "WITHDRAWN",
] as const;
export type BetaStatus = (typeof BETA_STATUSES)[number];

export const BETA_CHANNELS = ["CONTROLLED_BETA", "INTERNAL"] as const;
export type BetaChannel = (typeof BETA_CHANNELS)[number];

export const FEEDBACK_CATEGORIES = [
  "BUG",
  "PERFORMANCE",
  "ACCESSIBILITY",
  "USABILITY",
  "PRIVACY",
  "SECURITY",
  "OTHER",
] as const;
export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];

export type BetaParticipant = {
  id: string;
  accountId: string;
  invitationId: string;
  status: BetaStatus;
  channel: BetaChannel;
  consentedAt: string;
  privacyNoticeVersion: string;
  termsVersion: string;
  enrolledAt?: string;
  withdrawnAt?: string;
};

export type BetaFeedback = {
  id: string;
  participantId: string;
  category: FeedbackCategory;
  body: string;
  containsPrivateContent: boolean;
  createdAt: string;
};

export type BetaGateEvidence = {
  knownCriticalFindings: number;
  emergencyRollbackReady: boolean;
  killSwitchReady: boolean;
  backupRecoveryVerified: boolean;
  privacyNoticePublished: boolean;
  supportPathReady: boolean;
  securityReportingPathReady: boolean;
  telemetryContentFree: boolean;
};

export function isBetaStatus(value: string): value is BetaStatus {
  return (BETA_STATUSES as readonly string[]).includes(value);
}

export function isFeedbackCategory(value: string): value is FeedbackCategory {
  return (FEEDBACK_CATEGORIES as readonly string[]).includes(value);
}

export function validateBetaParticipantId(value: string): boolean {
  return /^beta_[A-Za-z0-9_-]{12,80}$/.test(value);
}

export function validateInvitationId(value: string): boolean {
  return /^invite_[A-Za-z0-9_-]{12,80}$/.test(value);
}

export function validateFeedbackId(value: string): boolean {
  return /^feedback_[A-Za-z0-9_-]{12,80}$/.test(value);
}

export function canEnrollInControlledBeta(
  evidence: BetaGateEvidence,
): boolean {
  return (
    evidence.knownCriticalFindings === 0 &&
    evidence.emergencyRollbackReady &&
    evidence.killSwitchReady &&
    evidence.backupRecoveryVerified &&
    evidence.privacyNoticePublished &&
    evidence.supportPathReady &&
    evidence.securityReportingPathReady &&
    evidence.telemetryContentFree
  );
}

export function canWithdrawFromBeta(status: BetaStatus): boolean {
  return status === "INVITED" || status === "ENROLLED" || status === "ACTIVE" || status === "SUSPENDED";
}

export function canReceiveBetaAccess(
  participant: Pick<BetaParticipant, "status" | "channel">,
): boolean {
  return (
    participant.channel === "CONTROLLED_BETA" &&
    (participant.status === "ENROLLED" || participant.status === "ACTIVE")
  );
}

export function rejectSensitiveFeedback(feedback: Pick<BetaFeedback, "containsPrivateContent">): boolean {
  return feedback.containsPrivateContent;
}
