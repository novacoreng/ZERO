# ZERO Infrastructure Security — Phase 30

ZERO infrastructure must enforce the same privacy boundary as the application.

## Environment separation
Development, staging and production are separate security environments. Production secrets and credentials are never reused from development.

## Secrets
Secrets are injected through a managed secret store/runtime environment. They are not committed to source, embedded in client bundles, or written to logs.

## Transport and network
TLS is mandatory for service traffic. Network segmentation, service identities and least-privilege access restrict service-to-service communication.

## Platform controls
Production requires encryption at rest, rate limiting, DDoS protection, security headers, dependency pinning, immutable deployments and audit logging.

## Exceptions
Infrastructure exceptions are explicit, time-bounded and require a reason. An exception is not equivalent to an enforced control.

## Audit
Security audit events contain operational metadata only and must not include plaintext messages, private keys, tokens, credentials or recovery secrets.

## Limitations
Cloud-specific controls, managed secret provider, WAF/DDoS configuration, KMS/HSM strategy, production network topology, runtime hardening, supply-chain signing, SIEM integration and independent infrastructure audit remain required.
