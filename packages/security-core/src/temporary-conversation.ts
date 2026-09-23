export type TemporaryConversationState="ACTIVE"|"EXPIRING"|"EXPIRED"|"DESTROYING"|"DESTROYED"|"REVOKED";
export type TemporaryConversationTtl="10_MINUTES"|"1_HOUR"|"6_HOURS"|"24_HOURS"|"3_DAYS"|"7_DAYS"|"CUSTOM";
export type ConversationMemberState="ACTIVE"|"REMOVED"|"REVOKED";
export type TemporaryConversation={id:string;state:TemporaryConversationState;ttl:TemporaryConversationTtl;expiresAt:string;createdAt:string;destroyKeysOnExpiry:boolean;};
export const TEMP_CONVERSATION_POLICY=Object.freeze({serverPlaintext:false,localPlaintextOnly:true,clockAuthority:"server",minTtlSeconds:600,maxTtlSeconds:604800,offlineMustReconcile:true,expiryTriggersKeyDestruction:true,revocationBlocksNewMessages:true});
export function validateConversationId(v:string):boolean{return /^[A-Za-z0-9_-]{16,128}$/.test(v)}
export function validateTtlSeconds(v:number):boolean{return Number.isInteger(v)&&v>=TEMP_CONVERSATION_POLICY.minTtlSeconds&&v<=TEMP_CONVERSATION_POLICY.maxTtlSeconds}
export function canSend(state:TemporaryConversationState,now:Date,expiresAt:Date):boolean{return state==="ACTIVE"&&now.getTime()<expiresAt.getTime()}
export function nextTemporaryConversationState(state:TemporaryConversationState,event:"EXPIRE"|"DESTROY_START"|"DESTROY"|"REVOKE"):TemporaryConversationState{if(event==="REVOKE")return "REVOKED";if(event==="EXPIRE"&&state==="ACTIVE")return "EXPIRING";if(event==="DESTROY_START"&&["EXPIRING","EXPIRED"].includes(state))return "DESTROYING";if(event==="DESTROY"&&state==="DESTROYING")return "DESTROYED";return state}
