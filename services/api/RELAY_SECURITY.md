# ZERO message relay: development boundary

The API now supports authenticated `POST /v1/messages/send`, `GET /v1/messages/inbox`, and `POST /v1/messages/acknowledge`. Send expects `{recipient,encrypted:{algorithm:"xchacha20poly1305-v1",nonce,ciphertext}}`; acknowledge expects `{id}`. All three require a Bearer session from signed device authentication. The sender PIN comes from the session, not from user input. Recipient lookup uses registered public keys.

**Security warning:** The server merely validates envelope shape. It cannot verify that the payload is actually encrypted, that the named algorithm was used, or that a recipient can decrypt it. A malicious client can label arbitrary data as ciphertext. The message store is an in-memory queue; messages disappear when the server restarts. No encrypted message client, ratchet, key exchange, recipient key authentication, metadata minimization, transport deployment, or production database is implemented. This is not yet end-to-end encrypted messaging.

The relay uses no plaintext field, imposes a per-recipient queue limit and payload size limit, and only allows the authenticated recipient to list or acknowledge its queue. In-memory sessions and registry challenge state also reset on restart. Do not deploy this prototype publicly. Before production, implement authenticated key agreement, audited client encryption, replay protections, durable encrypted queues, concurrency-safe delivery and acknowledgement, retention and expiration rules, transport TLS, abuse controls, and security review.

## Temporary-message relay behavior
`POST /v1/messages/send` optionally accepts `ttlSeconds` between 10 and 604800 (7 days); omitted TTL defaults to 86400 seconds (24 hours). Inbox reads and new sends purge expired messages for that recipient. This is a **best-effort, in-memory expiry** only. It does not remotely erase already delivered or copied content, nor guarantee secure erasure from device storage, memory, logs, or backups. The relay currently does not persist queued messages across restarts.

The API enforces a 96 KiB request-body limit for encrypted envelopes; oversized requests receive HTTP 413. Message envelope size and queue count are also bounded. No user-controlled plaintext field is accepted by the relay.
