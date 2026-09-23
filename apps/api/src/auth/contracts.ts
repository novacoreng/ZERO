export type AuthMethod = "email_otp" | "phone_otp" | "passkey";
export type AuthChallengePurpose = "SIGN_UP" | "SIGN_IN" | "ADD_AUTHENTICATOR" | "ACCOUNT_RECOVERY";

export type AuthChallenge = {
  id: string;
  purpose: AuthChallengePurpose;
  method: AuthMethod;
  expiresAt: string;
  attemptsRemaining: number;
};

export const AUTH_METHODS: readonly AuthMethod[] = [
  "email_otp",
  "phone_otp",
  "passkey"
];
