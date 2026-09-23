# ZERO Data Drop Security — Phase 14

## Authorization
Access authorization is separate from the encrypted file object. Authorization secrets are high-entropy and represented server-side only by a digest. The server never receives or stores an encryption key as an authorization secret.

## Replay protection
Authorization records have an explicit state, expiry, and use counter. One-time authorizations become terminal after consumption. Multi-use authorizations are bounded. Concurrent consumption must use a transaction/row lock or equivalent compare-and-swap so the configured limit cannot be exceeded.

## Recipient binding
A drop may bind an authorization to a recipient/device verifier. Binding material is a digest and must not reveal identity secrets in access logs.

## Rate limiting and abuse
Authorization attempts are rate-limited. Repeated failures may block the authorization. Drop creation, access, and download endpoints must have independent abuse controls.

## Object-storage boundary
Object storage receives opaque encrypted bytes only. Download authorization is evaluated before issuing a short-lived object access capability. Object-storage URLs/capabilities must not be written to application logs.

## Privacy
Access events record event type and drop/authorization identifiers only. IP/device/user-agent retention must be minimized and policy-controlled. No plaintext file content, encryption keys, link secrets, passcodes, or URL query secrets belong in logs.

## Revocation
Revocation must invalidate future authorization and object-access capabilities. Already-issued short-lived capabilities expire independently; the application must use short TTLs.

## Limitations
Runtime object-storage integration, production rate-limit infrastructure and independent security review remain future gates.
