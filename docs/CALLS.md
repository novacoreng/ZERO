# ZERO Calls — Phase 28

ZERO Calls provides encrypted 1-to-1 audio and video calling while keeping the server outside the media trust boundary.

## Architecture
Signaling establishes an authorized call between device identities. Media is transported through an encrypted media channel/relay as needed. The server does not store call media or plaintext call content.

## Authorization
Calls are bound to caller/callee devices and existing account/session security. Revoked devices cannot originate or continue calls.

## Lifecycle
OFFERED → RINGING → CONNECTING → CONNECTED, with RECONNECTING for network recovery. Terminal states are ENDED, MISSED, REJECTED or FAILED.

## Privacy
Only minimum signaling metadata is retained. No call audio/video is persisted by the core service.

## Reliability
Calls explicitly model network reconnection and failure. Expired offers fail closed.

## Limitations
Production WebRTC/media stack, TURN infrastructure, mobile background-call integration, push-call signaling, call-key implementation, NAT traversal testing, network-quality telemetry and independent security review remain required. Group calling is deferred.
