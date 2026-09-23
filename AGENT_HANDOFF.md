# ZERO Agent Handoff

## Current task
Phase 28 — Calls.

## Status
LOCKED

## Completed
- 1-to-1 audio/video call model
- Encrypted media boundary
- Device/session authorization
- Call lifecycle and expiry
- Reconnection state
- Minimal call metadata
- Migration 027
- Contract tests and documentation

## Do not redo
- Never store call media on the server.
- Never store call keys plaintext server-side.
- Revoked devices cannot call.
- Expired call offers fail closed.
- Terminal calls cannot restart.

## Next action
Begin Phase 29 — Privacy-Preserving Analytics.
