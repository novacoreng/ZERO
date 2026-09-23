# ZERO Security Testing — Phase 36

Security testing is a release gate, not an optional checklist.

## Required domains
Authentication, authorization, cryptographic boundaries, file/upload security, APIs, web security, privacy leakage, abuse controls and dependency/supply-chain security are explicit test domains.

## Automated controls
Secret scanning, dependency scanning, SAST and DAST are required. Regression suites must run against security-critical boundaries.

## Web/API coverage
Tests must cover injection, XSS, CSRF, SSRF/open-redirect boundaries, authentication/session handling, authorization/IDOR, rate limits and security headers.

## Privacy/E2EE coverage
Tests must prove that server/API paths cannot receive message plaintext or private keys. File and call paths must preserve their encrypted trust boundaries.

## Release rule
Unresolved CRITICAL findings block release. A PASS must be backed by recorded evidence rather than inferred from source inspection.

## Limitations
Actual CI execution, DAST/browser/device suites, dependency advisories, penetration testing and independent security audit remain required before production readiness.
