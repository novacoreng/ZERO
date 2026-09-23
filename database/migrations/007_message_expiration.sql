-- ZERO Phase 8: durable message expiration state. No plaintext is stored.
CREATE TABLE IF NOT EXISTS zero_message_expiration (
  message_id UUID PRIMARY KEY REFERENCES zero_messages(id) ON DELETE CASCADE,
  scope TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'ACTIVE',
  expires_at TIMESTAMPTZ NOT NULL,
  destroying_started_at TIMESTAMPTZ,
  destroyed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zero_expiration_scope CHECK (scope IN ('FOR_EVERYONE','FOR_ME')),
  CONSTRAINT zero_expiration_state CHECK (state IN ('ACTIVE','EXPIRING','DESTROYING','DESTROYED'))
);
CREATE INDEX IF NOT EXISTS zero_message_expiration_due_idx ON zero_message_expiration(state, expires_at);
CREATE INDEX IF NOT EXISTS zero_message_expiration_message_state_idx ON zero_message_expiration(message_id, state);
