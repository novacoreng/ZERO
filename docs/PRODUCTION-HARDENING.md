# ZERO Phase 41 — Production Hardening

## Purpose

Phase 41 establishes the evidence and runtime-hardening boundary required before a production promotion decision. It does not claim that ZERO has completed production launch.

## Release integrity

Every candidate release must be tied to:

- immutable source commit SHA
- SHA-256 artifact digest
- reviewed dependency lock state
- reviewed database migrations
- successful secret scan
- security regression evidence

Production deployments must use immutable release artifacts rather than mutable source-at-deploy behavior.

## Runtime hardening

Production configuration must enforce:

- TLS-only service transport
- managed secrets outside source and client bundles
- debug endpoints disabled
- verbose internal errors disabled
- least-privilege service identities
- rate limiting and abuse controls
- security headers
- audited administrative actions
- reauthentication for destructive security actions
- fail-closed security feature flags
- content-free operational logs

## Data and recovery

A promotion requires evidence for:

- verified backup restoration
- rollback execution
- migration safety/reversibility where applicable
- health and readiness checks
- observability without plaintext content

## Release gate

The release contract requires all evidence fields to be true and blocks unresolved CRITICAL or HIGH findings.

HIGH findings require explicit security exception handling rather than silent acceptance.

## Supply chain

Before production promotion, the team must verify:

- lockfile integrity
- dependency vulnerability status
- build provenance
- artifact digest
- CI source revision
- secret scanning
- approved third-party providers and versions

No production secret or user private key may be included in a build artifact.

## Privacy boundary

Production hardening must not introduce:

- message-content logging
- file-content inspection for analytics
- plaintext E2EE backups
- contact-graph analytics
- precise-location analytics
- ad targeting from private conversations

## Operational evidence

Retain release and deployment evidence sufficient to answer:

- exactly what commit was deployed?
- exactly what artifact was deployed?
- which migrations ran?
- who/what promoted or rolled back the release?
- which security gates passed?
- which exceptions were approved?

Deployment-event details should be represented by non-sensitive digests rather than sensitive payloads.

## Remaining work

Actual cloud configuration, runtime security validation, dependency/advisory review, device/browser testing, production-like load tests, external penetration testing, independent cryptographic review and operational disaster-recovery exercises still require real-world evidence.
