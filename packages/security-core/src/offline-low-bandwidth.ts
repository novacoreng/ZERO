export type ConnectionClass="OFFLINE"|"VERY_POOR"|"POOR"|"FAIR"|"GOOD";
export type OutboxState="QUEUED"|"SENDING"|"SENT"|"FAILED"|"BLOCKED";
export type QueuePriority="CRITICAL"|"NORMAL"|"BULK";
export type OfflineOutboxItem={id:string;conversationId:string;deviceId:string;ciphertextDigest:Uint8Array;state:OutboxState;priority:QueuePriority;attempts:number;nextAttemptAt:string;createdAt:string;};
export const OFFLINE_POLICY=Object.freeze({encryptedOutboxOnly:true,plaintextOutboxStorage:false,maxRetryAttempts:8,baseRetrySeconds:2,maxRetrySeconds:300,maxOutboxItems:10000,lowBandwidthMode:true,preferSmallPayloads:true,backgroundBulkTransfersDisabled:true,serverIsAuthoritativeForExpiry:true});
export function validateOutboxId(v:string):boolean{return /^[A-Za-z0-9_-]{16,128}$/.test(v)}
export function classifyConnection(rttMs:number,downlinkMbps:number):ConnectionClass{if(rttMs>=3000||downlinkMbps<0.05)return "VERY_POOR";if(rttMs>=1000||downlinkMbps<0.25)return "POOR";if(rttMs>=400||downlinkMbps<1)return "FAIR";return "GOOD"}
export function retryDelaySeconds(attempt:number):number{if(!Number.isInteger(attempt)||attempt<0)throw new Error("Invalid attempt");return Math.min(OFFLINE_POLICY.baseRetrySeconds*2**attempt,OFFLINE_POLICY.maxRetrySeconds)}
export function nextOutboxState(state:OutboxState,event:"SEND"|"SUCCESS"|"FAIL"|"BLOCK"):OutboxState{if(event==="BLOCK")return "BLOCKED";if(event==="SEND"&&state==="QUEUED")return "SENDING";if(event==="SUCCESS"&&state==="SENDING")return "SENT";if(event==="FAIL"&&state==="SENDING")return "FAILED";return state}
