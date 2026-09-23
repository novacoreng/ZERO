export const AUTH_POLICY = Object.freeze({
  otpTtlSeconds: 300,
  otpMaxAttempts: 5,
  recoveryTtlSeconds: 900,
  revokeSessionsOnRecovery: true,
  requireReauthFor: [
    "change_email",
    "change_password",
    "disable_authenticator",
    "add_trusted_device",
    "account_recovery"
  ] as const
});

export function shouldReauthenticate(action: string): boolean {
  return AUTH_POLICY.requireReauthFor.includes(
    action as (typeof AUTH_POLICY.requireReauthFor)[number]
  );
}
