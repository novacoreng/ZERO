export type UploadState="CREATED"|"UPLOADING"|"PAUSED"|"FINALIZING"|"AVAILABLE"|"FAILED"|"ABORTED";
export type UploadSession={id:string;fileObjectId:string;chunkSizeBytes:number;totalChunks:number;state:UploadState;createdAt:string;};
export type UploadChunk={uploadId:string;chunkIndex:number;offsetBytes:number;sizeBytes:number;ciphertext:Uint8Array;integrityDigest:Uint8Array;nonce:Uint8Array;};
export const UPLOAD_POLICY=Object.freeze({minChunkBytes:256*1024,maxChunkBytes:16*1024*1024,maxConcurrentChunks:4,retryLimit:8,plaintextTransport:false,orderedFinalization:true,chunkNonceReuse:false,idempotentChunks:true});
export function validateUploadId(v:string):boolean{return /^[A-Za-z0-9_-]{16,128}$/.test(v)}
export function validateChunkIndex(v:number,total:number):boolean{return Number.isInteger(v)&&v>=0&&v<total}
export function validateChunk(v:UploadChunk,total:number):boolean{return validateUploadId(v.uploadId)&&validateChunkIndex(v.chunkIndex,total)&&v.offsetBytes>=0&&v.sizeBytes>0&&v.ciphertext.byteLength===v.sizeBytes&&v.integrityDigest.byteLength===32&&v.nonce.byteLength===12}
export function assertChunkSize(v:number):void{if(!Number.isInteger(v)||v<UPLOAD_POLICY.minChunkBytes||v>UPLOAD_POLICY.maxChunkBytes)throw new Error("Invalid upload chunk size")}
export function nextUploadState(s:UploadState,n:UploadState):UploadState{const a:Record<UploadState,readonly UploadState[]>={CREATED:["CREATED","UPLOADING","ABORTED"],UPLOADING:["UPLOADING","PAUSED","FINALIZING","FAILED","ABORTED"],PAUSED:["PAUSED","UPLOADING","ABORTED"],FINALIZING:["FINALIZING","AVAILABLE","FAILED"],AVAILABLE:["AVAILABLE"],FAILED:["FAILED","UPLOADING","ABORTED"],ABORTED:["ABORTED"]};if(!a[s].includes(n))throw new Error("Invalid upload state transition");return n}
