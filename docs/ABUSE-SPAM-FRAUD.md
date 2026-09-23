# ZERO Abuse, Spam & Fraud — Phase 23

ZERO uses abuse controls without turning the service into a plaintext surveillance system.

## Signals
Signals may include rate-limit violations, authentication failures, unusual device activity, report spikes, Data Drop abuse and delivery/spam patterns. Message plaintext is not an automated abuse-inspection input.

## Trust levels
Accounts can move through NEW, STANDARD, TRUSTED and RESTRICTED states. Trust is an operational control signal, not a statement about a person's identity or intent.

## Responses
Controls can challenge, throttle, block or route activity for review. Restrictions should be time-bounded where possible and have an appeal/recovery path.

## Anti-enumeration
PIN discovery, account existence and authentication endpoints must return privacy-preserving responses and use rate limits so attackers cannot cheaply enumerate identities.

## Fraud controls
Payment, subscription, Data Drop and device-abuse signals can be correlated at metadata level. Financial providers may have their own fraud requirements, but ZERO must not expose message plaintext to them.

## Admin boundary
Abuse operators receive minimum necessary metadata. Administrative access does not grant message decryption capability.

## Limitations
Production rate-limit infrastructure, anomaly detection, reporting workflows, moderation tooling and fraud-provider integrations remain required. Independent security review remains required.
