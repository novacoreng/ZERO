export type RecoveryTier="DATABASE"|"OBJECT_STORAGE"|"KEY_METADATA"|"SERVICE_CONFIG";
export type BackupIntegrityState="PENDING"|"VERIFIED"|"CORRUPTED"|"EXPIRED";
export type RecoveryTestState="PLANNED"|"RUNNING"|"PASSED"|"FAILED";
export type RecoveryRecord={id:string;tier:RecoveryTier;backupId:string;integrity:BackupIntegrityState;createdAt:string;verifiedAt?:string;};
export const DISASTER_RECOVERY_POLICY=Object.freeze({
encryptedBackupsRequired:true,
crossRegionCopiesRequired:true,
immutableBackupWindowHours:24,
targetRpoMinutes:15,
targetRtoMinutes:60,
restoreVerificationRequired:true,
corruptionDetectionRequired:true,
productionRestoreMustBeTested:true,
keysNeverBackedUpPlaintext:true,
messagePlaintextExcluded:true,
restoreRequiresAuthorization:true
});
export function validateRecoveryRecordId(v:string):boolean{return /^[A-Za-z0-9_-]{16,128}$/.test(v)}
export function validateRpoMinutes(v:number):boolean{return Number.isInteger(v)&&v>0&&v<=1440}
export function validateRtoMinutes(v:number):boolean{return Number.isInteger(v)&&v>0&&v<=1440}
export function canRestore(integrity:BackupIntegrityState,authorized:boolean):boolean{return integrity==="VERIFIED"&&authorized}
export function isUsableBackup(integrity:BackupIntegrityState):boolean{return integrity==="VERIFIED"}
