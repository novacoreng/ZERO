# ZERO Message Expiration — Phase 8

## Model
Expiration is an explicit state machine: ACTIVE → EXPIRING → DESTROYING → DESTROYED. The terminal state is durable and idempotent.

## Clock and authority
The service records an authoritative expiry timestamp. Clients may display a local countdown, but a device clock must not be treated as proof that server-side expiration has occurred.

## Policies
Supported presets are 10 seconds, 1 minute, 10 minutes, 1 hour, 6 hours, 24 hours, 3 days and 7 days. Custom positive integer seconds are supported by the contract.

## Offline devices
An offline recipient may retain ciphertext locally until it reconciles with the service. The client must not represent an expired-for-everyone message as available after authoritative destruction has been confirmed. Local caches must reconcile terminal state before exposing stale content.

## Scopes
FOR_ME is local deletion semantics and does not claim remote destruction. FOR_EVERYONE is shared expiration semantics and requires all participating clients to honor the terminal state.

## Race safety
Expiration workers must claim due records transactionally, use conditional state transitions, and make destruction idempotent. Retries after worker interruption must resume from the durable state rather than recreate messages.

## Privacy
No plaintext is required to determine expiration. Logs and metrics must contain identifiers/state/timing only and never message content.

## Later cryptographic destruction
Phase 8 defines lifecycle state. Cryptographic key destruction and attachment-object destruction are implemented and verified in Phase 9.
