# ZERO Agent Handoff

## Current task
Phase 22 — Notifications.

## Status
LOCKED

## Completed
- Privacy-preserving notification model
- Device-scoped push token boundary
- Opaque notification payload
- Notification privacy modes
- Notification lifecycle
- Expiration/revocation
- Provider boundary
- Migration 021
- Contract tests and documentation

## Do not redo
- Never use push notifications as a plaintext messaging channel.
- Never put encryption keys in provider payloads.
- Never put signed URLs or sensitive link parameters in notifications.
- Never deliver expired/revoked notifications.
- Never treat provider tokens as user identity.

## Next action
Begin Phase 23 — Abuse, Spam & Fraud.
