# Phase 20 Lock Record

Phase: Phase 20 — ZERO Lock & Local Privacy
Status: LOCKED

## Build
- Local lock policy
- Biometric/passcode/PIN boundary
- Secure storage requirements
- Auto-lock policy
- Background privacy
- Clipboard protection
- Panic lock/destruction boundary
- Capture protection boundary
- Migration 019
- Contract tests and documentation

## Verify
- Private keys remain device-bound.
- Biometric templates are never stored by ZERO.
- Locked state hides plaintext.
- Panic does not claim impossible forensic wiping.
- Clipboard clearing is bounded and platform-dependent.
- Local privacy policy is device-scoped.

## Limitations
- Native secure-storage and biometric integrations remain required.
- Verified local-key destruction and device testing remain required.
- Independent security review remains required.

## Next
Phase 21 — Offline & Nigerian Low-Bandwidth.
