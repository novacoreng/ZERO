# ZERO message relay: development boundary

The API now supports authenticated `POST /v1/messages/send`, `GET /v1/messages/inbox`, and `POST /v1/messages/acknowledge`. Send expects `{recipient,encrypted:{algorithm:"x25519-hkdf-aes256gcm-v1",ephemeralPublicKey,salt,nonce,ciphertext}}`; acknowledge expects `{id}`. All three require a Bearer session from signed device authentication. The sender PIN comes from the session, not from user input. Recipient lookup uses registered public keys.

**Security warning:** The server merely validates envelope shape. It cannot verify that the payload is actually encrypted, that the named algorithm was used, or that a recipient can decrypt it. A malicious client can label arbitrary data as ciphertext. The message store is an in-memory queue; messages disappear when the server restarts. No encrypted message client, ratchet, key exchange, recipient key authentication, metadata minimization, transport deployment, or production database is implemented. This is not yet end-to-end encrypted messaging.

The relay uses no plaintext field, imposes a per-recipient queue limit and payload size limit, and only allows the authenticated recipient to list or acknowledge its queue. In-memory sessions and registry challenge state also reset on restart. Do not deploy this prototype publicly. Before production, implement authenticated key agreement, audited client encryption, replay protections, durable encrypted queues, concurrency-safe delivery and acknowledgement, retention and expiration rules, transport TLS, abuse controls, and security review.

## Temporary-message relay behavior
`POST /v1/messages/send` optionally accepts `ttlSeconds` between 10 and 604800 (7 days); omitted TTL defaults to 86400 seconds (24 hours). Inbox reads and new sends purge expired messages for that recipient. This is a **best-effort, in-memory expiry** only. It does not remotely erase already delivered or copied content, nor guarantee secure erasure from device storage, memory, logs, or backups. The relay currently does not persist queued messages across restarts.

The API enforces a 96 KiB request-body limit for encrypted envelopes; oversized requests receive HTTP 413. Message envelope size and queue count are also bounded. No user-controlled plaintext field is accepted by the relay.

## Protocol alignment
The relay now accepts the same **envelope structure** as the isolated desktop X25519/HKDF/AES-GCM prototype. This is a format alignment only: the server cannot establish that ciphertext was correctly encrypted. Authenticated encryption-key registration, contact verification of that key, client send/receive integration, replay prevention, and a ratcheting protocol remain pending.

## Signed encryption-key directory (development)
`POST /v1/encryption-keys/publish` requires an authenticated bearer session and JSON `{publicKey,signature}`. The public key is canonical PEM-encoded X25519 SPKI. The signature is Ed25519 over the exact UTF-8 bytes `ZERO-ENCRYPTION-KEY-V1|<PIN>|<publicKey PEM>`, using the device identity that originally registered the PIN. The server derives the publishing PIN from the authenticated session, not from a client-provided PIN. `GET /v1/encryption-keys/<PIN>` returns the signed record. Existing encryption keys cannot be silently replaced; key rotation/recovery requires a separately designed protocol.

A client MUST verify the returned identity key fingerprints to the expected PIN, the X25519 public key type, and the Ed25519 signature locally. Merely retrieving a key from the directory is insufficient to claim authenticated E2EE. The registry currently has development-only persistence and no transparency or multi-device key-change protocol.

## Signed ciphertext requirement
Every relayed encrypted envelope must include `signature`, a base64url Ed25519 signature over UTF-8 JSON encoding of the array `["ZERO-SIGNED-MESSAGE-V1",senderPIN,recipientPIN,algorithm,ephemeralPublicKey,salt,nonce,ciphertext]`. The relay validates signature shape only. **Recipients must independently fetch and verify the sender's identity key, then cryptographically verify the envelope signature before attempting decryption.** The server cannot authenticate ciphertext on the recipient's behalf. Replay prevention and key compromise recovery are not yet implemented. The composer remains disabled.

## Desktop receive and acknowledgement semantics
The desktop verifies signed envelopes and decrypts locally, then atomically persists decrypted messages in an OS-encrypted inbox before acknowledging relay delivery. On a subsequent inbox refresh, stored messages can be shown again after a restart. If acknowledgement fails, the client retries it when the same relay message ID is fetched again. Expired messages are removed from the local inbox on list operations.

**Limitations:** The local inbox stores decrypted plaintext encrypted at rest using Electron safeStorage, not a separately audited encrypted database. The relay queue is in memory and may lose undelivered messages on server restart. An attacker may replay the same signed ciphertext in a fresh relay envelope with a new UUID; there is no cryptographic anti-replay nonce tracking, ratchet, or forward secrecy against recipient static-key compromise. Local expiry is not a guarantee of secure erasure from backups or filesystem snapshots. No production security audit has been performed.
