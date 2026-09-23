# ZERO Temporary Conversations — Phase 18

Temporary Conversations are private conversations with an authoritative server expiry and coordinated cryptographic destruction.

## Lifetime
Supported presets are 10 minutes, 1 hour, 6 hours, 24 hours, 3 days and 7 days, with a bounded custom TTL. The server is the expiration clock authority.

## Security
Temporary status does not weaken E2EE. Conversation content remains ciphertext-only to the server. Expiration transitions coordinate with Phase 9 key destruction so local message/session keys are invalidated.

## Membership
Membership is device-scoped. Removed or revoked devices cannot send new messages or receive new conversation key material.

## Offline behavior
A device may be offline at expiry. On reconnection it reconciles the authoritative conversation state before accepting new messages. Local display timers are not deletion proof.

## Revocation
Revocation blocks new messages and new conversation access. Existing encrypted local material follows the key-destruction lifecycle.

## Recovery
Account recovery does not silently restore expired conversation keys. A new conversation/session must be established when policy requires it.

## Limitations
Production expiration workers, E2EE runtime integration and independent security review remain required.
