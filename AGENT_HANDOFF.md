# ZERO Agent Handoff

## Current task
Phase 15 — Secure Media & Metadata.

## Status
LOCKED.

## Completed
- Media trust boundary
- Filename sanitization
- MIME distrust boundary
- EXIF/GPS/device metadata removal policy
- Sanitization lifecycle
- Derivative isolation
- Thumbnail/preview policy
- Quarantine boundary
- Migration 014
- Contract tests and documentation

## Do not redo
- Never trust client MIME as authoritative.
- Never interpret uploaded filenames as paths.
- Never expose GPS/device metadata by default.
- Never generate derivatives from unsanitized media.
- Never execute untrusted media.

## Next action
Begin Phase 16 — Secure Link Handling.
