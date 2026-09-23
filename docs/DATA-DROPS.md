# ZERO Data Drops — Phase 13

Data Drops are temporary sharing containers for encrypted file objects. A drop is not a replacement for an E2EE conversation.

## Access modes
- PIN_REQUIRED: recipient must prove possession of the required ZERO PIN context.
- ONE_TIME_LINK: a high-entropy secret link authorizes a single access path; the server stores only a verifier/digest, never the link secret.
- PASSCODE_REQUIRED: recipient supplies a separate secret that is verified without storing plaintext.
- AUTHENTICATED: recipient must authenticate to ZERO before access.

The actual file encryption key is never embedded in a server-side link record.

## Expiration and revocation
Drops have authoritative expiration timestamps. Owners can revoke an active drop. Expired and revoked drops reject new authorization and download attempts. Destruction of associated encryption keys follows Phase 9 lifecycle rules.

## Downloads
Download policy may be unlimited, one-download, or a positive maximum count. Incrementing a count and authorizing the download must be atomic so concurrent requests cannot bypass the configured limit.

## Privacy
Access records contain minimal authorization digests and counters. They must not contain plaintext file content, file previews, link secrets or encryption keys. Operational logs must avoid URLs containing secrets.

## Abuse controls
Creation and access endpoints require authentication or a bounded anonymous policy, rate limiting, abuse detection, and revocation support. A Data Drop is not an anonymous bypass around ZERO's security controls.

## Later work
Phase 14 adds stronger Data Drop security controls. Phase 15 handles secure media/metadata processing.
