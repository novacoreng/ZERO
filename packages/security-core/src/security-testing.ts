export type SecurityTestDomain="AUTH"|"AUTHZ"|"CRYPTO"|"FILES"|"API"|"WEB"|"PRIVACY"|"ABUSE"|"DEPENDENCY";
export type SecurityGateState="REQUIRED"|"PASS"|"FAIL"|"BLOCKED";
export type SecurityFindingSeverity="LOW"|"MEDIUM"|"HIGH"|"CRITICAL";
export type SecurityFinding={id:string;domain:SecurityTestDomain;severity:SecurityFindingSeverity;code:string;resolved:boolean;};
export const SECURITY_TESTING_POLICY=Object.freeze({
secretScanningRequired:true,
dependencyScanningRequired:true,
sastRequired:true,
dastRequired:true,
authTestsRequired:true,
authorizationTestsRequired:true,
cryptoBoundaryTestsRequired:true,
uploadSecurityTestsRequired:true,
injectionTestsRequired:true,
xssTestsRequired:true,
csrfTestsRequired:true,
privacyLeakTestsRequired:true,
e2eePlaintextLeakTestRequired:true,
criticalFindingBlocksRelease:true,
securityRegressionRequired:true
});
export function validateFindingId(v:string):boolean{return /^[A-Za-z0-9_-]{16,128}$/.test(v)}
export function isBlockingSeverity(v:SecurityFindingSeverity):boolean{return v==="CRITICAL"}
export function canRelease(findings:readonly SecurityFinding[]):boolean{return !findings.some(f=>isBlockingSeverity(f.severity)&&!f.resolved)}
export function isSecurityDomain(v:string):v is SecurityTestDomain{return ["AUTH","AUTHZ","CRYPTO","FILES","API","WEB","PRIVACY","ABUSE","DEPENDENCY"].includes(v)}
