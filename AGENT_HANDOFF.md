# ZERO Agent Handoff

## Current task
Phase 8 — Message Expiration.

## Status
LOCKED.

## Completed
- Expiration policy
- Authoritative expiry timestamps
- Durable expiration state machine
- FOR_ME and FOR_EVERYONE semantics
- Offline reconciliation contract
- Database migration 007
- Contract tests and documentation

## Do not redo
- Do not use client clocks as authoritative server expiration.
- Do not claim FOR_ME deletes remote copies.
- Do not skip durable state transitions.
- Do not store plaintext to evaluate expiration.
- Do not implement cryptographic destruction here; that is Phase 9.

## Next action
Begin Phase 9 — Cryptographic Destruction.
