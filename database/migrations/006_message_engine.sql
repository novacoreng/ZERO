-- ZERO Phase 7: ciphertext-only messaging metadata.
-- No plaintext body, decoded attachment, private key, or message search index is permitted here.
CREATE TABLE IF NOT EXISTS zero_messages (
  id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL,
  session_id UUID NOT NULL REFERENCES zero_e2ee_sessions(id) ON DELETE CASCADE,
  sender_device_id UUID NOT NULL REFERENCES zero_devices(id) ON DELETE CASCADE,
  client_sequence BIGINT NOT NULL,
  kind TEXT NOT NULL,
  ciphertext BYTEA NOT NULL,
  aad_digest BYTEA NOT NULL,
  state TEXT NOT NULL DEFAULT 'QUEUED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  destroyed_at TIMESTAMPTZ,
  CONSTRAINT zero_messages_kind CHECK (kind IN ('TEXT','REACTION','REPLY','SYSTEM')),
  CONSTRAINT zero_messages_state CHECK (state IN ('QUEUED','SENT','DELIVERED','FAILED','EXPIRED','DESTROYED')),
  CONSTRAINT zero_messages_sequence CHECK (client_sequence >= 0),
  CONSTRAINT zero_messages_aad_digest CHECK (octet_length(aad_digest) = 32)
);
CREATE UNIQUE INDEX IF NOT EXISTS zero_messages_sender_sequence_idx ON zero_messages(sender_device_id, conversation_id, client_sequence);
CREATE INDEX IF NOT EXISTS zero_messages_session_state_idx ON zero_messages(session_id, state);
CREATE INDEX IF NOT EXISTS zero_messages_conversation_created_idx ON zero_messages(conversation_id, created_at);

CREATE TABLE IF NOT EXISTS zero_message_delivery_attempts (
  id UUID PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES zero_messages(id) ON DELETE CASCADE,
  attempt INTEGER NOT NULL,
  state TEXT NOT NULL,
  error_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zero_delivery_attempts_state CHECK (state IN ('SENT','DELIVERED','FAILED')),
  CONSTRAINT zero_delivery_attempts_attempt CHECK (attempt > 0)
);
CREATE UNIQUE INDEX IF NOT EXISTS zero_delivery_attempts_message_attempt_idx ON zero_message_delivery_attempts(message_id, attempt);
