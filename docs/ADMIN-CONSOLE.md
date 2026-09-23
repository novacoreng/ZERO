# ZERO Admin Console — Phase 32

The Admin Console is a privileged operational control plane with strict least-privilege separation.

## Roles
- SUPER_ADMIN: broad platform administration.
- SECURITY_ADMIN: security and session/device controls.
- TRUST_SAFETY_ADMIN: reports and abuse/safety actions.
- SUPPORT_ADMIN: limited support visibility.
- AUDITOR: read-only audit/security visibility.

## E2EE boundary
Administrators never receive message plaintext, private keys or recovery secrets. Reports expose only explicitly authorized evidence under the reporting policy.

## Authorization
Sensitive actions are explicit and audited. Emergency controls use dual-control authorization.

## Audit
Administrative requests and executions are recorded with minimal operational metadata. Secrets, tokens, message plaintext and private keys are excluded.

## Safety
Support cannot perform suspension or device revocation. Auditors cannot perform state-changing actions.

## Limitations
Production admin identity provider, privileged network boundary, dual-control runtime, emergency kill-switch implementation, SIEM integration, admin UI, legal/operational review and independent security audit remain required.
