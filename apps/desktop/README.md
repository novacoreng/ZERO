# ZERO Desktop: device-first identity

ZERO is becoming a native Windows desktop messenger with **no email, phone number, or signup screen**.

## Implemented
- Local offline chat shell (no fictitious conversations).
- First-run Ed25519 key pair created locally.
- Public ZERO PIN deterministically derived from the public key fingerprint.
- Private key encrypted through Electron safeStorage (Windows DPAPI) in the local application data directory.
- On later launches, the same identity is loaded and checked for integrity.
- If OS encryption is unavailable or identity data is invalid, activation fails closed.
- Renderer receives the public PIN and public key only. The private key is never exposed to web content.
- Each newly activated OS profile/install gets a different random identity. The installer itself is not uniquely signed per download.

## Development
Run `npm run desktop:dev` from the repository root. Build the Windows NSIS installer with `npm run dist:win` in apps/desktop or download a verified GitHub Actions artifact.

## Security and product boundaries
**Not yet a production messenger.** Registration, contact discovery by PIN, authentication challenge signing, cross-device message delivery, E2EE session establishment, expiring messages, key rotation, revocation and abuse controls require a real backend and external security verification.

Windows DPAPI generally binds encrypted key material to the Windows user profile, not to immutable physical hardware. It does **not** prove that identity cannot be migrated or copied by a sufficiently privileged actor. Hardware-bound non-exportable keys (TPM/Windows Hello/CNG), server-side device attestation where available, revocation, recovery policy and device-loss handling are required before claiming strict single-machine enforcement.

PINs are **public addresses, not secret passwords**. No server should authorize access using the PIN alone. The public key must be registered and a fresh cryptographic challenge signed with the private key. Identity should be created on activation, not embedded in downloadable installers. App code signing is separate from device identity.

Uninstall/reinstall behavior depends on whether the user profile data is preserved. If local identity data is erased, the old PIN cannot be recovered without an explicitly designed secure recovery flow. Avoid silent identity resets.

## Device registration prototype
Run `pnpm --dir services/api dev:registry` with `ZERO_DEVICE_REGISTRY_FILE` pointing to a writable local JSON registry file, then launch the desktop app with `ZERO_REGISTRY_URL=http://127.0.0.1:8787`. Click **Register** after activation. This signs a short-lived server challenge with the local private key; the server stores only the public key and derived PIN. No email or password is involved.

This is a **local development protocol**, not an Internet-ready authentication service. The prototype uses process-local challenge and rate-limit state, a simple JSON registry, no TLS termination, no device session tokens, no authenticated messaging, no device attestation, and no distributed coordination. Public Internet deployment is prohibited until a production database, durable atomic transactions, rate limiting, audit logging, replay-resistant sessions, key revocation, transport security, and independent security testing are implemented. The PIN alone must never authorize messaging.

## Experimental encryption primitives (not connected to chat)
`secure-envelope.cjs` contains a separately testable X25519 ephemeral-static key exchange, HKDF-SHA256 and AES-256-GCM envelope with sender/recipient PINs bound as associated authenticated data. `npm test` runs tampering, wrong-key, and roundtrip checks. This prototype is **not wired to the messenger or relay**. The current relay only accepts `xchacha20poly1305-v1` envelope shapes; the new prototype intentionally uses a different explicit algorithm identifier and cannot be transmitted until the protocol is designed and versioned consistently.

Important: This is **not a complete secure messaging protocol**. It has no authenticated recipient encryption-key distribution, identity-key signatures, key rotation, forward secrecy against later compromise of a static recipient key, double ratchet, replay protection, or multi-device trust model. A device's existing Ed25519 signing identity cannot be silently reused as an X25519 key. The eventual encryption public key must be signed by the identity key and verified by the receiver, with a carefully specified registration and rotation policy. Do not enable the message composer or make E2EE claims until these requirements are implemented and independently reviewed.
