# ZERO Privacy Controls — Phase 19

Privacy controls are policy inputs enforced at the appropriate client/server boundary. A setting is not considered functional merely because a UI toggle exists.

## Controls
- Read receipts
- Typing indicators
- Presence and last seen
- Forwarding policy
- Notification content privacy
- Screenshot/capture protection request
- Link previews
- Profile discovery

## Defaults
ZERO defaults to reduced exposure: contact-scoped presence/receipts/typing, sender-only notification content, disabled link previews and profile discovery.

## Screenshot protection
The application can request platform capture protection where supported. It cannot guarantee prevention on every operating system, browser, external camera or recording path.

## Notifications
Notification payloads should minimize message content according to the selected policy. Sensitive plaintext must not be unnecessarily delivered to notification providers.

## Enforcement
Presence, receipts and typing are metadata and should be transmitted only when policy permits. Privacy decisions must be enforced server-side where the server controls delivery and client-side where plaintext display is involved.

## Forwarding
Forwarding controls are policy boundaries, not cryptographic guarantees against screenshots, transcription or re-sharing. A BLOCK policy prevents supported in-app forwarding.

## Limitations
Platform-specific capture controls, notification-provider integrations, full multi-device synchronization and independent privacy/security review remain required.
