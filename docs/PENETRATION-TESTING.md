# ZERO Penetration Testing

## Purpose
Define the external security-assessment contract for ZERO without claiming an assessment has occurred.

## Required scope
- Authentication and session boundaries
- Authorization and privilege escalation
- E2EE protocol boundaries and plaintext/private-key leakage
- API validation, injection, replay and abuse controls
- Web XSS, CSRF, request smuggling and session boundary checks
- File upload, object access and encrypted chunk handling
- Data Drop capability, replay and access-control abuse
- Call signaling and media authorization boundaries
- Admin-console privilege separation and dual-control paths
- Infrastructure exposure, secrets and service-boundary abuse
- Privacy and metadata leakage

## Engagement rules
Testing must be authorized, scoped and conducted against controlled environments. Production testing requires explicit authorization and safety controls. Findings receive severity, remediation state and evidence references. Remediated findings require retesting before closure.

## Release gate
An unresolved, non-retired CRITICAL finding blocks release. A penetration-test PASS requires an actual completed assessment report and retained evidence; source-level contracts are not evidence of an assessment.

## Independence
The eventual assessment should be performed by an appropriately qualified independent security provider. This phase creates the evidence and lifecycle model; it does not represent completion of the external test.
