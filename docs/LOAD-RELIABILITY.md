# ZERO Load & Reliability

## Objective
Define measurable load, capacity, backpressure, retry, queue, database-pool, upload-throughput and recovery controls without weakening E2EE or exposing private content.

## Required workload classes
- API: authenticated request throughput and latency.
- MESSAGING: ciphertext envelope submission, delivery and receipt traffic.
- UPLOAD: encrypted chunk throughput, resumability and interrupted recovery.
- NOTIFICATION: opaque push fan-out and retry behavior.
- BACKGROUND: expiration, destruction, audit and asynchronous jobs.

## Reliability controls
- Bounded concurrency and queue depth.
- Explicit backpressure when queues reach configured limits.
- Idempotency for retried writes and chunk operations.
- Retry budgets with exponential backoff and jitter; maximum eight attempts unless a reviewed policy changes the limit.
- Retry-storm protection and circuit-breaking at dependency boundaries.
- Bounded database connection pools and admission control.
- Timeouts on network and dependency calls.
- Recovery after process restart, network interruption and partial upload failure.
- Capacity metrics must not contain message plaintext, file plaintext, private keys or recovery secrets.

## Test evidence
Each load run records workload, environment, commit reference, target request rate, concurrency, queue bound and measured p50/p95/p99 latency, errors, retries, timeouts and queue depth. A release decision requires recorded evidence; source-level models do not constitute measured performance.

## Failure gates
Unresolved CRITICAL reliability findings block release. Saturated queues must trigger backpressure rather than unbounded memory growth. Retry behavior must remain bounded and idempotent. Interrupted operations must converge to a safe terminal or resumable state.

## Production limitations
Phase 37 defines the contracts and evidence model. Real production capacity numbers require controlled staging/load infrastructure, representative clients, database/object-storage dependencies and repeated runtime tests. No performance claim should be inferred from these source contracts alone.
