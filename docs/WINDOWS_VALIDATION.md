# ZERO Windows validation checklist

## GitHub Actions investigation

If a workflow fails in seconds with `runner_id: 0`, `runner_name: ""`, and `steps: []`, no job steps ran. Check the repository Actions page for billing or spending-limit notices, Actions policy restrictions, disabled workflows, runner availability, and organization limits. These symptoms do **not** prove the application failed tests. Do not mark CI green until an actual runner completes the checks.

## Local Windows validation

1. Install Node.js 22 and pnpm 10. Clone the repository and run `pnpm install --no-frozen-lockfile`.
2. Run `pnpm --dir apps/desktop test`, `pnpm test`, `pnpm typecheck`, and `pnpm security:check`.
3. Run `pnpm --dir apps/desktop dist:win`. Install the unsigned test installer on a disposable Windows test machine, subject to your device security policy.
4. Start the local API using the instructions in `services/api`. Configure `ZERO_REGISTRY_URL` to the accessible HTTPS relay or localhost address.
5. Activate **two different Windows user profiles or test machines** so each receives its own device identity. Register and authenticate both, publish signed encryption keys, and verify each other's PIN.
6. Send a message from A to B. Refresh B's inbox. Verify that the decrypted message appears exactly once and survives a full application restart, even with the relay offline.
7. Interrupt relay acknowledgement after B has saved the message. Restore the relay and refresh. Confirm the message is not duplicated and the acknowledgement is retried.
8. Test expiration, a corrupt inbox file, and an unavailable OS encryption provider. Confirm the application fails closed rather than acknowledging an unsaved message.
9. Confirm the Windows installer contains `encryption-identity.cjs`, `secure-envelope.cjs`, `signed-message.cjs`, `replay-store.cjs`, and `inbox-store.cjs`.

**Security limitations:** This is experimental. The relay queue is memory-backed, device identity is OS-storage-bound rather than hardware-bound, there is no audited ratchet or full cryptographic replay protection, and local expiry is not guaranteed secure deletion.
