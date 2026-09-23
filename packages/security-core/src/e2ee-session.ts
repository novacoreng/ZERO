export type E2eeProtocolProfile = "zero.msg.v1";
export type E2eeSessionState = "PENDING" | "ESTABLISHED" | "PAUSED" | "REVOKED" | "DESTROYED";
export type PreKeyType = "SIGNED" | "ONE_TIME" | "PQ_SIGNED";
export type CiphertextEnvelope = { version: 1; sessionId: string; senderDeviceId: string; sequence: number; header: Uint8Array; ciphertext: Uint8Array; associatedDataDigest: Uint8Array };
export type PreKeyBundle = { deviceId: string; identityPublicKey: Uint8Array; signedPreKey: Uint8Array; signedPreKeySignature: Uint8Array; pqSignedPreKey?: Uint8Array; oneTimePreKey?: Uint8Array; profile: E2eeProtocolProfile };
export type SessionRecord = { id: string; localDeviceId: string; remoteDeviceId: string; profile: E2eeProtocolProfile; state: E2eeSessionState; createdAt: string; establishedAt?: string; revokedAt?: string };

export const E2EE_POLICY = Object.freeze({ profile: "zero.msg.v1", plaintextServerStorage: false, plaintextServerProcessing: false, customCryptography: false, initialKeyAgreement: "PQXDH", messageRatchet: "DoubleRatchet", multiDeviceSessionManager: "Sesame-style", identityVerificationRequiredForKeyChange: true, ciphertextOnlyMailbox: true, replayProtectionRequired: true, maxSkippedMessageKeys: 2000 } as const);

export function validateSessionId(value: string): boolean { return /^[A-Za-z0-9_-]{16,128}$/.test(value); }
export function validateCiphertextEnvelope(value: CiphertextEnvelope): boolean { return value.version === 1 && validateSessionId(value.sessionId) && value.sequence >= 0 && value.ciphertext.byteLength > 0 && value.header.byteLength > 0; }
export function assertE2eeProfile(profile: string): E2eeProtocolProfile { if (profile !== "zero.msg.v1") throw new Error("Unsupported ZERO E2EE profile"); return profile; }
