# Security Boundaries

Future cryptographic private keys and plaintext content belong on trusted client devices.

The server receives only minimum metadata/ciphertext envelopes required by approved protocols.

Workers operate on lifecycle metadata and opaque encrypted objects and must not require plaintext message access.

Any individual file type may eventually be accepted. Folders are not upload primitives; users package them locally, such as ZIP, before encryption/upload. The server treats the archive as opaque data.
