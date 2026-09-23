# ZERO Group Security — Phase 17

## Protocol
ZERO groups use MLS (RFC 9420) as the cryptographic group protocol boundary. ZERO must use a reviewed MLS implementation rather than implementing group cryptography itself.

## Server boundary
The server stores routing/membership metadata and opaque ciphertext/group messages required by the protocol. It does not store group plaintext, group secrets or client private keys and does not decrypt group messages.

## Membership and epochs
Membership changes advance the group epoch. New epoch key material is distributed by the MLS protocol to eligible current members. Removed/suspended members must not receive new epoch secrets.

## Devices
Membership is device-scoped so multi-device accounts can be represented without treating an account identifier as a cryptographic device identity.

## Roles
Owner/admin/member roles are authorization metadata only. Cryptographic authorization remains enforced by the MLS group state and authenticated client operations.

## Invitations
Invitations require bounded lifetime, authenticated issuance and replay protection. Invitation secrets must not be stored in plaintext.

## Group lifecycle
Groups support creation, active, paused, expired and destroyed states. Expiration and destruction must coordinate with message/file key destruction rules.

## Limitations
Production MLS library/provider selection, group message runtime, fan-out/delivery, invitation runtime, and independent cryptographic review remain required.
