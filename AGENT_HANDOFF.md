# ZERO Agent Handoff

## Current task
Phase 33 — Audit & Security Logging.

## Status
LOCKED

## Completed
- Security audit domains
- Immutable/tamper-evident event model
- Correlation IDs
- Monotonic sequences
- Previous/event digests
- Retention classes
- Sensitive-data exclusions
- Critical alerting boundary
- Migration 032
- Contract tests and documentation

## Do not redo
- Keep security audit separate from ordinary logs.
- Never log message plaintext, private keys, tokens or recovery secrets.
- Every security event requires correlation context and retention classification.
- Preserve tamper-evident sequencing.
- Critical alerts must preserve privacy exclusions.

## Next action
Begin Phase 34 — Accessibility & Localization.
