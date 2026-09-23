# Phase 22 Lock Record

Phase: Phase 22 — Notifications
Status: LOCKED

## Build
- Privacy-preserving notification model
- Device-scoped push token boundary
- Opaque notification payload
- Notification privacy modes
- Notification lifecycle
- Expiration/revocation
- Provider boundary
- Migration 021
- Contract tests and documentation

## Verify
- Message plaintext is not required for notification generation.
- Push tokens are represented by digests.
- Notification payloads are bounded.
- Expired/revoked notifications cannot deliver.
- Provider payloads cannot contain encryption keys or sensitive URLs.

## Limitations
- Production APNS/FCM/Web Push adapters remain required.
- Platform background handling and delivery telemetry remain integration work.
- Independent security review remains required.

## Next
Phase 23 — Abuse, Spam & Fraud.
