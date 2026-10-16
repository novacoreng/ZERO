# ZERO

![ZERO official wordmark](assets/branding/zero-wordmark.svg)

**PIN. PRIVATE. TEMPORARY. GONE.**

ZERO is a free, open-source, experimental privacy-first messaging project for Windows, Android, and iOS.

> **Development status:** Early-stage software. The Windows desktop client has experimental device identity and encrypted messaging components. Mobile apps are not yet feature-complete. Do not rely on ZERO for sensitive or safety-critical communication. End-to-end security and production readiness have not been independently audited.

## Repository

- `apps/desktop`: Electron Windows desktop client and local encrypted inbox
- `apps/mobile`: Expo/React Native mobile application foundation
- `apps/web`: Web application foundation
- `services/api`: Device registry and experimental ciphertext relay

## Development

Use Node.js 22 and pnpm 10. Install workspace dependencies from the repository root:

```sh
pnpm install
pnpm test
pnpm --dir apps/desktop test
```

The desktop tests exercise identity, message envelopes, encrypted inbox persistence, and renderer contracts. Passing automated tests does not replace testing installed clients on separate devices.

## Security

ZERO's public PIN is an identifier, **not** a password or recovery secret. The current Windows implementation uses Electron OS-backed `safeStorage` for local encrypted data. This does not guarantee hardware-bound keys, forward secrecy, secure deletion, or protection against a compromised device.

Please review [SECURITY.md](SECURITY.md) before reporting security issues. Avoid publishing exploit details or private data in public issues.

## Open source

ZERO is licensed under the [MIT License](LICENSE). Contributions are welcome under [CONTRIBUTING.md](CONTRIBUTING.md).

## Project status

The project is under active development. GitHub Actions and Windows installer verification must succeed before builds are presented as validated releases.
