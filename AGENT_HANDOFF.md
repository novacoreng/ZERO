# ZERO Agent Handoff

## Current task
Phase 43 — Production Launch / release-candidate hardening.

## Status
LOCKED — production-launch evidence contract remains active. The updated Full Stack Production App Builder UI-quality gate is now part of the release-candidate evidence process.

## Completed
- Final production launch evidence contract
- Immutable release/artifact identity requirements
- Independent security evidence gate
- Production cloud/runtime evidence gate
- Browser/device and load evidence gate
- Disaster recovery and backup/rollback gate
- Privacy/legal/accessibility gate
- Operations, incident response and monitoring gate
- Migration 041
- Contract tests and documentation
- ZERO brand identity locked in `brand/`
- Cryptographic shredder design locked in `docs/CRYPTOGRAPHIC-SHREDDER-DESIGN.md`
- Updated Full Stack Production App Builder UI quality/accessibility audit added at `docs/UI-QUALITY-AUDIT.md`

## New quality workflow
Apply the current builder workflow as:

`Audit → Build → Test → Verify → Fix → Re-test → UI Quality Gate → Security Gate → Lock`

For every user-facing flow, verify actual behavior rather than visual presence. Every button must have a tested action/state on supported platforms. Responsive evidence must cover compact phones, standard/large phones, tablets, desktop/resizable layouts, orientation, keyboard/insets/safe areas, and applicable foldable/split-screen states.

## Do not redo
- Do not claim ZERO is production-ready because the launch contract or UI audit exists.
- Do not bypass missing evidence.
- Do not claim the independent cryptographic audit or external penetration test has occurred without retained reports.
- Do not deploy production until every launch gate is independently verified.
- Do not expose plaintext messages, files, calls, private keys or recovery secrets for launch verification.
- Do not treat mocked/provider-boundary authentication as real authentication.

## Post-roadmap action
Collect UI/device evidence, execute real security assessments, remediate findings, run release-candidate validation, verify provider integrations and production runtime behavior, and only then make a production deployment decision.
## Mandatory Full Stack Production App Builder execution contract

Applies to every ZERO feature, bug fix, refactor, deployment and release. Read PROJECT_STATE.md, docs/ZERO-FRONTEND-REDESIGN.md, docs/UI-QUALITY-AUDIT.md and docs/BRAND-LOCK.md before making user-facing changes.

1. AUDIT: inventory affected web/mobile/desktop/API packages, source-of-truth specifications, data flows, credentials, dependencies, existing tests and security boundaries. Record known failures.
2. BUILD: make minimal cohesive changes across shared contracts, API, UI, tests, accessibility and documentation. Do not replace canonical brand assets or invent product behavior.
3. TEST: run root typecheck and tests, web typecheck/build, Expo typecheck/Android export, security scan and Windows installer workflow where affected. Do not skip failing gates.
4. VERIFY: test actual user interactions, empty/loading/error/offline states, desktop/tablet/phone layouts, keyboard and screen reader, message lifecycle, and provider integrations where available. Build success alone is insufficient.
5. FIX AND RE-TEST: trace failures to root cause; never weaken validation, remove a test, or hide an error to obtain a green pipeline. Repeat the failed gate and dependent checks.
6. UI QUALITY GATE: compare against the locked ZERO identity and NOVA UI/UX direction. Confirm responsive navigation, touch target size, readable contrast, reduced motion, proper focus and working controls.
7. SECURITY GATE: prove server cannot read plaintext, secrets are not bundled or logged, sessions/devices are validated, input/output are validated, expirations and cryptographic key lifecycle are implemented, and independent audit evidence exists before security claims.
8. LOCK: only mark a phase complete after the relevant CI jobs and real device/runtime evidence are linked in the handoff. Commit with precise scope and update PROJECT_STATE.md.

### Platform gates
- Web: Vercel Next.js production build, browser runtime smoke test and deployed URL verification.
- Expo: Expo Go compatibility, Android bundle, real Android/iOS device behavior and permission checks. Native-only features require development builds and must not be labelled Expo Go-compatible without evidence.
- Windows: GitHub Actions Windows NSIS artifact, installation, startup, window/navigation security, code-signing posture and update path. A wrapper loading the web URL is not an independently functioning offline messenger.
- Backend: real OTP/passkey providers, authenticated API, persistence, encrypted messaging transport, files, notifications, calls and cross-device sync must each have integration evidence.
- No simulated conversation, unread count, online status, delivery receipt, or message-expiry label may be mistaken for real account data.

### Current known blockers
- UI messaging clients still use local demo conversation data.
- Realtime encrypted transport and authentication provider connections are not verified.
- Vercel authorization and actual deployment runtime verification remain unresolved.
- Windows installer build and installation verification require retained CI and device evidence.
- Independent security assessment, cryptographic audit and production operations evidence remain outstanding.

Never equate architectural readiness with production readiness.
