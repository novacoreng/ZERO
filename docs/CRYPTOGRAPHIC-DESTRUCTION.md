# ZERO Cryptographic Destruction — Phase 9

## Purpose
Expiration establishes when a message becomes eligible for destruction. Phase 9 defines the cryptographic destruction boundary: secret material is invalidated and opaque server-side material is retired without exposing plaintext.

## Rules
- Secret key material is never uploaded to the server.
- Server-side destruction records contain lifecycle metadata only.
- Client key stores must invalidate the relevant key version before treating local content as destroyed.
- Destroyed records are terminal and cannot be resurrected.
- Destruction is idempotent so retries after crashes do not create a second logical destruction.
- A destruction nonce identifies the lifecycle operation without revealing secret material.
- Evidence is a digest/metadata record, never a copy of the destroyed key.

## Message keys
A message's cryptographic key version is invalidated after expiration policy authorizes destruction. Existing ciphertext must not be treated as recoverable merely because the ciphertext object remains temporarily available.

## File object keys
Encrypted file objects use independent object keys. Destruction of an object key makes the encrypted object unrecoverable through ZERO's intended key path; storage deletion is a separate cleanup concern.

## Local cache
Local encrypted caches must invalidate the corresponding key/material reference. Platform secure storage deletion and memory zeroization are implementation responsibilities of the client platform layer.

## Server boundary
The server may delete or retire opaque ciphertext/object records and maintain destruction metadata. It must not decrypt content to perform destruction.

## Verification
Production implementation requires platform-specific secure-storage behavior, approved cryptographic providers, crash-safe key-state persistence, and independent cryptographic/security review.
