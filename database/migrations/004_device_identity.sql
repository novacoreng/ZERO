-- ZERO Phase 5: per-device identity and trust metadata.
-- Public key material is allowed; private key material and message plaintext are not.
CREATE TABLE IF NOT EXISTS zero_devices (
  id UUID PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES zero_accounts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  device_label TEXT NOT NULL,
  identity_public_key BYTEA NOT NULL,
  identity_key_fingerprint BYTEA NOT NULL,
  trust_state TEXT NOT NULL DEFAULT 'PENDING',
  identity_key_state TEXT NOT NULL DEFAULT 'PUBLISHED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  CONSTRAINT zero_devices_platform CHECK (platform IN ('ios','android','web','desktop')),
  CONSTRAINT zero_devices_trust_state CHECK (trust_state IN ('PENDING','TRUSTED','REVOKED','RETIRED')),
  CONSTRAINT zero_devices_key_state CHECK (identity_key_state IN ('GENERATED','PUBLISHED','ACTIVE','ROTATING','REVOKED','DESTROYED'))
);
CREATE UNIQUE INDEX IF NOT EXISTS zero_devices_account_fingerprint_idx ON zero_devices(account_id, identity_key_fingerprint);
CREATE INDEX IF NOT EXISTS zero_devices_account_state_idx ON zero_devices(account_id, trust_state);
