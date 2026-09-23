# ZERO Notifications — Phase 22

ZERO notifications are wake-up/delivery signals, not a second plaintext messaging channel.

## Privacy
The default notification mode is sender-only. Full message previews are opt-in. Hidden mode exposes no message content. The notification service must not receive ordinary message plaintext merely to construct a push notification.

## Payloads
Application notification payloads are opaque and bounded. The server routes them to a specific device but does not decrypt message content.

## Device tokens
Push tokens are device-scoped. The application stores a digest rather than treating a provider token as ordinary user identity data. Token rotation and revocation are required.

## Expiration
Notifications have short-lived application state. Expired/revoked notifications must not be delivered.

## Security events
Security notifications may use a separate class so account/device events can be surfaced without exposing message content.

## Provider boundary
APNS, FCM and Web Push are external delivery providers. Provider payloads must follow ZERO privacy settings and must not contain encryption keys, message plaintext, signed URLs or sensitive link parameters.

## Limitations
Production provider adapters, token registration/rotation, platform background handling and delivery telemetry remain required.
