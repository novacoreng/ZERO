export type AuditDomain="AUTH"|"DEVICE"|"RECOVERY"|"ADMIN"|"ABUSE"|"INFRASTRUCTURE";
export type AuditSeverity="INFO"|"WARNING"|"CRITICAL";
export type AuditEvent={id:string;domain:AuditDomain;eventCode:string;severity:AuditSeverity;actorRef?:string;targetRef?:string;correlationId:string;sequence:number;createdAt:string;previousDigest?:Uint8Array;eventDigest:Uint8Array;};
export const SECURITY_AUDIT_POLICY=Object.freeze({
immutable:true,
tamperEvidenceRequired:true,
plaintextExcluded:true,
privateKeysExcluded:true,
tokensExcluded:true,
recoverySecretsExcluded:true,
correlationRequired:true,
monotonicSequenceRequired:true,
separateOperationalLogs:true,
retentionClassRequired:true,
rawMessageContent:false
});
export function validateAuditId(v:string):boolean{return /^[A-Za-z0-9_-]{16,128}$/.test(v)}
export function validateCorrelationId(v:string):boolean{return /^[A-Za-z0-9_-]{16,128}$/.test(v)}
export function validateSequence(v:number):boolean{return Number.isInteger(v)&&v>=0}
export function validateDigest(v:Uint8Array):boolean{return v.byteLength===32}
export function isSecurityDomain(v:string):v is AuditDomain{return ["AUTH","DEVICE","RECOVERY","ADMIN","ABUSE","INFRASTRUCTURE"].includes(v)}
