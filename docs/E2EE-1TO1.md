# ZERO 1-to-1 E2EE Architecture

## Phase 6 boundary
ZERO 1-to-1 messaging uses a reviewed protocol family rather than custom cryptography. The current architecture selects PQXDH for asynchronous session establishment, Double Ratchet for per-message key evolution, and a Sesame-style session manager for multi-device session coordination. Signal's published specifications define these roles and describe the need to handle offline recipients, multiple devices, device addition/removal, lost messages, and out-of-order delivery. citeturn0search1turn0search0turn0search2

## Server trust boundary
The server is a ciphertext relay and prekey directory. It may store public identity/prekey material and opaque ciphertext envelopes plus minimum routing metadata. It must never store or process plaintext message content or device private keys.

## Prekey lifecycle
A device publishes its public identity key, signed prekey material, optional post-quantum signed prekey material, and a pool of one-time prekeys. One-time prekeys are consumed atomically. PQXDH's published protocol describes a prekey bundle containing identity, signed prekey, signatures, and one-time prekeys for asynchronous initiation. citeturn0search1

## Session establishment
1. Initiator authenticates to ZERO.
2. Initiator resolves the recipient's trusted devices.
3. Initiator fetches a recipient-device prekey bundle.
4. Initiator validates signatures and identity binding locally.
5. Initiator runs the approved production PQXDH implementation locally.
6. Initiator initializes the approved Double Ratchet implementation locally.
7. Initiator creates an encrypted initial message.
8. Server stores/routes only the opaque envelope.

The actual cryptographic implementation is deliberately deferred until the approved production crypto-provider/library is selected and independently reviewed.

## Message envelope
The server-facing envelope contains versioned protocol metadata, session identifier, sender device identifier, sequence/routing metadata, encrypted header material, ciphertext, and an associated-data digest. Plaintext is never part of the envelope contract.

## Identity changes
A remote identity-key change is a security event. The client must mark the session for re-verification rather than silently replacing the trusted identity. This prevents an unnoticed key change from being treated as ordinary session rotation.

## Forward secrecy and recovery
Double Ratchet derives new message keys as communication progresses and supports protection for earlier/later messages under compromise assumptions documented by the protocol. citeturn0search0 ZERO will not invent a custom recovery mechanism that weakens these properties.

## Multi-device
Each local device maintains distinct sessions with recipient devices. Device addition/removal requires session reconciliation. The server must not infer plaintext conversation content from this process.

## Explicit non-goals
- No custom ratchet implementation in this phase.
- No server-side plaintext search.
- No server-side message decryption.
- No private-key upload or server backup of device private keys.
