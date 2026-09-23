# Phase 28 Lock Record

Phase: Phase 28 — Calls
Status: LOCKED

## Build
- 1-to-1 audio/video call model
- Encrypted media boundary
- Device/session authorization
- Call lifecycle and expiry
- Reconnection state
- Minimal call metadata
- Migration 027
- Contract tests and documentation

## Verify
- Server never stores call media.
- Call keys are not stored server-side in plaintext.
- Revoked devices cannot call.
- Expired offers fail closed.
- Reconnection is represented explicitly.
- Terminal states cannot restart.

## Limitations
Production WebRTC/media stack, TURN, mobile call integration, push signaling, NAT traversal, call-key implementation, network testing and independent security review remain open.

## Next
Phase 29 — Privacy-Preserving Analytics.
