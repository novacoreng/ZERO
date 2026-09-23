export type DevicePlatform = "ios" | "android" | "web" | "desktop";
export type DeviceTrustState = "PENDING" | "TRUSTED" | "REVOKED" | "RETIRED";
export type DeviceKeyState = "GENERATED" | "PUBLISHED" | "ACTIVE" | "ROTATING" | "REVOKED" | "DESTROYED";
export type DeviceIdentityRecord = { deviceId: string; accountId: string; platform: DevicePlatform; deviceLabel: string; trustState: DeviceTrustState; identityKeyFingerprint: string; identityKeyState: DeviceKeyState; createdAt: string; lastSeenAt?: string; revokedAt?: string };
export type DeviceRegistrationRequest = { deviceId: string; platform: DevicePlatform; deviceLabel: string; identityPublicKey: Uint8Array; proofOfPossession: Uint8Array };
export type DeviceRevocationReason = "USER_REVOKED" | "SECURITY_EVENT" | "ACCOUNT_RECOVERY" | "DEVICE_RETIRED";
export type DevicePairingPayload = { version: 1; deviceId: string; accountId: string; challenge: Uint8Array; expiresAt: string };
export const DEVICE_IDENTITY_POLICY = Object.freeze({ oneCryptographicIdentityPerDevice: true, serverStoresPublicMaterialOnly: true, privateKeysNeverLeaveDevice: true, pairingRequiresUserPresence: true, pairingPayloadExpiresSeconds: 120, revokedDevicesCannotSend: true, revokedDevicesCannotReceiveNewSessions: true, accountIdIsNotADeviceKey: true, zeroPinIsNotADeviceKey: true } as const);
export function validateDevicePlatform(value: string): value is DevicePlatform { return ["ios", "android", "web", "desktop"].includes(value); }
export function validateDeviceId(value: string): boolean { return /^[A-Za-z0-9_-]{16,128}$/.test(value); }
export function validateDevicePublicMaterial(value: Uint8Array): boolean { return value.byteLength >= 32 && value.byteLength <= 4096; }
