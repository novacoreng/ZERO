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
