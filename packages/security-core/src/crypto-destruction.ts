export type DestructionTarget = "MESSAGE_KEY" | "FILE_OBJECT_KEY" | "LOCAL_CACHE_KEY";
export type DestructionState = "ACTIVE" | "DESTROYING" | "DESTROYED";
export type DestructionRecord = { targetId:string; target:DestructionTarget; state:DestructionState; keyVersion:number; destructionNonce:string; destroyedAt?:string };
export const DESTRUCTION_POLICY=Object.freeze({plaintextServerStorage:false,privateKeysServerStorage:false,destructionIsIdempotent:true,serverDeletesOpaqueMaterialOnly:true,localKeysMustBeInvalidated:true,terminalState:"DESTROYED"});
export function validateDestructionTargetId(value:string):boolean{return /^[A-Za-z0-9_-]{16,128}$/.test(value);}
export function validateKeyVersion(value:number):boolean{return Number.isInteger(value)&&value>0;}
export function nextDestructionState(state:DestructionState):DestructionState{if(state==="ACTIVE")return "DESTROYING";if(state==="DESTROYING")return "DESTROYED";return "DESTROYED";}
export function assertDestructionTransition(from:DestructionState,to:DestructionState):void{const allowed:Record<DestructionState,readonly DestructionState[]>={ACTIVE:["ACTIVE","DESTROYING"],DESTROYING:["DESTROYING","DESTROYED"],DESTROYED:["DESTROYED"]};if(!allowed[from].includes(to))throw new Error("Invalid destruction state transition");}
export function destructionEvidenceDigest(input:Uint8Array):Promise<ArrayBuffer>{return crypto.subtle.digest("SHA-256",input);}
