export type HardeningEnvironment = "STAGING" | "PRODUCTION";

export type HardeningFindingSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type HardeningFinding = {
  id: string;
  control: string;
  severity: HardeningFindingSeverity;
  resolved: boolean;
  evidenceRef?: string;
};

export type ReleaseEvidence = {
  commitSha: string;
  artifactDigest: string;
  sourceReviewed: boolean;
  dependencyLockVerified: boolean;
  migrationsReviewed: boolean;
  secretsScanPassed: boolean;
  securityTestsPassed: boolean;
  backupRestoreVerified: boolean;
  rollbackVerified: boolean;
  observabilityVerified: boolean;
  betaExitReviewed: boolean;
};

export const PRODUCTION_HARDENING_POLICY = Object.freeze({
  immutableReleaseRequired: true,
  artifactDigestRequired: true,
  dependencyLockRequired: true,
  secretsScanRequired: true,
  migrationReviewRequired: true,
  rollbackEvidenceRequired: true,
  backupRestoreEvidenceRequired: true,
  observabilityEvidenceRequired: true,
  healthReadinessRequired: true,
  securityRegressionRequired: true,
  criticalFindingBlocksRelease: true,
  highFindingRequiresException: true,
  productionSecretsNeverInClient: true,
  productionDataNeverUsedInTests: true,
  debugEndpointsDisabled: true,
  verboseErrorsDisabled: true,
  adminActionsAudited: true,
  destructiveActionsRequireReauth: true,
  featureFlagsFailClosedForSecurityControls: true,
});

export function validateReleaseSha(value: string): boolean {
  return /^[a-f0-9]{40,64}$/.test(value);
}

export function validateArtifactDigest(value: string): boolean {
  return /^sha256:[a-f0-9]{64}$/.test(value);
}

export function isBlockingHardeningFinding(finding: HardeningFinding): boolean {
  return !finding.resolved && (finding.severity === "CRITICAL" || finding.severity === "HIGH");
}

export function hasBlockingCritical(findings: readonly HardeningFinding[]): boolean {
  return findings.some(
    (finding) => !finding.resolved && finding.severity === "CRITICAL",
  );
}

export function canPromoteToProduction(
  evidence: ReleaseEvidence,
  findings: readonly HardeningFinding[],
): boolean {
  return (
    validateReleaseSha(evidence.commitSha) &&
    validateArtifactDigest(evidence.artifactDigest) &&
    evidence.sourceReviewed &&
    evidence.dependencyLockVerified &&
    evidence.migrationsReviewed &&
    evidence.secretsScanPassed &&
    evidence.securityTestsPassed &&
    evidence.backupRestoreVerified &&
    evidence.rollbackVerified &&
    evidence.observabilityVerified &&
    evidence.betaExitReviewed &&
    !hasBlockingCritical(findings) &&
    !findings.some(
      (finding) => !finding.resolved && finding.severity === "HIGH",
    )
  );
}

export function requiresSecurityException(finding: HardeningFinding): boolean {
  return !finding.resolved && finding.severity === "HIGH";
}
