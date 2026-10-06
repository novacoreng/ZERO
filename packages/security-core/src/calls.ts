export type CallKind="AUDIO"|"VIDEO";
export type CallState="OFFERED"|"RINGING"|"CONNECTING"|"CONNECTED"|"RECONNECTING"|"ENDED"|"MISSED"|"REJECTED"|"FAILED"|"EXPIRED";
export type CallEndReason="COMPLETED"|"DECLINED"|"TIMEOUT"|"NETWORK_FAILURE"|"REVOKED"|"EXPIRED"|"USER_ENDED";
export type CallSession={id:string;conversationId:string;callerDeviceId:string;calleeDeviceId:string;kind:CallKind;state:CallState;createdAt:string;expiresAt:string;};
export const CALL_POLICY=Object.freeze({
mediaEndToEndEncrypted:true,
serverMediaRelayOnly:true,
serverStoresMedia:false,
serverStoresPlaintext:false,
callKeysNeverStoredServerPlaintext:true,
signalingMetadataMinimized:true,
revokedDeviceCannotCall:true,
reconnectRequired:true,
groupCallsDeferred:true
});
export function validateCallId(v:string):boolean{return /^[A-Za-z0-9_-]{16,128}$/.test(v)}
export function validateCallTtl(seconds:number):boolean{return Number.isInteger(seconds)&&seconds>0&&seconds<=120}
export function canTransitionCall(state:CallState,next:CallState):boolean{
const m:Record<CallState,readonly CallState[]>={
OFFERED:["OFFERED","RINGING","REJECTED","EXPIRED","FAILED"],RINGING:["RINGING","CONNECTING","REJECTED","MISSED","EXPIRED","FAILED"],
CONNECTING:["CONNECTING","CONNECTED","RECONNECTING","FAILED","ENDED","EXPIRED"],CONNECTED:["CONNECTED","RECONNECTING","ENDED","REJECTED"],
RECONNECTING:["RECONNECTING","CONNECTED","FAILED","ENDED"],ENDED:["ENDED"],MISSED:["MISSED"],REJECTED:["REJECTED"],FAILED:["FAILED"],EXPIRED:["EXPIRED"]};
return m[state].includes(next)}
export function isTerminalCallState(state:CallState):boolean{return ["ENDED","MISSED","REJECTED","FAILED","EXPIRED"].includes(state)}
