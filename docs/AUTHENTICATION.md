# ZERO Authentication Architecture

Supported authenticators:
- email OTP
- phone OTP
- passkeys/WebAuthn

OTP rules:
- short-lived
- single-use
- bounded attempts
- rate-limited
- plaintext OTP values are never persisted
- recovery responses must resist account enumeration

Sessions:
- unpredictable server-side identifiers
- revocable
- sensitive account changes require reauthentication
- recovery does not silently become E2EE key recovery

Authentication establishes account access only. It does not grant the server access to E2EE plaintext or client private messaging keys.
