# ZERO Secure Link Handling — Phase 16

## URL boundary
Links are parsed and normalized before display or external navigation. Dangerous protocols such as javascript:, data: and file: are rejected. Localhost/private-development targets are rejected by policy. HTTPS is the preferred and default web protocol.

## Privacy
Tracking parameters are removed where policy permits. URL fragments are removed because they may contain client-side secrets or identifiers. Full URLs must not be written to ordinary application logs or analytics.

## Preview security
Link previews are opt-in and isolated. A preview service must not execute page scripts, access internal network resources, follow arbitrary redirects, or expose user IP/device identity to the destination. The production preview worker requires network egress controls and SSRF protections.

## Redirects
The ZERO server does not blindly follow redirects. Redirect destinations are revalidated against the same URL policy.

## Expiration
Links may carry an application-level expiration state. Expired links must not authorize access to ZERO resources.

## External navigation
Opening an external link is an explicit client action. The client should clearly indicate that the destination leaves ZERO's trust boundary.

## Limitations
Production URL reputation/blocklists, isolated preview infrastructure and comprehensive SSRF testing remain required. Independent security review remains required.
