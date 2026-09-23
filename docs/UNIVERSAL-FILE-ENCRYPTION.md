# ZERO Universal File Encryption — Phase 11

Every uploaded file is encrypted on the client before transport. The server stores only encrypted file material and non-secret encryption metadata.

The versioned zero.file.v1 boundary uses an AEAD design with a 256-bit per-object key, 96-bit nonce and authenticated associated data. Production provider selection and implementation must use an approved, audited cryptographic library; this phase does not introduce custom cryptography.

Each file object has an independent key identity. The actual key remains in client-controlled secure key storage. Key identifiers and non-secret metadata may be stored server-side. Phase 9 governs eventual key destruction.

The encrypted object is bound to its object ID, key ID, profile and protocol version through associated data. Integrity failures must fail closed.

Phase 11 defines the encryption boundary only. Phase 12 will define encrypted chunking and resumable upload execution. Chunk encryption must preserve authenticated ordering and must never reuse an AEAD nonce with the same key.

No server endpoint may require plaintext file content or the per-object secret key to process an upload.
