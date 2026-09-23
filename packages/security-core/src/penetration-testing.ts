export type PentestDomain="AUTH"|"AUTHZ"|"E2EE"|"API"|"WEB"|"FILES"|"DATA_DROPS"|"CALLS"|"ADMIN"|"INFRASTRUCTURE"|"PRIVACY";
export type PentestStatus="PLANNED"|"IN_PROGRESS"|"RETEST_REQUIRED"|"PASSED"|"FAILED";
export type PentestSeverity="LOW"|"MEDIUM"|"HIGH"|"CRITICAL";
export type PentestFinding={id:string;domain:PentestDomain;severity:PentestSeverity;resolved:boolean;retired:boolean};
export const PENTEST_POLICY=Object.freeze({externalAssessmentRequired:true,authenticatedAndUnauthenticatedCoverageRequired:true,authorizationBoundaryRequired:true,e2eePlaintextLeakageRequired:true,fileUploadAbuseRequired:true,adminPrivilegeEscalationRequired:true,rateLimitBypassRequired:true,privacyMetadataLeakageRequired:true,criticalFindingBlocksRelease:true,retestRequiredAfterRemediation:true});
export function isPentestDomain(v:string):v is PentestDomain{return ["AUTH","AUTHZ","E2EE","API","WEB","FILES","DATA_DROPS","CALLS","ADMIN","INFRASTRUCTURE","PRIVACY"].includes(v)}
export function isBlockingPentestFinding(f:PentestFinding):boolean{return f.severity==="CRITICAL"&&!f.resolved&&!f.retired}
export function canReleaseAfterPentest(findings:readonly PentestFinding[]):boolean{return !findings.some(isBlockingPentestFinding)}
export function requiresRetest(before:PentestFinding,afterResolved:boolean):boolean{return !before.retired&&before.resolved!==afterResolved&&afterResolved}
export function validatePentestId(v:string):boolean{return /^[A-Za-z0-9_-]{16,128}$/.test(v)}
