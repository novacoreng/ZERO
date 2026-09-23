# ZERO Cryptographic Shredder Design

**Status:** DESIGN LOCK — implementation gated by security review  
**Date:** 2026-09-23

## Goal

ZERO may provide an additional destruction layer for expired messages in which already-destroyed ciphertext fragments are mixed with fragments from other destroyed messages before storage reclamation.

The feature must never weaken E2EE or make an individual live message dependent on another live message.

## Required destruction order

1. Mark the message as `DESTROYING`.
2. Destroy/revoke the message's independent data-encryption key (DEK) according to the existing Phase 9 destruction contract.
3. Remove the message-to-storage mapping needed for normal retrieval.
4. Treat remaining ciphertext as cryptographically unintelligible.
5. Optionally repack destroyed ciphertext fragments into randomized fixed-size destruction pools with fragments from other already-destroyed messages.
6. Destroy the destruction-pool key/manifest and remove the final storage references.
7. Expire applicable backup/replica retention according to the retention contract.

## Important security rule

**Never use one shared encryption key for multiple live messages.**

Each message keeps an independent cryptographic key. Mixing is a storage-compaction/forensic-resistance layer, not the cryptographic deletion mechanism.

## Why mixing is useful

Mixing destroyed ciphertext can make storage-level reconstruction and message-to-object correlation harder after logical deletion. It is defense in depth.

It does **not** replace cryptographic deletion. A deleted ciphertext blob is already unreadable when its independent key has been destroyed.

## What must not be mixed

- Active messages
- Messages that have not reached authoritative expiration
- Live attachment objects
- Recovery material
- Device private keys
- Any object whose independent key must remain available for an active recipient

## State model

`ACTIVE -> EXPIRING -> DESTROYING -> DESTROYED`

Only `DESTROYED` objects may enter a destruction pool.

## Evidence

The destruction service may retain only non-content evidence such as:

- destruction event identifier
- object/key version
- terminal state
- timestamp
- non-reversible evidence digest

It must not retain plaintext, message ciphertext-to-user mappings, private keys, recovery secrets, or a reversible pool manifest.

## Product language

The UI may describe this as **Secure Shred** or **Cryptographic Shred**.

Do not promise that every physical storage sector or every backup replica is instantly overwritten. The product guarantee is cryptographic deletion plus the configured storage/backup retention policy.

## Verification gates

Before production use:

- independent cryptographic review
- concurrency/race testing
- interrupted-destruction recovery testing
- backup/replica retention verification
- storage-provider deletion verification
- forensic validation where applicable
- audit evidence that no live key or reversible mapping survives destruction

This design extends the existing Phase 9 cryptographic-destruction model; it does not reopen or weaken the Phase 9 lock.
