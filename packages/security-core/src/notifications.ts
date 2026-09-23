export type NotificationPrivacy="FULL"|"SENDER_ONLY"|"HIDDEN";
export type NotificationKind="MESSAGE_WAKE"|"CALL_WAKE"|"SECURITY_EVENT"|"SYSTEM";
export type NotificationState="QUEUED"|"SENT"|"DELIVERED"|"FAILED"|"EXPIRED"|"REVOKED";
export type DevicePushToken={deviceId:string;provider:"APNS"|"FCM"|"WEB_PUSH";tokenDigest:Uint8Array;active:boolean;createdAt:string;revokedAt?:string;};
export type NotificationEnvelope={id:string;deviceId:string;kind:NotificationKind;privacy:NotificationPrivacy;opaquePayload:Uint8Array;expiresAt:string;state:NotificationState;createdAt:string;};
export const NOTIFICATION_POLICY=Object.freeze({plaintextMessageContent:false,serverReadsMessagePreview:false,opaquePayloadRequired:true,maxPayloadBytes:4096,defaultPrivacy:"SENDER_ONLY" as NotificationPrivacy,tokenPlaintextStorage:false,deviceScopedTokens:true,expiredNotificationsMustNotDeliver:true,revokedDevicesMustNotDeliver:true});
export function validateTokenDigest(v:Uint8Array):boolean{return v.byteLength===32}
export function validateNotificationId(v:string):boolean{return /^[A-Za-z0-9_-]{16,128}$/.test(v)}
export function shouldIncludeMessagePreview(privacy:NotificationPrivacy):boolean{return privacy==="FULL"}
export function canDeliverNotification(state:NotificationState,now:Date,expiresAt:Date,deviceActive:boolean):boolean{return state!=="EXPIRED"&&state!=="REVOKED"&&deviceActive&&now.getTime()<expiresAt.getTime()}
export function nextNotificationState(state:NotificationState,event:"SEND"|"DELIVER"|"FAIL"|"EXPIRE"|"REVOKE"):NotificationState{if(event==="EXPIRE")return "EXPIRED";if(event==="REVOKE")return "REVOKED";if(event==="SEND"&&state==="QUEUED")return "SENT";if(event==="DELIVER"&&state==="SENT")return "DELIVERED";if(event==="FAIL"&&state==="SENT")return "FAILED";return state}
