export type MediaKind="IMAGE"|"VIDEO"|"AUDIO"|"DOCUMENT"|"OTHER";
export type MediaProcessingState="UNPROCESSED"|"SANITIZING"|"SANITIZED"|"FAILED"|"QUARANTINED";
export type MediaTrustLevel="UNTRUSTED"|"SANITIZED"|"VERIFIED";
export type SecureMediaRecord={id:string;objectId:string;kind:MediaKind;state:MediaProcessingState;trustLevel:MediaTrustLevel;originalName:string;safeName:string;declaredMime?:string;detectedMime?:string;metadataStripped:boolean;createdAt:string;};
export const SECURE_MEDIA_POLICY=Object.freeze({clientMetadataPrivacy:true,stripExif:true,stripGps:true,stripDeviceMetadata:true,filenameSanitized:true,mimeIsUntrusted:true,contentSniffingRequired:true,serverExecutesUntrustedMedia:false,thumbnailFromOriginal:false,thumbnailFromSanitizedOnly:true,quarantineOnProcessingFailure:true,metadataPlaintextStorage:false});
export function sanitizeFilename(value:string):string{const base=value.normalize("NFKC").replace(/[\\/\0]/g,"_").replace(/[\r\n\t]/g," ").trim().replace(/[^A-Za-z0-9._ -]/g,"_");return (base||"file").slice(0,255)}
export function validateMediaKind(value:string):value is MediaKind{return ["IMAGE","VIDEO","AUDIO","DOCUMENT","OTHER"].includes(value)}
export function nextMediaState(state:MediaProcessingState,event:"START"|"SUCCESS"|"FAIL"|"QUARANTINE"):MediaProcessingState{if(event==="START"&&state==="UNPROCESSED")return "SANITIZING";if(event==="SUCCESS"&&state==="SANITIZING")return "SANITIZED";if(event==="FAIL"&&state==="SANITIZING")return "FAILED";if(event==="QUARANTINE")return "QUARANTINED";return state}
