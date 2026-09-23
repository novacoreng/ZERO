# ZERO Audit & Security Logging — Phase 33

The security audit trail is separate from ordinary operational logs.

## Domains
AUTH, DEVICE, RECOVERY, ADMIN, ABUSE and INFRASTRUCTURE events have explicit security semantics.

## Integrity
Audit records are immutable and tamper-evident. Events use a correlation identifier and monotonic sequence with previous/event digests.

## Privacy
Audit records must never contain message plaintext, private keys, authentication tokens or recovery secrets. Actor and target references are opaque/minimized.

## Retention
Every event carries a retention class so retention can be enforced by policy rather than accidental log persistence.

## Investigation
Correlation IDs allow related security events to be investigated without requiring message content.

## Alerting
CRITICAL events may trigger security alerting. Alert payloads must preserve the same sensitive-data exclusions.

## Limitations
Production append-only enforcement, cryptographic signing/key management, SIEM integration, alert delivery, retention automation and independent audit remain required.
