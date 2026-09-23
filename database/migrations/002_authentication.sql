-- ZERO Phase 3 authentication metadata.
-- No passwords, OTP plaintext, private keys, or message plaintext are stored.

CREATE TABLE IF NOT EXISTS zero_accounts (
  id UUID PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  CONSTRAINT zero_accounts_status CHECK (status IN ('ACTIVE','SUSPENDED','DELETING','DELETED'))
);

CREATE TABLE IF NOT EXISTS zero_authenticators (
  id UUID PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES zero_accounts(id) ON DELETE CASCADE,
  method TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  CONSTRAINT zero_authenticators_method CHECK (method IN ('email_otp','phone_otp','passkey'))
);

CREATE TABLE IF NOT EXISTS zero_sessions (
  id UUID PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES zero_accounts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  reauth_required BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS zero_auth_challenges (
  id UUID PRIMARY KEY,
  account_id UUID REFERENCES zero_accounts(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL,
  method TEXT NOT NULL,
  verifier_digest BYTEA NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts_used INTEGER NOT NULL DEFAULT 0,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zero_auth_challenges_attempts CHECK (attempts_used >= 0 AND attempts_used <= 5)
);
