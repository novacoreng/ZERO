# ZERO Large File / Resumable Upload — Phase 12

Encrypted bytes are uploaded in bounded chunks. The server stores chunk metadata and opaque ciphertext only.

## Lifecycle
CREATED -> UPLOADING -> PAUSED -> UPLOADING -> FINALIZING -> AVAILABLE. FAILED and ABORTED are terminal unless an explicit recovery policy reopens FAILED.

## Resume
The client asks for the authoritative set of accepted chunk indexes, then retransmits only missing chunks. A chunk is idempotent by upload ID + chunk index. The server must reject conflicting metadata for an already accepted index.

## Integrity
Each chunk has an integrity digest and AEAD nonce metadata. The client must never reuse an AEAD nonce with the same object key. Finalization verifies completeness, expected offsets/sizes and the file-level integrity contract before marking AVAILABLE.

## Concurrency
Clients may upload multiple chunks concurrently within a bounded limit. Finalization is serialized and must not race with chunk acceptance.

## Recovery
Network interruption, app termination and server restart must leave the session resumable. Retries use bounded backoff. A failed chunk is not treated as accepted until durable acknowledgement.

## Security
Plaintext never crosses the upload transport boundary. The upload service does not execute, decompress, preview, index or inspect decrypted content.

## Explicit non-goals
- No server-side decryption.
- No arbitrary server-side file execution.
- No claim of availability before finalization.
