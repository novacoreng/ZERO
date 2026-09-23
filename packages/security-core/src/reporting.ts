export type ReportCategory="SPAM"|"HARASSMENT"|"FRAUD"|"ABUSE"|"MALICIOUS_FILE"|"SECURITY"|"OTHER";
export type ReportState="SUBMITTED"|"TRIAGED"|"UNDER_REVIEW"|"ACTIONED"|"DISMISSED"|"APPEALED"|"CLOSED";
export type EvidenceKind="USER_NOTE"|"MESSAGE_CIPHERTEXT"|"FILE_OBJECT_REF"|"SECURITY_METADATA";
export type Report={id:string;reporterAccountId:string;targetAccountId?:string;category:ReportCategory;state:ReportState;createdAt:string;};
export const REPORTING_POLICY=Object.freeze({messagePlaintextAutomaticAccess:false,reporterCanChooseEvidence:true,evidenceEncryptionRequired:true,moderatorLeastPrivilege:true,reporterIdentityPrivateByDefault:true,retentionDays:90,appealAllowed:true,emergencySecurityReports:true});
export function validateReportId(v:string):boolean{return /^[A-Za-z0-9_-]{16,128}$/.test(v)}
export function validateCategory(v:string):v is ReportCategory{return ["SPAM","HARASSMENT","FRAUD","ABUSE","MALICIOUS_FILE","SECURITY","OTHER"].includes(v)}
export function canTransitionReport(state:ReportState,event:"TRIAGE"|"REVIEW"|"ACTION"|"DISMISS"|"APPEAL"|"CLOSE"):boolean{const map:Record<ReportState,readonly string[]>= {SUBMITTED:["TRIAGE"],TRIAGED:["REVIEW","DISMISS"],UNDER_REVIEW:["ACTION","DISMISS","APPEAL"],ACTIONED:["CLOSE","APPEAL"],DISMISSED:["CLOSE","APPEAL"],APPEALED:["REVIEW","CLOSE"],CLOSED:[]};return map[state].includes(event)}
