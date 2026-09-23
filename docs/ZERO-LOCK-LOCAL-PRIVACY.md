# ZERO Lock & Local Privacy — Phase 20

ZERO Lock protects local plaintext and key material on the device. The server cannot unlock a device and never receives local private keys.

## Unlock
Supported policy methods are device biometric, ZERO PIN and device passcode. Biometric/passcode checks are delegated to the platform secure authentication mechanism; ZERO does not store biometric templates.

## Secure storage
Private keys and local encryption keys remain in platform secure storage where available. The application must not persist them in ordinary preferences, logs, analytics or plaintext files.

## Auto-lock
Auto-lock is bounded and may trigger when the app backgrounds, after inactivity, or when device security changes. A locked application must not display message plaintext or sensitive previews.

## Panic
Panic controls can immediately lock the application, hide sensitive content, clear clipboard data under supported platform APIs, and initiate local-key destruction when explicitly configured. Panic is not represented as guaranteed forensic wiping on flash storage.

## Clipboard
Sensitive copied content should be cleared after a bounded interval where platform APIs permit. The app must not place message content into the clipboard without explicit user action.

## Capture/background privacy
Background snapshots should show a privacy-safe screen. Platform screenshot/recording protections are requested where supported.

## Recovery
ZERO Lock is a local gate, not account recovery. Losing a local unlock factor must not cause the server to receive private keys or plaintext.

## Limitations
Platform secure-storage behavior, biometric/passcode integration, clipboard APIs and verified local-key destruction require platform-specific implementation and testing.
