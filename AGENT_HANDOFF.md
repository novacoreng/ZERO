# ZERO Agent Handoff

## Current task
Phase 12 — Large File / Resumable Upload.

## Status
LOCKED.

## Completed
- Resumable encrypted upload session
- Chunk bounds and metadata
- Chunk idempotency
- Integrity metadata
- Upload state machine
- Resume/recovery contract
- Migration 011
- Contract tests and documentation

## Do not redo
- Do not upload plaintext chunks.
- Do not accept conflicting metadata for an existing chunk index.
- Do not mark an upload AVAILABLE before finalization.
- Do not reuse an AEAD nonce with the same object key.
- Do not claim runtime object-storage integration is complete.

## Next action
Begin Phase 13 — Data Drops.
