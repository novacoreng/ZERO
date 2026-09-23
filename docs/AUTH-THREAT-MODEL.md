# ZERO Authentication Threat Model

| Threat | Control |
|---|---|
| OTP guessing | short TTL, attempt limits, rate limits |
| Account enumeration | uniform recovery responses |
| Session theft | secure transport, rotation/revocation, reauthentication |
| Recovery abuse | single-use expiring challenges |
| Passkey phishing | WebAuthn relying-party scoping |
| Lost device | later device/session revocation phase |
| Sensitive logging | authentication secrets excluded from logs |
