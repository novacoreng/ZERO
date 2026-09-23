# Phase 8 Lock Record

Phase: Phase 8 — Message Expiration
Status: LOCKED

## Build
- Expiration presets and custom-duration contract
- Authoritative expiry timestamp model
- Durable ACTIVE/EXPIRING/DESTROYING/DESTROYED state machine
- FOR_ME vs FOR_EVERYONE semantics
- Offline reconciliation boundary
- Transactional/idempotent worker requirements
- Database migration 007
- Contract tests and documentation

## Test
- Preset durations
- Timestamp calculation
- Custom-duration validation
- Expiration progression
- Invalid transition rejection

## Verify
- Expiration requires no plaintext.
- Terminal DESTROYED state is durable.
- FOR_ME does not claim remote destruction.
- Device clocks are presentation hints, not authoritative expiration proof.
- Worker retries must be idempotent.

## Limitations
- Actual cryptographic key/object destruction is Phase 9.
- Runtime worker/API integration is pending.
- Full clean CI remains limited by prior package-network constraints.

## Next
Phase 9 — Cryptographic Destruction.
