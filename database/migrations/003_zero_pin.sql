-- ZERO Phase 4: public PIN identity metadata.
-- Store the keyed lookup digest, never a reversible PIN lookup secret.

CREATE TABLE IF NOT EXISTS zero_pins (
  id UUID PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES zero_accounts(id) ON DELETE CASCADE,
  pin_display TEXT NOT NULL,
  lookup_digest BYTEA NOT NULL,
  state TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  replaced_at TIMESTAMPTZ,
  CONSTRAINT zero_pins_state CHECK (state IN ('ACTIVE','REPLACED','BLOCKED')),
  CONSTRAINT zero_pins_pin_format CHECK (pin_display ~ '^[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$')
);

CREATE UNIQUE INDEX IF NOT EXISTS zero_pins_active_account_idx
  ON zero_pins(account_id) WHERE state = 'ACTIVE';

CREATE UNIQUE INDEX IF NOT EXISTS zero_pins_lookup_digest_active_idx
  ON zero_pins(lookup_digest) WHERE state = 'ACTIVE';

CREATE INDEX IF NOT EXISTS zero_pins_account_idx ON zero_pins(account_id);
