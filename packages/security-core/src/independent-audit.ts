export type AuditDomain="CRYPTOGRAPHY"|"E2EE"|"KEY_MANAGEMENT"|"MULTI_DEVICE"|"FILES"|"RECOVERY"|"PROTOCOL"|"IMPLEMENTATION";
export type AuditStatus="PLANNED"|"IN_PROGRESS"|"FINDINGS"|"REMEDIATION"|"RETEST_REQUIRED"|"COMPLETED";
export type AuditSeverity="LOW"|"MEDIUM"|"HIGH"|"CRITICAL";
export type AuditFinding={id:string;domain:AuditDomain;severity:AuditSeverity;resolved:boolean;retested:boolean;};
export const INDEPENDENT_AUDIT_POLICY=Object.freeze({
independentReviewerRequired:true,
cryptographicDesignReviewRequired:true,
protocolImplementationReviewRequired:true,
keyLifecycleReviewRequired:true,
multiDeviceReviewRequired:true,
fileEncryptionReviewRequired:true,
recoveryReviewRequired:true,
constantTimeAndSideChannelReviewRequired:true,
randomnessAndNonceReviewRequired:true,
dependencyAndProviderReviewRequired:true,
criticalFindingBlocksRelease:true,
remediationRetestRequired:true,
publicAuditStatementMustMatchEvidence:true
});
export function isAuditDomain(v:string):v is AuditDomain{return ["CRYPTOGRAPHY","E2EE","KEY_MANAGEMENT","MULTI_DEVICE","FILES","RECOVERY","PROTOCOL","IMPLEMENTATION"].includes(v)}
export function validateAuditId(v:string):boolean{return /^[A-Za-z0-9_-]{16,128}$/.test(v)}
export function isBlockingAuditFinding(f:AuditFinding):boolean{return f.severity==="CRITICAL"&&!f.resolved}
export function canReleaseAfterAudit(findings:readonly AuditFinding[]):boolean{return !findings.some(isBlockingAuditFinding)}
export function requiresAuditRetest(f:AuditFinding):boolean{return f.resolved&&!f.retested}
