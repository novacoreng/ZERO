# ZERO Agent Handoff

## Current task
Phase 13 — Data Drops.

## Status
LOCKED.

## Completed
- Temporary encrypted sharing container
- Access modes
- Expiration and revocation
- Download policies
- Authorization digest boundary
- Migration 012
- Contract tests and documentation

## Do not redo
- Do not put encryption keys in drop links.
- Do not store link/passcode plaintext.
- Do not allow expired/revoked drops to authorize new access.
- Do not increment download counts non-atomically.
- Do not bypass rate limits or abuse controls.

## Next action
Begin Phase 14 — Data Drop Security.
