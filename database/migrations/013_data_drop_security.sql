-- ZERO Phase 14: authorization hardening.
CREATE TABLE IF NOT EXISTS zero_data_drop_authorizations (
  id UUID PRIMARY KEY,
  drop_id UUID NOT NULL REFERENCES zero_data_drops(id) ON DELETE CASCADE,
  authorization_digest BYTEA NOT NULL,
  state TEXT NOT NULL DEFAULT 'PENDING',
  expires_at TIMESTAMPTZ NOT NULL,
  max_uses INTEGER NOT NULL DEFAULT 1,
  uses INTEGER NOT NULL DEFAULT 0,
  recipient_binding_digest BYTEA,
  failed_attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  CONSTRAINT zero_drop_auth_state CHECK (state IN ('PENDING','AUTHORIZED','CONSUMED','REVOKED','EXPIRED','BLOCKED')),
  CONSTRAINT zero_drop_auth_digest CHECK (octet_length(authorization_digest)=32),
  CONSTRAINT zero_drop_auth_use_limit CHECK (max_uses > 0 AND max_uses <= 100),
  CONSTRAINT zero_drop_auth_uses CHECK (uses >= 0 AND uses <= max_uses),
  CONSTRAINT zero_drop_failed_attempts CHECK (failed_attempts >= 0)
);
CREATE TABLE IF NOT EXISTS zero_data_drop_access_events (
  id UUID PRIMARY KEY,
  drop_id UUID NOT NULL REFERENCES zero_data_drops(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  authorization_id UUID REFERENCES zero_data_drop_authorizations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zero_drop_event_type CHECK (event_type IN ('AUTHORIZED','DENIED','DOWNLOADED','REVOKED','EXPIRED','RATE_LIMITED'))
);
CREATE INDEX IF NOT EXISTS zero_drop_auth_lookup_idx ON zero_data_drop_authorizations(drop_id,authorization_digest);
CREATE INDEX IF NOT EXISTS zero_drop_event_lookup_idx ON zero_data_drop_access_events(drop_id,created_at);
