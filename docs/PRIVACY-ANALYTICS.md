# ZERO Privacy-Preserving Analytics — Phase 29

Analytics exist for reliability, security, abuse prevention and optional product-usage measurement without inspecting private communications.

## Prohibited data
ZERO analytics do not collect message plaintext/content, file content, call content, contact graphs, precise location, advertising profiles or cross-context tracking.

## Aggregation
Analytics are aggregated. Individual raw event payloads are not retained by the analytics layer. A minimum aggregation threshold of 10 prevents small cohorts from becoming individual-level telemetry.

## Retention
Analytics aggregates have a 30-day retention policy by default. Security/abuse systems remain separately governed and may have their own evidence-retention rules.

## User choice
Product-usage analytics are optional and default to DISABLED. Required minimal telemetry is limited to reliability, security and abuse-prevention purposes.

## Advertising
ZERO does not use communication content or analytics profiles to build advertising audiences.

## Limitations
Production aggregation pipeline, privacy-budget enforcement, differential-privacy mechanisms where appropriate, deletion automation, metrics dashboards, legal/privacy review and independent security review remain required.
