export type GroupState="CREATING"|"ACTIVE"|"PAUSED"|"EXPIRED"|"DESTROYED";
export type GroupMemberRole="OWNER"|"ADMIN"|"MEMBER";
export type GroupMemberState="INVITED"|"ACTIVE"|"SUSPENDED"|"REMOVED";
export type GroupKeyEpoch={groupId:string;epoch:number;state:"CURRENT"|"RETIRED";createdAt:string;retiredAt?:string;};
export type GroupMember={groupId:string;accountId:string;deviceId:string;role:GroupMemberRole;state:GroupMemberState;joinedAt:string;removedAt?:string;};
export const GROUP_SECURITY_POLICY=Object.freeze({protocol:"MLS-RFC-9420",serverPlaintext:false,serverDecrypts:false,serverStoresGroupSecrets:false,membershipChangesAdvanceEpoch:true,removedMembersReceiveNoNewEpochKeys:true,deviceScopedMembership:true,inviteTtlSeconds:900,maxMembers:5000});
export function validateGroupId(v:string):boolean{return /^[A-Za-z0-9_-]{16,128}$/.test(v)}
export function validateGroupEpoch(v:number):boolean{return Number.isInteger(v)&&v>=0}
export function validateMemberRole(v:string):v is GroupMemberRole{return ["OWNER","ADMIN","MEMBER"].includes(v)}
export function nextGroupEpoch(current:number,membershipChanged:boolean):number{if(!validateGroupEpoch(current))throw new Error("Invalid group epoch");return membershipChanged?current+1:current}
export function canReceiveEpochKeys(member:GroupMember,state:"CURRENT"|"RETIRED"):boolean{return member.state==="ACTIVE"&&state==="CURRENT"}
