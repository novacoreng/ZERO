-- ZERO Phase 9: cryptographic destruction ledger. Stores lifecycle metadata, never secret key material.
CREATE TABLE IF NOT EXISTS zero_destruction_records (
  target_id UUID PRIMARY KEY,
  target TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'ACTIVE',
  key_version INTEGER NOT NULL,
  destruction_nonce BYTEA NOT NULL,
  destroyed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zero_destruction_target CHECK (target IN ('MESSAGE_KEY','FILE_OBJECT_KEY','LOCAL_CACHE_KEY')),
  CONSTRAINT zero_destruction_state CHECK (state IN ('ACTIVE','DESTROYING','DESTROYED')),
  CONSTRAINT zero_destruction_key_version CHECK (key_version > 0),
  CONSTRAINT zero_destruction_nonce CHECK (octet_length(destruction_nonce) >= 16)
);
CREATE INDEX IF NOT EXISTS zero_destruction_due_idx ON zero_destruction_records(state, updated_at);
