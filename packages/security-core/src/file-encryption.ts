export type FileEncryptionProfile="zero.file.v1"; export type FileEncryptionEnvelope={version:1;profile:FileEncryptionProfile;objectId:string;keyId:string;nonce:Uint8Array;ciphertext:Uint8Array;tag:Uint8Array;plaintextSize:number;encryptedSize:number;};
export const FILE_ENCRYPTION_POLICY=Object.freeze({profile:"zero.file.v1",clientSideOnly:true,serverPlaintext:false,keyBytes:32,nonceBytes:12,tagBytes:16,aead:"AES-256-GCM",associatedDataRequired:true,perObjectKey:true});
export function validateFileKey(key:Uint8Array):boolean{return key.byteLength===32}
export function validateFileNonce(nonce:Uint8Array):boolean{return nonce.byteLength===12}
export function validateFileEncryptionEnvelope(v:FileEncryptionEnvelope):boolean{return v.version===1&&v.profile==="zero.file.v1"&&v.nonce.byteLength===12&&v.tag.byteLength===16&&v.ciphertext.byteLength>0&&v.plaintextSize>=0&&v.encryptedSize>=v.ciphertext.byteLength}
export function buildFileAssociatedData(objectId:string,keyId:string,version=1):Uint8Array{return new TextEncoder().encode("ZERO|"+version+"|zero.file.v1|"+objectId+"|"+keyId)}
export async function sha256(data:Uint8Array):Promise<ArrayBuffer>{const bytes=Uint8Array.from(data);return crypto.subtle.digest("SHA-256",bytes.buffer)}
