export type MessageKind = "TEXT" | "REACTION" | "REPLY" | "SYSTEM";
export type MessageDeliveryState = "QUEUED" | "SENT" | "DELIVERED" | "FAILED" | "EXPIRED" | "DESTROYED";
export type MessageEnvelope = { version: 1; messageId: string; conversationId: string; sessionId: string; senderDeviceId: string; clientSequence: number; kind: MessageKind; ciphertext: Uint8Array; aadDigest: Uint8Array; createdAt: string; expiresAt?: string };
export type DeliveryReceipt = { messageId: string; deviceId: string; state: "DELIVERED" | "FAILED"; receivedAt: string };
export type SendAttempt = { messageId: string; attempt: number; createdAt: string; lastErrorCode?: string };
export const MESSAGE_POLICY = Object.freeze({ plaintextServerStorage: false, serverSearch: false, maxEnvelopeBytes: 1024 * 1024, requireSession: true, requireCiphertext: true, requireConversationBinding: true, idempotentMessageId: true, clientSequenceMonotonicity: true, localPlaintextOnly: true } as const);
export function validateOpaqueId(value: string): boolean { return /^[A-Za-z0-9_-]{16,128}$/.test(value); }
export function validateMessageEnvelope(value: MessageEnvelope): boolean { return value.version === 1 && validateOpaqueId(value.messageId) && validateOpaqueId(value.conversationId) && validateOpaqueId(value.sessionId) && validateOpaqueId(value.senderDeviceId) && value.clientSequence >= 0 && value.ciphertext.byteLength > 0 && value.ciphertext.byteLength <= MESSAGE_POLICY.maxEnvelopeBytes && value.aadDigest.byteLength === 32; }
export function nextRetryDelay(attempt: number): number { const n = Math.max(0, Math.min(attempt, 8)); return Math.min(60_000, 500 * (2 ** n)); }
