# ZERO Project State

- Current phase: Phase 43 — Production Launch / testing-readiness hardening.
- Status: ACTIVE TESTING CHECKPOINT — the web and Expo test surfaces are being verified under the current Full Stack Production App Builder workflow.
- Testing target: Vercel-hosted Next.js web + Expo Go mobile on SDK 57.
- UI: reference-inspired NOVA glass workspace with responsive desktop sidebar, mobile drawer, authentication test boundary, quick actions and Dynamic Island-style in-app notifications.
- Expo Go: npm run mobile:go from the repository root, or npm run start:go from apps/mobile.
- Vercel: repository configuration builds apps/web as Next.js. Connected Vercel API verification is currently blocked by account/team re-authentication, so deployment success must not be claimed without Vercel evidence.
- CI: quality workflow now verifies security-core TypeScript/tests, web typecheck/build, mobile typecheck, Android Expo bundle export and repository security scan.
- Authentication: email OTP, phone OTP and passkey remain explicit provider integration boundaries; UI success is not represented as real authentication.
- Launch posture: PRODUCTION LAUNCH BLOCKED until all required real-world evidence is collected and verified.
- Security posture: independent cryptographic/security audit and external penetration test are not established as completed; production/runtime evidence remains required.
- Brand: ZERO disappearing-message logo remains canonical in brand/logo/.
- Security design: cryptographic shredder/mixing remains documented in docs/CRYPTOGRAPHIC-SHREDDER-DESIGN.md.

## Current verification rule

PLAN → BUILD → STATIC CHECK → AUTOMATED TEST → RUN → INTERACT → OBSERVE → DEBUG → FIX → RETEST → VERIFY → COMMIT.

A compile, visual screen, or provider-boundary response alone is not evidence that the corresponding production feature works.
