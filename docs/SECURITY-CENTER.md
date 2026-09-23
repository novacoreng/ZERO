# ZERO Security Center — Phase 25

The Security Center is the user's operational view of account, device, session and cryptographic-security state.

## Device security
Users can review registered devices and revoke devices. Revocation must prevent further authenticated use according to the device/session policy.

## Identity verification
Identity-key changes are surfaced as security events and require the established identity-verification flow before trust is restored.

## Sessions
Active sessions are visible at the account/device level. Session revocation is immediate and recovery operations can revoke all sessions.

## Security events
Events include new devices, device revocation, identity-key changes, session changes, recovery activity and suspicious activity. Event metadata is minimized.

## Security checks
Checks can report PASS, ACTION_REQUIRED or UNAVAILABLE. An unavailable check is not falsely presented as secure.

## Privacy
The Security Center never exposes private keys, message plaintext or secret recovery material. Security logs must avoid sensitive payloads.

## Limitations
Native device integration, identity verification UI, session runtime, recovery runtime and independent security review remain required.
