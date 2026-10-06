export type BusinessVerificationState="PENDING"|"VERIFIED"|"SUSPENDED"|"REVOKED";
export type BusinessMemberRole="OWNER"|"ADMIN"|"SECURITY_ADMIN"|"MEMBER"|"AUDITOR";
export type BusinessMemberState="INVITED"|"ACTIVE"|"SUSPENDED"|"REMOVED";
export type BusinessPolicyState="ACTIVE"|"DISABLED";
export type BusinessOrganization={id:string;accountId:string;legalName:string;displayName:string;verificationState:BusinessVerificationState;createdAt:string;};
export type BusinessMember={id:string;organizationId:string;accountId:string;role:BusinessMemberRole;state:BusinessMemberState;createdAt:string;};
export const ZERO_BUSINESS_POLICY=Object.freeze({
e2eeUnchanged:true,
businessCannotDecryptUserMessages:true,
serverPlaintextAccess:false,
ownerCannotGrantPrivateKeyAccess:true,
roleSeparationRequired:true,
securityAdminCanRevokeSessions:true,
auditorReadOnly:true,
verificationEvidenceMinimized:true
});
export function validateBusinessId(v:string):boolean{return /^[A-Za-z0-9_-]{16,128}$/.test(v)}
export function validateOrganizationName(v:string):boolean{const n=v.trim();return n.length>=2&&n.length<=200}
export function canManageSecurity(role:BusinessMemberRole):boolean{return role==="OWNER"||role==="ADMIN"||role==="SECURITY_ADMIN"}
export function isReadOnly(role:BusinessMemberRole):boolean{return role==="AUDITOR"}
export function canDecryptUserMessages():boolean{return !ZERO_BUSINESS_POLICY.businessCannotDecryptUserMessages}
