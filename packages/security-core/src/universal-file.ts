export type FileObjectState = "CREATED" | "READY" | "UPLOADING" | "AVAILABLE" | "FAILED" | "EXPIRED" | "DESTROYED";
export type FilePackagingMode = "SINGLE_FILE" | "ZIP_PACKAGE";
export type FileObject = { id:string; name:string; sizeBytes:number; mediaType:string; state:FileObjectState; packaging:FilePackagingMode; sha256Digest:Uint8Array; createdAt:string; };
export const FILE_POLICY=Object.freeze({maxObjectBytes:10*1024*1024*1024,maxNameBytes:255,minChunkBytes:256*1024,maxChunkBytes:16*1024*1024,serverExecutesFiles:false,serverIndexesContent:false,foldersRequirePackaging:true,opaqueObject:true});
export function validateFileName(value:string):boolean{const bytes=new TextEncoder().encode(value);return value.length>0&&value.length<=255&&!bytes.includes(0)};
export function validateFileSize(sizeBytes:number):boolean{return Number.isSafeInteger(sizeBytes)&&sizeBytes>=0&&sizeBytes<=FILE_POLICY.maxObjectBytes};
export function validateMediaType(value:string):boolean{return /^[a-z0-9][a-z0-9!#$&^_.+-]*\/[a-z0-9][a-z0-9!#$&^_.+-]*$/i.test(value)};
export function validateChunkSize(sizeBytes:number):boolean{return Number.isSafeInteger(sizeBytes)&&sizeBytes>=FILE_POLICY.minChunkBytes&&sizeBytes<=FILE_POLICY.maxChunkBytes};
export function assertPackaging(mode:FilePackagingMode,isFolder:boolean):FilePackagingMode{if(isFolder&&mode!=="ZIP_PACKAGE")throw new Error("Folders must be packaged before upload");return mode;}
