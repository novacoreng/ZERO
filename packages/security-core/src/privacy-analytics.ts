export type AnalyticsPurpose="RELIABILITY"|"SECURITY"|"ABUSE_PREVENTION"|"PRODUCT_USAGE";
export type AnalyticsCollectionMode="REQUIRED_MINIMAL"|"OPTIONAL"|"DISABLED";
export type AnalyticsEvent={id:string;purpose:AnalyticsPurpose;eventCode:string;bucket:string;count:number;createdAt:string;};
export const PRIVACY_ANALYTICS_POLICY=Object.freeze({
messageContent:false,
messagePlaintext:false,
fileContent:false,
callContent:false,
contactGraph:false,
preciseLocation:false,
advertisingProfiles:false,
crossContextTracking:false,
minimumAggregationCount:10,
retentionDays:30,
optionalUsageAnalyticsDefault:false,
securityTelemetrySeparate:true,
rawEventPayloads:false
});
export function validateAnalyticsEventId(v:string):boolean{return /^[A-Za-z0-9_-]{16,128}$/.test(v)}
export function validateCount(v:number):boolean{return Number.isInteger(v)&&v>=PRIVACY_ANALYTICS_POLICY.minimumAggregationCount}
export function isAllowedPurpose(v:string):v is AnalyticsPurpose{return ["RELIABILITY","SECURITY","ABUSE_PREVENTION","PRODUCT_USAGE"].includes(v)}
export function collectionAllowed(mode:AnalyticsCollectionMode,purpose:AnalyticsPurpose):boolean{return mode!=="DISABLED"&&!(purpose==="PRODUCT_USAGE"&&mode!=="OPTIONAL")}
