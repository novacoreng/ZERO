# Contributing to ZERO

Thank you for helping improve ZERO, a free, open-source privacy-first messenger.

## Getting started

1. Review the README and SECURITY.md before changing code.
2. Open an issue to discuss substantial features or protocol changes before implementation.
3. Fork the repository, create a focused branch, and submit a pull request against `main`.
4. Explain the change, relevant risks, and how you tested it. Include screenshots only when they do not expose private data.
5. Keep contributions compatible with the MIT License. By submitting a contribution, you agree that it may be distributed under the repository's MIT License.

## Security and privacy

- Never commit private keys, access tokens, credentials, real conversations, or sensitive test data.
- Do not add plaintext message logging, analytics that expose message content, or undisclosed network requests.
- Do not claim end-to-end encryption, forward secrecy, secure deletion, or platform support unless the implementation and tests substantiate the claim.
- For vulnerabilities, follow SECURITY.md and avoid publishing exploitable details in a public issue before coordinated disclosure.

## Local validation

Install the dependencies described in the README, then run the relevant workspace checks. For the Windows desktop code, run `pnpm --dir apps/desktop test`. The repository CI also runs workspace checks when GitHub Actions runners are available.

## Review expectations

Maintainers may request changes, tests, documentation, or a narrower scope. Be respectful and keep discussion focused on technical evidence. No contribution is guaranteed to be merged.
