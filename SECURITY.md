# ZERO Security Rules

1. Never commit secrets or credentials.
2. Never log message plaintext, attachment plaintext, private keys, recovery codes, access tokens, or session secrets.
3. Treat MIME type, file extension, archive contents, and user-supplied metadata as untrusted input.
4. Uploaded files must never be executed by server-side application code.
5. Server-side persistence must be metadata-only until the approved E2EE architecture permits encrypted envelopes/ciphertext.
6. Cryptography must use reviewed, maintained libraries and approved protocol specifications; no custom cryptographic primitives.
7. Security-sensitive changes require tests and change-impact analysis.
8. Production readiness requires independent security/cryptographic review where specified by the security roadmap.
