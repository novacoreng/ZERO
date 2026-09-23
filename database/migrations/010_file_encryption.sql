-- ZERO Phase 11: encrypted file-object metadata. Never store object keys.
CREATE TABLE IF NOT EXISTS zero_file_encryption (
  file_object_id UUID PRIMARY KEY REFERENCES zero_file_objects(id) ON DELETE CASCADE,
  profile TEXT NOT NULL DEFAULT 'zero.file.v1',
  key_id UUID NOT NULL,
  nonce BYTEA NOT NULL,
  encrypted_size_bytes BIGINT NOT NULL,
  plaintext_size_bytes BIGINT NOT NULL,
  integrity_digest BYTEA NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zero_file_enc_profile CHECK (profile = 'zero.file.v1'),
  CONSTRAINT zero_file_enc_nonce CHECK (octet_length(nonce) = 12),
  CONSTRAINT zero_file_enc_sizes CHECK (plaintext_size_bytes >= 0 AND encrypted_size_bytes > 0),
  CONSTRAINT zero_file_enc_digest CHECK (octet_length(integrity_digest) = 32)
);
CREATE UNIQUE INDEX IF NOT EXISTS zero_file_encryption_key_idx ON zero_file_encryption(key_id);
