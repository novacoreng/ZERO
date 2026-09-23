# ZERO Agent Handoff

## Current task
Phase 17 — Groups.

## Status
LOCKED.

## Completed
- MLS RFC 9420 protocol boundary
- Group lifecycle
- Device-scoped membership
- Owner/admin/member roles
- Membership state
- Epoch state
- Membership-change epoch advancement
- Removed-member key exclusion boundary
- Migration 016
- Contract tests and documentation

## Do not redo
- Never implement custom group cryptography.
- Never store group secrets on the server.
- Never send new epoch key material to removed members.
- Never treat account IDs as cryptographic device identities.
- Never claim MLS runtime integration before a reviewed provider is selected.

## Next action
Begin Phase 18 — Temporary Conversations.
