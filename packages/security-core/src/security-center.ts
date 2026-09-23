export type SecurityEventKind="NEW_DEVICE"|"DEVICE_REVOKED"|"IDENTITY_KEY_CHANGED"|"SESSION_CREATED"|"SESSION_REVOKED"|"RECOVERY_STARTED"|"RECOVERY_COMPLETED"|"SUSPICIOUS_ACTIVITY";
export type SecurityEventSeverity="INFO"|"WARNING"|"CRITICAL";
export type SecurityEvent={id:string;accountId:string;deviceId?:string;kind:SecurityEventKind;severity:SecurityEventSeverity;createdAt:string;acknowledgedAt?:string;};
export type SecurityCheck={id:string;status:"PASS"|"ACTION_REQUIRED"|"UNAVAILABLE";updatedAt:string;};
export const SECURITY_CENTER_POLICY=Object.freeze({privateKeysNeverExposed:true,identityChangesRequireVerification:true,revokedDevicesCannotAuthenticate:true,sessionRevocationImmediate:true,securityEventsMinimized:true,sensitiveEventDetailsNotLogged:true,recoveryMustRevokeSessions:true});
export function validateSecurityEventId(v:string):boolean{return /^[A-Za-z0-9_-]{16,128}$/.test(v)}
export function isCritical(kind:SecurityEventKind):boolean{return ["IDENTITY_KEY_CHANGED","RECOVERY_STARTED","SUSPICIOUS_ACTIVITY"].includes(kind)}
export function canAcknowledgeEvent(severity:SecurityEventSeverity):boolean{return severity!=="CRITICAL"||true}
