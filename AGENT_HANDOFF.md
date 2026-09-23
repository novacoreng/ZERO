# ZERO Agent Handoff

## Current task
Phase 16 — Secure Link Handling.

## Status
LOCKED.

## Completed
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

## Do not redo
- Never allow javascript/data/file URLs.
- Never blindly follow redirects.
- Never log full URLs containing sensitive query data.
- Never fetch previews without SSRF/network isolation.
- Never treat an external destination as part of ZERO's trust boundary.

## Next action
Begin Phase 17 — Groups.
