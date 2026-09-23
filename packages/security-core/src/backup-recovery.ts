export type RecoveryLevel="STANDARD"|"ENHANCED"|"EMERGENCY";
export type BackupState="CREATED"|"ACTIVE"|"REVOKED"|"DESTROYED";
export type RecoveryState="IDLE"|"PENDING"|"VERIFIED"|"COMPLETED"|"REVOKED";
export type TrustedContactState="PENDING"|"VERIFIED"|"REVOKED";
export type EncryptedBackupRecord={id:string;accountId:string;deviceId:string;state:BackupState;keyVersion:number;ciphertextDigest:Uint8Array;createdAt:string;};
export const BACKUP_RECOVERY_POLICY=Object.freeze({clientSideEncryptionRequired:true,serverPlaintextBackup:false,privateKeysServerPlaintext:false,backupKeyDerivedClientSide:true,recoveryRequiresExplicitAuthorization:true,recoveryRevokesSessions:true,trustedContactsCannotDecryptAutomatically:true,recoverySecretsNeverStoredPlaintext:true,expiredRequestsInvalid:true});
export function validateBackupId(v:string):boolean{return /^[A-Za-z0-9_-]{16,128}$/.test(v)}
export function validateRecoveryId(v:string):boolean{return /^[A-Za-z0-9_-]{16,128}$/.test(v)}
export function validateDigest(v:Uint8Array):boolean{return v.byteLength===32}
export function canCompleteRecovery(state:RecoveryState,authorizationVerified:boolean):boolean{return (state==="PENDING"||state==="VERIFIED")&&authorizationVerified}
export function isRecoveryExpired(expiresAt:Date,now:Date):boolean{return now.getTime()>=expiresAt.getTime()}
