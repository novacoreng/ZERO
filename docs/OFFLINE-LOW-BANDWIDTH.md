# ZERO Offline & Nigerian Low-Bandwidth — Phase 21

ZERO treats intermittent connectivity as a normal operating condition.

## Offline outbox
Messages are encrypted before entering the local outbox. The queue stores ciphertext or ciphertext-derived metadata only. Private keys remain in device secure storage.

## Retry and recovery
Queued operations use bounded exponential backoff. Failed operations remain recoverable until policy limits are reached. Duplicate submission uses the message/upload idempotency boundaries already established.

## Low-bandwidth mode
The client should prefer small protocol payloads, defer bulk transfers, batch safe metadata operations, avoid unnecessary previews, and resume encrypted file chunks rather than restarting entire files.

## Nigerian network resilience
The architecture is designed for intermittent mobile connectivity, variable latency, packet loss, and expensive/limited data. Network class detection is a scheduling hint, not a security decision.

## Expiration
Offline state never overrides authoritative expiration. A client returning online must reconcile message/conversation/drop expiration state before sending or presenting stale content.

## Conflict handling
Server acknowledgements and authoritative state win over local optimistic state. The client must not duplicate messages when retries occur.

## Privacy
Offline telemetry must not include message plaintext, file contents, encryption keys or sensitive URLs.

## Limitations
Platform background-transfer APIs, local database implementation, network transport tuning and device testing remain required.
