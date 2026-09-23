export type LoadWorkload="API"|"MESSAGING"|"UPLOAD"|"NOTIFICATION"|"BACKGROUND";
export type ReliabilityState="HEALTHY"|"DEGRADED"|"BACKPRESSURED"|"RECOVERING"|"FAILED";
export type LoadFindingSeverity="LOW"|"MEDIUM"|"HIGH"|"CRITICAL";
export type LoadFinding={id:string;workload:LoadWorkload;severity:LoadFindingSeverity;code:string;resolved:boolean};
export type LoadProfile={name:string;concurrency:number;durationSeconds:number;requestRatePerSecond:number;maxQueueDepth:number;timeoutMs:number;retryLimit:number};
export const LOAD_RELIABILITY_POLICY=Object.freeze({
maxRetryAttempts:8,
backpressureRequired:true,
queueDepthBounded:true,
idempotencyRequired:true,
connectionPoolBounded:true,
retryStormProtectionRequired:true,
interruptedRecoveryRequired:true,
capacityEvidenceRequired:true,
criticalFindingBlocksRelease:true
});
export function validateLoadProfile(p:LoadProfile):boolean{return Number.isInteger(p.concurrency)&&p.concurrency>0&&Number.isInteger(p.durationSeconds)&&p.durationSeconds>0&&p.requestRatePerSecond>0&&Number.isInteger(p.maxQueueDepth)&&p.maxQueueDepth>0&&Number.isInteger(p.timeoutMs)&&p.timeoutMs>0&&Number.isInteger(p.retryLimit)&&p.retryLimit>=0&&p.retryLimit<=LOAD_RELIABILITY_POLICY.maxRetryAttempts}
export function shouldBackpressure(queueDepth:number,maxQueueDepth:number):boolean{return queueDepth>=maxQueueDepth}
export function canAcceptRetry(attempt:number,retryLimit:number):boolean{return Number.isInteger(attempt)&&attempt>=0&&attempt<retryLimit&&attempt<LOAD_RELIABILITY_POLICY.maxRetryAttempts}
export function canReleaseLoad(findings:readonly LoadFinding[]):boolean{return !findings.some(f=>f.severity==="CRITICAL"&&!f.resolved)}
export function isLoadWorkload(v:string):v is LoadWorkload{return ["API","MESSAGING","UPLOAD","NOTIFICATION","BACKGROUND"].includes(v)}
export function classifyReliability(queueDepth:number,maxQueueDepth:number,failedDependencies:number):ReliabilityState{if(failedDependencies>0)return "FAILED";if(queueDepth>=maxQueueDepth)return "BACKPRESSURED";if(queueDepth>0)return "DEGRADED";return "HEALTHY"}
