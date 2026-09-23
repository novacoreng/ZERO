# ZERO Backup & Recovery — Phase 26

Backups are encrypted on the client. The server stores opaque ciphertext and integrity metadata only. Plaintext private keys and recovery secrets are never persisted server-side.

Recovery levels are STANDARD, ENHANCED, and EMERGENCY. Recovery requires explicit authorization, expires, and successful recovery revokes existing sessions.

Trusted contacts are authorization participants, not automatic decryptors. Backup destruction removes server-held encrypted material; cryptographic usability depends on invalidating corresponding client-side key material.

Production key-wrapping protocol, platform secure-storage integration, recovery runtime, trusted-contact UX, disaster recovery and independent security review remain required.
