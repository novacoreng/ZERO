# ZERO Secure Messaging Engine

## Scope
Phase 7 defines the transport and persistence lifecycle around the established E2EE session layer. The server is a ciphertext relay, not a message reader.

## Send lifecycle
1. Client creates plaintext locally.
2. Client applies the approved E2EE session/ratchet implementation.
3. Client produces an opaque message envelope.
4. Client submits the envelope with authenticated session context.
5. Server validates routing/session/state constraints without decrypting content.
6. Server stores/queues ciphertext using an idempotent message ID.
7. Recipient device receives ciphertext.
8. Recipient validates the session and decrypts locally.
9. Delivery state is acknowledged without exposing plaintext.

## Delivery states
`QUEUED -> SENT -> DELIVERED` is the normal path. `FAILED` permits retry with bounded backoff. `EXPIRED` and `DESTROYED` are terminal states controlled by later expiration/destruction phases.

## Idempotency
Message IDs are client-generated opaque identifiers. Retries must not create duplicate logical messages. The database sender/conversation/sequence constraint provides a second line of protection.

## Ordering
The client sequence is scoped to sender device and conversation. The server must not infer conversational meaning from gaps. Clients reconcile missing/out-of-order envelopes through the E2EE session layer and application state.

## Receipts
Delivery receipts contain only opaque message/device identifiers, state, and timestamps. Read receipts are a separate privacy-controlled feature and must not be assumed by the transport layer.

## Local plaintext
Plaintext exists only where the client is actively displaying/processing it or in protected local storage according to the later local-privacy phase. Server logs, metrics, queues, traces, and errors must not contain message plaintext.

## Failure recovery
Transient failures use bounded exponential backoff. Permanent authorization/session failures stop automatic retries and require session reconciliation. Interrupted uploads/downloads are not treated as message success.

## Abuse and limits
Transport rate limits, recipient limits, queue limits, and abuse controls are enforced without inspecting plaintext. Limits are keyed to authenticated account/device/session and infrastructure signals.

## Explicit non-goals
- No server-side plaintext search.
- No server-side message decryption.
- No content-based server analytics.
- No duplicate creation during retry.
