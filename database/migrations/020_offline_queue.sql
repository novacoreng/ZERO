-- ZERO Phase 21: encrypted offline outbox.
CREATE TABLE IF NOT EXISTS zero_offline_outbox (
  id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL,
  device_id UUID NOT NULL REFERENCES zero_devices(id) ON DELETE CASCADE,
  ciphertext_digest BYTEA NOT NULL,
  state TEXT NOT NULL DEFAULT 'QUEUED',
  priority TEXT NOT NULL DEFAULT 'NORMAL',
  attempts INTEGER NOT NULL DEFAULT 0,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_error_code TEXT,
  CONSTRAINT zero_outbox_state CHECK (state IN ('QUEUED','SENDING','SENT','FAILED','BLOCKED')),
  CONSTRAINT zero_outbox_priority CHECK (priority IN ('CRITICAL','NORMAL','BULK')),
  CONSTRAINT zero_outbox_digest CHECK (octet_length(ciphertext_digest)=32),
  CONSTRAINT zero_outbox_attempts CHECK (attempts >= 0 AND attempts <= 8)
);
CREATE INDEX IF NOT EXISTS zero_outbox_dispatch_idx ON zero_offline_outbox(state,next_attempt_at,priority);
CREATE INDEX IF NOT EXISTS zero_outbox_device_idx ON zero_offline_outbox(device_id,state);
