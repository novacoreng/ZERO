# ZERO Agent Handoff

## Current task
Phase 14 — Data Drop Security.

## Status
LOCKED.

## Completed
- High-entropy authorization
- Replay/use-limit state
- Recipient binding digest
- Rate-limit/abuse-control boundary
- Object-storage authorization boundary
- Privacy-preserving access events
- Migration 013
- Contract tests and documentation

## Do not redo
- Never store authorization secrets or encryption keys in plaintext.
- Never allow one-time authorization replay.
- Never issue object access before application authorization.
- Never log signed URLs, secrets, passcodes or encryption keys.
- Never let concurrent downloads bypass configured limits.

## Next action
Begin Phase 15 — Secure Media & Metadata.
