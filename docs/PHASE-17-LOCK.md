# Phase 17 Lock Record

Phase: Phase 17 — Groups
Status: LOCKED

## Build
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

## Verify
- Server plaintext storage is prohibited.
- Server does not store group secrets.
- Membership changes advance epochs.
- Removed members cannot receive current epoch keys.
- Group membership is device-scoped.
- MLS implementation remains an external audited dependency boundary.

## Limitations
- Production MLS implementation/provider is not yet integrated.
- Group runtime/fan-out/invitations remain future integration work.
- Independent cryptographic/security review remains required.

## Next
Phase 18 — Temporary Conversations.
