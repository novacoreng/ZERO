export type LaunchEvidence = {
  releaseSha: string;
  artifactDigest: string;
  independentCryptoAuditCompleted: boolean;
  externalPenetrationTestCompleted: boolean;
  securityFindingsResolved: boolean;
  productionCloudControlsVerified: boolean;
  dependencyReviewCompleted: boolean;
  browserDeviceValidationCompleted: boolean;
  productionLoadEvidenceCompleted: boolean;
  disasterRecoveryExerciseCompleted: boolean;
  backupRestoreVerified: boolean;
  rollbackVerified: boolean;
  privacyLegalReviewCompleted: boolean;
  accessibilityValidationCompleted: boolean;
  operationalSupportReady: boolean;
  securityDisclosureReady: boolean;
  incidentResponseReady: boolean;
  monitoringReady: boolean;
  migrationReviewCompleted: boolean;
  releaseArtifactVerified: boolean;
};

export const PRODUCTION_LAUNCH_POLICY = Object.freeze({
  allEvidenceRequired: true,
  independentCryptoAuditRequired: true,
  externalPenTestRequired: true,
  unresolvedCriticalFindingsBlockLaunch: true,
  unresolvedHighFindingsBlockLaunch: true,
  productionCloudVerificationRequired: true,
  productionLikeLoadEvidenceRequired: true,
  disasterRecoveryExerciseRequired: true,
  privacyLegalReviewRequired: true,
  accessibilityValidationRequired: true,
  operationalSupportRequired: true,
  securityDisclosureRequired: true,
  incidentResponseRequired: true,
  monitoringRequired: true,
  immutableReleaseRequired: true,
  noLaunchClaimWithoutEvidence: true,
});

export function validateLaunchReleaseSha(value: string): boolean {
  return /^[a-f0-9]{40,64}$/.test(value);
}

export function validateLaunchArtifactDigest(value: string): boolean {
  return /^sha256:[a-f0-9]{64}$/.test(value);
}

export function hasCompleteLaunchEvidence(evidence: LaunchEvidence): boolean {
  return (
    validateLaunchReleaseSha(evidence.releaseSha) &&
    validateLaunchArtifactDigest(evidence.artifactDigest) &&
    evidence.independentCryptoAuditCompleted &&
    evidence.externalPenetrationTestCompleted &&
    evidence.securityFindingsResolved &&
    evidence.productionCloudControlsVerified &&
    evidence.dependencyReviewCompleted &&
    evidence.browserDeviceValidationCompleted &&
    evidence.productionLoadEvidenceCompleted &&
    evidence.disasterRecoveryExerciseCompleted &&
    evidence.backupRestoreVerified &&
    evidence.rollbackVerified &&
    evidence.privacyLegalReviewCompleted &&
    evidence.accessibilityValidationCompleted &&
    evidence.operationalSupportReady &&
    evidence.securityDisclosureReady &&
    evidence.incidentResponseReady &&
    evidence.monitoringReady &&
    evidence.migrationReviewCompleted &&
    evidence.releaseArtifactVerified
  );
}

export function canLaunchProduction(evidence: LaunchEvidence): boolean {
  return hasCompleteLaunchEvidence(evidence);
}

export function missingLaunchEvidence(evidence: LaunchEvidence): string[] {
  const missing: string[] = [];
  const checks: Array<[keyof LaunchEvidence, boolean]> = [
    ["independentCryptoAuditCompleted", evidence.independentCryptoAuditCompleted],
    ["externalPenetrationTestCompleted", evidence.externalPenetrationTestCompleted],
    ["securityFindingsResolved", evidence.securityFindingsResolved],
    ["productionCloudControlsVerified", evidence.productionCloudControlsVerified],
    ["dependencyReviewCompleted", evidence.dependencyReviewCompleted],
    ["browserDeviceValidationCompleted", evidence.browserDeviceValidationCompleted],
    ["productionLoadEvidenceCompleted", evidence.productionLoadEvidenceCompleted],
    ["disasterRecoveryExerciseCompleted", evidence.disasterRecoveryExerciseCompleted],
    ["backupRestoreVerified", evidence.backupRestoreVerified],
    ["rollbackVerified", evidence.rollbackVerified],
    ["privacyLegalReviewCompleted", evidence.privacyLegalReviewCompleted],
    ["accessibilityValidationCompleted", evidence.accessibilityValidationCompleted],
    ["operationalSupportReady", evidence.operationalSupportReady],
    ["securityDisclosureReady", evidence.securityDisclosureReady],
    ["incidentResponseReady", evidence.incidentResponseReady],
    ["monitoringReady", evidence.monitoringReady],
    ["migrationReviewCompleted", evidence.migrationReviewCompleted],
    ["releaseArtifactVerified", evidence.releaseArtifactVerified],
  ];
  for (const [name, passed] of checks) if (!passed) missing.push(name);
  if (!validateLaunchReleaseSha(evidence.releaseSha)) missing.push("validReleaseSha");
  if (!validateLaunchArtifactDigest(evidence.artifactDigest)) missing.push("validArtifactDigest");
  return missing;
}
