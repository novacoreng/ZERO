export type DropAuthorizationState="PENDING"|"AUTHORIZED"|"CONSUMED"|"REVOKED"|"EXPIRED"|"BLOCKED";
export type DropAccessEvent="AUTHORIZED"|"DENIED"|"DOWNLOADED"|"REVOKED"|"EXPIRED"|"RATE_LIMITED";
export type DropAuthorization={id:string;dropId:string;authorizationDigest:Uint8Array;state:DropAuthorizationState;expiresAt:string;maxUses:number;uses:number;recipientBindingDigest?:Uint8Array;createdAt:string;};
export const DATA_DROP_SECURITY_POLICY=Object.freeze({minSecretBytes:32,authorizationTtlSeconds:300,maxFailedAttempts:5,maxUses:100,recipientBindingOptional:true,replayProtection:true,rateLimitRequired:true,ipRetentionSeconds:86400,secretPlaintextStorage:false,serverDecrypts:false});
export function validateSecretEntropy(secret:Uint8Array):boolean{return secret.byteLength>=DATA_DROP_SECURITY_POLICY.minSecretBytes}
export function validateUseLimit(maxUses:number):boolean{return Number.isInteger(maxUses)&&maxUses>0&&maxUses<=DATA_DROP_SECURITY_POLICY.maxUses}
export function canConsumeAuthorization(a:DropAuthorization,now:Date):boolean{return a.state==="AUTHORIZED"&&a.uses<a.maxUses&&now.getTime()<new Date(a.expiresAt).getTime()}
export function nextAuthorizationState(state:DropAuthorizationState,event:"AUTHORIZE"|"CONSUME"|"REVOKE"|"EXPIRE"|"BLOCK"):DropAuthorizationState{if(event==="REVOKE")return "REVOKED";if(event==="EXPIRE")return "EXPIRED";if(event==="BLOCK")return "BLOCKED";if(event==="AUTHORIZE"&&state==="PENDING")return "AUTHORIZED";if(event==="CONSUME"&&state==="AUTHORIZED")return "CONSUMED";return state}
