export type AdminRole="SUPER_ADMIN"|"SECURITY_ADMIN"|"TRUST_SAFETY_ADMIN"|"SUPPORT_ADMIN"|"AUDITOR";
export type AdminAction="VIEW_SECURITY_EVENT"|"REVOKE_SESSION"|"REVOKE_DEVICE"|"REVIEW_REPORT"|"SUSPEND_ACCOUNT"|"LIFT_SUSPENSION"|"VIEW_BUSINESS"|"EXPORT_AUDIT";
export type AdminActionState="REQUESTED"|"AUTHORIZED"|"EXECUTED"|"DENIED";
export type AdminAuditEvent={id:string;adminId:string;role:AdminRole;action:AdminAction;targetType:string;targetId:string;state:AdminActionState;createdAt:string;};
export const ADMIN_CONSOLE_POLICY=Object.freeze({
leastPrivilege:true,
e2eePlaintextAccess:false,
privateKeyAccess:false,
recoverySecretAccess:false,
supportCannotDecrypt:true,
auditorReadOnly:true,
securityActionsRequireExplicitAuthorization:true,
dualControlForEmergency:true,
adminActionsAudited:true,
sensitivePayloadsExcluded:true
});
const ROLE_ACTIONS:Record<AdminRole,readonly AdminAction[]>={
SUPER_ADMIN:["VIEW_SECURITY_EVENT","REVOKE_SESSION","REVOKE_DEVICE","REVIEW_REPORT","SUSPEND_ACCOUNT","LIFT_SUSPENSION","VIEW_BUSINESS","EXPORT_AUDIT"],
SECURITY_ADMIN:["VIEW_SECURITY_EVENT","REVOKE_SESSION","REVOKE_DEVICE","SUSPEND_ACCOUNT","LIFT_SUSPENSION","EXPORT_AUDIT"],
TRUST_SAFETY_ADMIN:["VIEW_SECURITY_EVENT","REVIEW_REPORT","SUSPEND_ACCOUNT","LIFT_SUSPENSION"],
SUPPORT_ADMIN:["VIEW_SECURITY_EVENT","VIEW_BUSINESS"],
AUDITOR:["VIEW_SECURITY_EVENT","VIEW_BUSINESS","EXPORT_AUDIT"]
};
export function validateAdminId(v:string):boolean{return /^[A-Za-z0-9_-]{16,128}$/.test(v)}
export function isAllowedAdminAction(role:AdminRole,action:AdminAction):boolean{return ROLE_ACTIONS[role].includes(action)}
export function isReadOnlyAdmin(role:AdminRole):boolean{return role==="AUDITOR"}
export function canAccessPlaintext():boolean{return false}
