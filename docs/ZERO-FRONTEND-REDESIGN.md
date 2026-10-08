# ZERO Frontend Redesign | NOVA UI/UX Skill

Status: design system refinement committed; complete end-to-end frontend redesign not yet verified.

## Source of truth
- Keep the canonical ZERO logo and lockup in `brand/logo`.
- Preserve PIN. PRIVATE. TEMPORARY. GONE.
- ZERO is not Telegram: familiar messenger usability must not imply Telegram branding, protocols or feature equivalence.
- No fabricated messages, online status, unread counts or fake encryption claims in production. Existing seeded conversation UI is explicitly test-only.

## Unified design language
- Lagoon accent #79E5D8, near-black #090C10, panels #12171D / #171D24.
- Accessible keyboard focus, responsive navigation, reduced motion, contrast testing, 44px touch targets.
- Premium restrained glass; avoid heavy GPU shaders in long chat lists or low-bandwidth mode.
- Preserve ZERO icon; no replacement brand glyph.

## Required screen inventory
1. Welcome / create account / sign in / email or phone OTP / passkey
2. PIN identity and privacy-preserving discovery
3. Conversation list, search, filters, empty/error/loading/offline states
4. One-to-one encrypted conversation, reply, edit, delete, expire, send/retry states
5. New conversation and contact requests
6. Group conversations, membership, admin permissions
7. File browser, media, uploads, download, resume and failures
8. Data Drops create, share, access, revoke and expire
9. Audio/video call permission, ringing, reconnect and failure states
10. Device trust, pairing, revocation and identity changes
11. Security Center, privacy controls, ZERO Lock, destruction status
12. Account, settings, notification, accessibility, localization, help
13. Windows-specific window, keyboard shortcuts and safe external link handling

## Cross-platform implementation
- Web: Next.js, responsive desktop/tablet/mobile, Vercel, PWA.
- Mobile: Expo Router / React Native, Expo Go-compatible paths; native-only functionality gated for development builds.
- Windows: Electron test shell consuming the web client; production signing and native secure storage are independent gates.
- Shared product contracts, design tokens and state definitions; no divergent security claims across clients.

## Critical integration gates
Authentication, message transport, key management, delivery receipts, media, calls and expiration must be verified against the real API and cryptographic libraries before marked operational. Demo content must be clearly labelled. Do not advertise E2EE or cryptographic destruction as active merely because a UI control exists.

## Acceptance gates
BUILD -> TEST -> VERIFY -> FIX -> LOCK. Run web typecheck/build, Expo typecheck/bundle/device test, Windows installer job, keyboard/screen-reader checks, cross-device visual QA and live Vercel checks. Record failing checks and do not claim completion before they pass.
