-- ZERO Phase 13: temporary encrypted file sharing.
CREATE TABLE IF NOT EXISTS zero_data_drops (
  id UUID PRIMARY KEY,
  owner_account_id UUID NOT NULL REFERENCES zero_accounts(id) ON DELETE CASCADE,
  state TEXT NOT NULL DEFAULT 'ACTIVE',
  access_mode TEXT NOT NULL,
  download_policy TEXT NOT NULL DEFAULT 'UNLIMITED',
  max_downloads INTEGER,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  destroyed_at TIMESTAMPTZ,
  CONSTRAINT zero_drop_state CHECK (state IN ('ACTIVE','PAUSED','EXPIRED','REVOKED','DESTROYED')),
  CONSTRAINT zero_drop_access CHECK (access_mode IN ('PIN_REQUIRED','ONE_TIME_LINK','PASSCODE_REQUIRED','AUTHENTICATED')),
  CONSTRAINT zero_drop_download_policy CHECK (download_policy IN ('UNLIMITED','ONE_DOWNLOAD','MAX_DOWNLOADS')),
  CONSTRAINT zero_drop_max_downloads CHECK (max_downloads IS NULL OR max_downloads > 0)
);
CREATE TABLE IF NOT EXISTS zero_data_drop_objects (
  drop_id UUID NOT NULL REFERENCES zero_data_drops(id) ON DELETE CASCADE,
  file_object_id UUID NOT NULL REFERENCES zero_file_objects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(drop_id,file_object_id)
);
CREATE TABLE IF NOT EXISTS zero_data_drop_access (
  id UUID PRIMARY KEY,
  drop_id UUID NOT NULL REFERENCES zero_data_drops(id) ON DELETE CASCADE,
  authorization_digest BYTEA NOT NULL,
  download_count INTEGER NOT NULL DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zero_drop_auth_digest CHECK (octet_length(authorization_digest)=32),
  CONSTRAINT zero_drop_download_count CHECK (download_count >= 0)
);
CREATE INDEX IF NOT EXISTS zero_data_drops_expiry_idx ON zero_data_drops(state,expires_at);
CREATE INDEX IF NOT EXISTS zero_data_drop_access_drop_idx ON zero_data_drop_access(drop_id);
