# ZERO Device Identity & Trust

## Scope
Phase 5 establishes the device-level security boundary required before E2EE sessions. Every iOS, Android, Web, and Desktop installation has its own cryptographic identity.

The server may store device identifiers, public identity material, fingerprints, lifecycle state, and operational timestamps. It must never receive or persist device private keys.

## Protocol boundary
ZERO will use reviewed protocol implementations rather than custom cryptography. The Phase 0 architecture selected the Signal Protocol family for 1-to-1 messaging: PQXDH for asynchronous session establishment and Double Ratchet for message-key evolution, with Sesame-style multi-device session management. Signal documents PQXDH as an asynchronous key-agreement protocol, Double Ratchet as deriving new keys per message, and Sesame as multi-device session management. The protocol primitives are not implemented in this phase. citeturn0search1turn0search0turn0search2

## Device trust
- PENDING: registered but not yet trusted.
- TRUSTED: approved for account use and session establishment.
- REVOKED: explicitly blocked; no new sessions.
- RETIRED: intentionally decommissioned.

A remote identity-key change must not be silently accepted. The user needs an explicit re-verification path before relying on the changed identity.

## Device pairing
QR pairing is a user-presence flow, not a secret-sharing shortcut. A short-lived challenge identifies the pairing transaction. Private keys remain on their originating devices. Pairing must use an authenticated, reviewed key-transfer/session-establishment mechanism selected during the production crypto-provider phase.

Pairing payloads must never contain account passwords, OTPs, session tokens, private keys, or plaintext message content.

## Revocation
Revocation is server-enforced for access control, but cannot retroactively erase secrets already present on a compromised device. Client removal must wipe/revoke local session state where platform APIs permit it.

## Multi-device implications
When a device is added or removed, the session manager must reconcile per-device sessions. Device changes can require re-authentication/re-verification and new session establishment. citeturn0search2

## Security boundaries
1. Account authentication proves control of the account/authenticator.
2. Device identity proves possession of a device private key.
3. ZERO PIN identifies the public account.
4. Messaging identity/session keys provide E2EE.
5. These layers must not be collapsed into one credential.
