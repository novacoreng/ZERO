# ZERO Windows test app

This is a hardened Electron test shell for the ZERO web client. It is intentionally a test distribution and does not claim native cryptographic key isolation.

## Local test

Run `npm run desktop:dev` from the repository root.

## Windows installer

The `windows-test-build.yml` workflow runs on a Windows runner and uploads the generated NSIS installer as a GitHub Actions artifact. The default test endpoint is the ZERO Vercel URL. Set `ZERO_WEB_URL` to override it during local testing.

Production release remains blocked until desktop key storage, update signing, installer signing, protocol handling, notification behavior and independent security review are verified.
