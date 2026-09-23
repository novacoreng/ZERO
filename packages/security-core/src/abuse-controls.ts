export type TrustLevel="NEW"|"STANDARD"|"TRUSTED"|"RESTRICTED";
export type AbuseAction="ALLOW"|"CHALLENGE"|"THROTTLE"|"BLOCK"|"REVIEW";
export type AbuseSignal="RATE_LIMIT"|"AUTH_FAILURES"|"DEVICE_ANOMALY"|"REPORT_SPIKE"|"DROP_ABUSE"|"SPAM_PATTERN";
export type AbuseDecision={action:AbuseAction;reasonCode:string;expiresAt?:string;};
export const ABUSE_POLICY=Object.freeze({messageContentInspection:false,automatedSignalsMetadataOnly:true,defaultTrust:"NEW" as TrustLevel,maxAuthFailuresWindow:5,rateLimitRequired:true,antiEnumeration:true,temporaryRestriction:true,appealPathRequired:true,adminCannotReadMessagePlaintext:true});
export function validateTrustLevel(v:string):v is TrustLevel{return ["NEW","STANDARD","TRUSTED","RESTRICTED"].includes(v)}
export function decideAbuse(signal:AbuseSignal,trust:TrustLevel):AbuseDecision{if(signal==="AUTH_FAILURES"||signal==="RATE_LIMIT")return {action:trust==="TRUSTED"?"THROTTLE":"CHALLENGE",reasonCode:signal};if(signal==="REPORT_SPIKE"||signal==="DROP_ABUSE")return {action:"REVIEW",reasonCode:signal};if(signal==="SPAM_PATTERN")return {action:"THROTTLE",reasonCode:signal};return {action:"ALLOW",reasonCode:"NONE"}}
export function shouldInspectContent():boolean{return ABUSE_POLICY.messageContentInspection}
