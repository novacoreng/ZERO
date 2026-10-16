# ZERO Mobile (Android and iOS)

This is the existing Expo/React Native mobile application for ZERO. It currently displays a simplified chat shell and a service connectivity check. It does not yet implement secure device activation or encrypted messaging.

## Test the UI
From the repository root, install workspace dependencies with pnpm and run `pnpm --dir apps/mobile start:go`. Open in Expo Go only if the installed Expo Go version supports this project's Expo SDK and native dependencies.

## Build Android installable APK
The project now includes `eas.json` with an internal preview APK profile. Install EAS CLI, sign in to your own Expo account, configure the project and Android signing credentials, then run:
```sh
cd apps/mobile
npx eas-cli build:configure
npx eas-cli build --platform android --profile preview
```
This requires your Expo account and build credentials. No APK has been produced or tested by this change.

## Build iOS
Use `npx eas-cli build --platform ios --profile preview` after configuring your Expo account and Apple signing. iOS distribution to devices typically requires an Apple Developer account and device registration or TestFlight.

## Identity architecture
Each mobile installation should generate its own asymmetric device identity using native platform key storage (Android Keystore / iOS Keychain or Secure Enclave where supported). PINs must be derived from the device public key, and private keys must not leave protected storage. The existing desktop implementation uses an Ed25519 key in Windows-protected storage; that does not automatically provide hardware-bound guarantees. Expo Go cannot be treated as proof of hardware-backed key isolation.

**Important:** The mobile app currently does NOT generate or register a cryptographic PIN. Do not display fabricated PINs or claim device binding until native secure key generation, challenge signing, loss/reinstall policy, and server verification are implemented and tested.

## Known CI blocker
The current Expo Android bundling job has failed resolving `react-native-screens/experimental` imported by Expo Router. Dependency compatibility and the workspace lockfile must be resolved and verified before treating APK builds as successful.

## License and contributions

ZERO is free and open source under the [MIT License](../../LICENSE). Source code and contributions are managed at [novacoreng/ZERO](https://github.com/novacoreng/ZERO). Please read [CONTRIBUTING.md](../../CONTRIBUTING.md) and [SECURITY.md](../../SECURITY.md) before contributing or reporting security issues.
