# ZERO Agent Handoff

## Current task
Phase 21 — Offline & Nigerian Low-Bandwidth.

## Status
LOCKED

## Completed
- Encrypted offline outbox
- Queue state machine
- Bounded retry/backoff
- Connection classification
- Low-bandwidth scheduling policy
- Interrupted transfer recovery boundary
- Expiration reconciliation
- Migration 020
- Contract tests and documentation

## Do not redo
- Never store plaintext messages in the offline queue.
- Never let retries create duplicate messages.
- Never let local offline state override authoritative expiration.
- Never treat network quality classification as a security decision.
- Never restart an interrupted encrypted file transfer unnecessarily.

## Next action
Begin Phase 22 — Notifications.
