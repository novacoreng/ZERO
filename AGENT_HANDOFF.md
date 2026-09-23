# ZERO Agent Handoff

## Current task
Phase 18 — Temporary Conversations.

## Status
LOCKED.

## Completed
- Temporary conversation lifecycle
- Bounded TTL presets/custom policy
- Server-authoritative expiration
- Device-scoped membership
- Revocation boundary
- Offline reconciliation
- Cryptographic destruction coordination
- Migration 017
- Contract tests and documentation

## Do not redo
- Never weaken E2EE for temporary conversations.
- Never treat a local timer as authoritative deletion evidence.
- Never restore expired conversation keys through account recovery.
- Never allow revoked devices to receive new conversation key material.
- Never mark destruction complete without key invalidation.

## Next action
Begin Phase 19 — Privacy Controls.
