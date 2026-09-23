# ZERO Business — Phase 27

ZERO Business provides organization administration without weakening end-to-end encryption.

## Organization
A business organization has a verified identity state: PENDING, VERIFIED, SUSPENDED or REVOKED. Verification evidence must be minimized.

## Roles
- OWNER — organization ownership and administration.
- ADMIN — operational administration.
- SECURITY_ADMIN — security and session controls.
- MEMBER — normal business participation.
- AUDITOR — read-only security/audit access.

## Privacy boundary
Business administrators cannot decrypt users' message plaintext. E2EE remains unchanged. The server never receives plaintext message content or private keys.

## Security
Security administration can include device/session revocation subject to authorization. Business policies are explicit and auditable.

## Limitations
Production business verification provider, organization UI, billing integration, enterprise SSO/SCIM, managed-device controls, legal/business verification review and independent security review remain required.
