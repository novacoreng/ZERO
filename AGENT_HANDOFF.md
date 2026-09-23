# ZERO Agent Handoff

## Current task
Phase 26 — Backup & Recovery.

## Status
LOCKED

## Completed
- Encrypted backup model
- Recovery levels
- Explicit recovery authorization
- Trusted contacts
- Session revocation on recovery
- Backup/recovery lifecycle
- Migration 025
- Contract tests and documentation

## Do not redo
- Never store plaintext backup or recovery secrets on the server.
- Never expose private keys to the server.
- Trusted contacts do not automatically receive decryption capability.
- Recovery must invalidate prior sessions.
- Expired recovery requests must fail closed.

## Next action
Begin Phase 27 — ZERO Business.
