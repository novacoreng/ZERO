export type Environment="DEVELOPMENT"|"STAGING"|"PRODUCTION";
export type SecretClass="PUBLIC_CONFIG"|"SERVICE_SECRET"|"CRYPTO_SECRET"|"RECOVERY_SECRET";
export type SecurityControlState="REQUIRED"|"ENFORCED"|"EXCEPTION";
export type InfrastructureControl={code:string;state:SecurityControlState;environment:Environment;};
export const INFRASTRUCTURE_SECURITY_POLICY=Object.freeze({
tlsRequired:true,
plaintextTransport:false,
secretsInSource:false,
secretsInLogs:false,
productionSecretsSeparate:true,
serviceIdentityRequired:true,
leastPrivilegeRequired:true,
networkSegmentationRequired:true,
rateLimitingRequired:true,
ddosProtectionRequired:true,
encryptionAtRestRequired:true,
securityHeadersRequired:true,
dependencyPinningRequired:true,
immutableDeploymentsRequired:true,
auditLoggingRequired:true
});
export function validateControlCode(v:string):boolean{return /^[A-Z0-9_]{3,64}$/.test(v)}
export function isProductionEnvironment(v:string):v is "PRODUCTION"{return v==="PRODUCTION"}
export function canStoreSecretInSource():boolean{return false}
export function isSecureTransport(protocol:string):boolean{return protocol.toLowerCase()==="https"||protocol.toLowerCase()==="wss"}
