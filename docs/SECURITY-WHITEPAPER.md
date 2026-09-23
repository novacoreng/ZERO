# ZERO Security Whitepaper

**Version:** 1.0  
**Status:** Public security architecture document

## Security model

ZERO is designed around end-to-end encryption. Servers are not trusted with message plaintext, file plaintext, device private keys, or recovery secrets.

The protocol architecture uses established cryptographic protocol families rather than custom cryptography:

- 1-to-1 messaging: Signal Protocol family boundaries
- Multi-device sessions: Sesame-style architecture
- Groups: MLS / RFC 9420 boundary
- Files: separate per-object authenticated encryption
- Disappearing data: authoritative expiration plus cryptographic destruction

## Identity and devices

ZERO identities use public PIN identifiers. Device identities are separate from account identity. Private keys remain on user devices.

Device pairing, revocation, recovery, and identity changes are security events.

## Data lifecycle

Messages and temporary objects have explicit lifecycle states. Expiration triggers destruction workflows. Cryptographic shredding may mix already-destroyed ciphertext fragments as an additional storage defense; it does not replace independent key destruction.

## Privacy

ZERO's operational analytics contract excludes message content, file content, call content, precise location, contact-graph analytics, and advertising profiles derived from private conversations.

## Infrastructure

Production hardening requires TLS, managed secrets, least privilege, network segmentation, rate limiting, DDoS controls, encryption at rest, security headers, dependency controls, immutable deployments, audit logging, backup recovery and rollback evidence.

## Security reporting

ZERO supports coordinated vulnerability disclosure. Reports should avoid including private conversations, files, keys, recovery secrets, passwords, tokens, or other user content unless explicitly required and securely requested through an approved security process.

Security advisories are tracked through a lifecycle from receipt and triage through remediation, retest, resolution and closure.

## Evidence discipline

Public security statements must match retained evidence. ZERO must not state that a penetration test, independent cryptographic audit, certification, or production control is complete unless corresponding evidence exists.

## Scope and limitations

This document describes the intended and implemented security architecture. It is not a guarantee that every implementation, dependency, deployment, device, or operational process is secure. Independent assessment and production evidence remain required where the project state says so.
