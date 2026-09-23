# ADR-004: Phase 1 Boundaries

Separate clients, API, worker, shared contracts, and security core into explicit workspace packages.

This prevents infrastructure convenience from becoming an excuse to centralize plaintext or cryptographic secrets.

Cross-package work remains deferred until the relevant security phase is locked.
