# ZERO PIN Identity

## Purpose
The ZERO PIN is the public discovery identifier. It is not a credential, password, or E2EE identity.

## Format
- 8 Base32-style characters split as XXXX-XXXX.
- Alphabet excludes ambiguous I, L, O, and U.
- Entropy target: 40 bits.
- Example: K7X9-42QM.

## Privacy-preserving lookup
The service must not expose a plaintext PIN lookup index. The lookup index stores an HMAC-SHA-256 digest derived from the normalized PIN and a server-held lookup secret.

Resolution is rate-limited and designed to resist enumeration. Lookup should use uniform responses for valid, missing, blocked, and rate-limited candidates where practical.

The lookup secret belongs in managed secret storage and must never be committed or returned to clients.

## Identity separation
Account ID, ZERO PIN, device identity, and messaging identity are separate concepts. Changing a PIN must not rotate or recreate E2EE device keys.

## Lifecycle
ACTIVE is the current public PIN. REPLACED is historical and no longer resolves. BLOCKED is explicitly disabled by security or abuse controls.

PIN regeneration requires authenticated user action, reauthentication, cooldown/rate limits, collision retry, and atomic replacement.

## Collision handling
Generation uses a cryptographically secure random source. The database unique constraint is authoritative. On collision, generate another candidate; never map two accounts to one PIN.

## QR security boundary
A QR may encode the ZERO PIN or a versioned deep link containing it. It must not encode credentials, session tokens, private keys, or plaintext E2EE key material.

## Resolution output
PIN resolution must not return email, phone number, address, private keys, session tokens, or message plaintext by default.
