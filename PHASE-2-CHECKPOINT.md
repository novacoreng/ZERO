# ZERO Phase 2 Checkpoint

Phase: Phase 2 — ZERO Security Core

Status: LOCKED

Workflow: Build → Test → Verify → Fix → Lock → Move to next phase.

Canonical repository: https://github.com/novacoreng/ZERO

Security invariants established:
- No server-side plaintext message persistence.
- No client private keys sent to the server.
- No custom cryptographic primitives.
- Unsupported security profiles fail closed.
- File cryptography remains separate from messaging protocol internals.
- Uploaded files are opaque data and are never executed by server application code.

Known limitations:
- Production cryptographic library/provider selection remains subject to independent review.
- Messaging and file encryption implementations are deferred to later phases.
- Independent security audit is not complete.

Next phase: Phase 3 — Account & Authentication.
