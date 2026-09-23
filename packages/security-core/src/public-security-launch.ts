export type DisclosureStatus =
  | "RECEIVED"
  | "TRIAGED"
  | "ACKNOWLEDGED"
  | "REMEDIATION"
  | "RETEST"
  | "RESOLVED"
  | "CLOSED";

export type AdvisorySeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type SecurityAdvisory = {
  id: string;
  severity: AdvisorySeverity;
  status: DisclosureStatus;
  affectedComponent: string;
  publishedAt?: string;
  resolvedAt?: string;
  cveOrInternalId: string;
};

export type PublicSecurityEvidence = {
  securityContactPublished: boolean;
  vulnerabilityDisclosurePolicyPublished: boolean;
  securityArchitecturePublished: boolean;
  privacyArchitecturePublished: boolean;
  transparencyPagePublished: boolean;
  advisoryProcessOperational: boolean;
  securityUpdateProcessOperational: boolean;
  releaseEvidenceAvailable: boolean;
  unresolvedCriticalPublicClaim: boolean;
};

export const PUBLIC_SECURITY_LAUNCH_POLICY = Object.freeze({
  coordinatedDisclosureSupported: true,
  securityContactRequired: true,
  vulnerabilityDisclosurePolicyRequired: true,
  securityArchitectureDisclosureRequired: true,
  privacyArchitectureDisclosureRequired: true,
  transparencyPageRequired: true,
  advisoryLifecycleRequired: true,
  publicClaimsMustMatchEvidence: true,
  noUnverifiedAuditClaims: true,
  noPlaintextSecurityReports: true,
  reporterPrivacyProtected: true,
  noBountyPromiseWithoutProgram: true,
  noSensitiveInfrastructureDetailsPublished: true,
});

export function validateAdvisoryId(value: string): boolean {
  return /^ZERO-(?:20[0-9]{2})-[0-9]{4}$/.test(value);
}

export function isDisclosureStatus(value: string): value is DisclosureStatus {
  return [
    "RECEIVED",
    "TRIAGED",
    "ACKNOWLEDGED",
    "REMEDIATION",
    "RETEST",
    "RESOLVED",
    "CLOSED",
  ].includes(value);
}

export function isAdvisorySeverity(value: string): value is AdvisorySeverity {
  return ["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(value);
}

export function canPublishSecurityLaunch(
  evidence: PublicSecurityEvidence,
): boolean {
  return (
    evidence.securityContactPublished &&
    evidence.vulnerabilityDisclosurePolicyPublished &&
    evidence.securityArchitecturePublished &&
    evidence.privacyArchitecturePublished &&
    evidence.transparencyPagePublished &&
    evidence.advisoryProcessOperational &&
    evidence.securityUpdateProcessOperational &&
    evidence.releaseEvidenceAvailable &&
    !evidence.unresolvedCriticalPublicClaim
  );
}

export function publicClaimAllowed(
  claim: string,
  evidence: PublicSecurityEvidence,
): boolean {
  if (!evidence.releaseEvidenceAvailable) return false;
  if (/audit|penetration|pentest|certif/i.test(claim)) {
    return evidence.securityArchitecturePublished && !evidence.unresolvedCriticalPublicClaim;
  }
  return true;
}

export function requiresReporterPrivacy(
  reportContainsSensitiveData: boolean,
): boolean {
  return reportContainsSensitiveData;
}
