# Phase 16 Lock Record

Phase: Phase 16 — Secure Link Handling
Status: LOCKED

## Build
- URL parsing and normalization
- Dangerous protocol rejection
- Local-host rejection
- Tracking-parameter minimization
- Fragment removal
- Preview policy
- Redirect boundary
- Expiration boundary
- Privacy-safe logging policy
- Migration 015
- Contract tests and documentation

## Verify
- javascript/data/file URLs are rejected.
- Local development hosts are rejected.
- HTTPS is preferred.
- Tracking parameters are minimized.
- URL fragments are not retained.
- Previews require explicit allowance and safe state.
- ZERO does not blindly follow redirects.

## Limitations
- Production reputation/blocklist service is pending.
- Isolated preview worker and SSRF defenses remain integration gates.
- Independent security review remains required.

## Next
Phase 17 — Groups.
