# ZERO Independent Cryptographic & Security Audit

## Purpose
Define the independent-review contract for ZERO's cryptographic architecture and security-critical implementation without claiming that an audit has already occurred.

## Required scope
- Cryptographic design and protocol composition
- PQXDH/Double Ratchet multi-device boundary and session lifecycle
- MLS group-security boundary
- Key generation, storage, rotation, revocation and destruction
- Randomness, nonce uniqueness and key separation
- File encryption, chunk encryption and object-key lifecycle
- Backup/recovery and trusted-contact boundaries
- Constant-time and side-channel-sensitive implementation areas
- Cryptographic dependency/provider selection and configuration
- Serialization, validation and downgrade/confusion resistance
- Security-critical error handling and state transitions

## Independence and evidence
The review should be performed by an appropriately qualified independent cryptography/security provider. The provider must receive a fixed source revision, architecture/protocol documentation, dependency lockfiles, threat model and test evidence. Findings must reference reproducible evidence without exposing user plaintext, private keys or recovery secrets.

## Release gate
Unresolved CRITICAL findings block release. Resolved findings require independent retesting where applicable. A public statement about audit completion must correspond exactly to the retained report and evidence; source contracts are not evidence of an audit.

## Current limitation
This phase establishes the audit boundary and evidence lifecycle. It does not represent completion of an independent cryptographic or security audit.
