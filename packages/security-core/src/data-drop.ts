export type DataDropAccessMode="PIN_REQUIRED"|"ONE_TIME_LINK"|"PASSCODE_REQUIRED"|"AUTHENTICATED";
export type DataDropState="ACTIVE"|"PAUSED"|"EXPIRED"|"REVOKED"|"DESTROYED";
export type DataDropDownloadPolicy="UNLIMITED"|"ONE_DOWNLOAD"|"MAX_DOWNLOADS";
export type DataDrop={id:string;ownerAccountId:string;state:DataDropState;accessMode:DataDropAccessMode;downloadPolicy:DataDropDownloadPolicy;maxDownloads?:number;expiresAt:string;createdAt:string;};
export const DATA_DROP_POLICY=Object.freeze({defaultTtlSeconds:86400,maxTtlSeconds:604800,linkSecretsNeverStoredPlaintext:true,objectKeysNeverExposedByLink:true,downloadAuthorizationRequired:true,expiredDropRejectsAccess:true,revokedDropRejectsAccess:true,accessLogsMinimized:true});
export function validateDropId(v:string):boolean{return /^[A-Za-z0-9_-]{16,128}$/.test(v)}
export function validateDropTtl(seconds:number):boolean{return Number.isInteger(seconds)&&seconds>0&&seconds<=DATA_DROP_POLICY.maxTtlSeconds}
export function validateMaxDownloads(v:number|undefined):boolean{return v===undefined||(Number.isInteger(v)&&v>0)}
export function canAccessDrop(state:DataDropState,now:Date,expiresAt:Date):boolean{return state==="ACTIVE"&&now.getTime()<expiresAt.getTime()}
export function nextDropState(state:DataDropState,event:"PAUSE"|"RESUME"|"EXPIRE"|"REVOKE"|"DESTROY"):DataDropState{if(event==="EXPIRE")return "EXPIRED";if(event==="REVOKE")return "REVOKED";if(event==="DESTROY")return "DESTROYED";if(event==="PAUSE"&&state==="ACTIVE")return "PAUSED";if(event==="RESUME"&&state==="PAUSED")return "ACTIVE";return state}
