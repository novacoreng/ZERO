-- ZERO Phase 10: opaque universal file object metadata. No plaintext content is stored.
CREATE TABLE IF NOT EXISTS zero_file_objects (
  id UUID PRIMARY KEY,
  owner_account_id UUID NOT NULL REFERENCES zero_accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  media_type TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'CREATED',
  packaging TEXT NOT NULL DEFAULT 'SINGLE_FILE',
  sha256_digest BYTEA NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zero_file_size CHECK (size_bytes >= 0 AND size_bytes <= 10737418240),
  CONSTRAINT zero_file_state CHECK (state IN ('CREATED','READY','UPLOADING','AVAILABLE','FAILED','EXPIRED','DESTROYED')),
  CONSTRAINT zero_file_packaging CHECK (packaging IN ('SINGLE_FILE','ZIP_PACKAGE')),
  CONSTRAINT zero_file_name CHECK (char_length(name) BETWEEN 1 AND 255),
  CONSTRAINT zero_file_digest CHECK (octet_length(sha256_digest) = 32)
);
CREATE INDEX IF NOT EXISTS zero_file_owner_state_idx ON zero_file_objects(owner_account_id,state);
CREATE INDEX IF NOT EXISTS zero_file_created_idx ON zero_file_objects(created_at);
