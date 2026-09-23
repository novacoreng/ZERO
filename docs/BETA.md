# ZERO Phase 40 — Controlled Beta

## Purpose

Phase 40 establishes the controlled-beta release boundary. It is a real beta lifecycle contract, not a production-readiness claim.

## Beta model

ZERO beta is **invite-only** and **controlled**.

- Public self-service signup for beta access is disabled.
- Access requires a server-issued invitation.
- Participant state is persisted server-side.
- Participants can withdraw.
- Access can be suspended or revoked.
- Feedback is categorized and persisted without requiring message content.
- Security reports have a dedicated least-privilege path.
- Crash/operational telemetry must not contain message, file, call, contact-graph, or precise-location content.

## Safety gates

A controlled-beta enrollment gate requires:

- zero known unresolved CRITICAL findings
- emergency rollback readiness
- emergency kill-switch readiness
- verified backup/recovery procedure
- published privacy notice
- support path
- security-reporting path
- content-free telemetry

A missing gate blocks beta enrollment.

## Kill switch and rollback

Beta infrastructure must support disabling beta access and rolling back the affected release without requiring access to plaintext E2EE content.

The kill switch is an operational control; it does not decrypt or inspect user messages.

## Feedback

Feedback must not require users to paste private conversations, files, keys, recovery secrets, or call content. The product should warn against including sensitive material.

Security reports must be handled separately from ordinary product feedback and under least privilege.

## Privacy boundary

Beta telemetry may measure operational reliability and aggregate product behavior already allowed by the privacy-analytics contract. It must not become a hidden content-inspection system.

No beta-specific advertising profile or conversation-content analytics is permitted.

## What Phase 40 does not claim

Phase 40 does not claim:

- public launch
- production readiness
- completed independent cryptographic audit
- completed external penetration test
- measured production capacity
- universal browser/device certification

Those remain governed by the later roadmap and evidence gates.

## Exit criteria

Before moving beyond controlled beta:

1. Beta enrollment and withdrawal flows are tested.
2. Kill switch and rollback are exercised.
3. Backup/recovery is exercised.
4. Security reporting is operational.
5. Critical findings remain at zero for the release candidate.
6. Privacy and accessibility regressions are reviewed.
7. Browser/device test evidence is retained.
8. External security and cryptographic assessments are tracked with evidence.
