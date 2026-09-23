-- ZERO Phase 12: resumable encrypted upload sessions.
CREATE TABLE IF NOT EXISTS zero_upload_sessions (
  id UUID PRIMARY KEY,
  file_object_id UUID NOT NULL REFERENCES zero_file_objects(id) ON DELETE CASCADE,
  chunk_size_bytes INTEGER NOT NULL,
  total_chunks INTEGER NOT NULL,
  state TEXT NOT NULL DEFAULT 'CREATED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zero_upload_chunk_size CHECK (chunk_size_bytes BETWEEN 262144 AND 16777216),
  CONSTRAINT zero_upload_total_chunks CHECK (total_chunks > 0),
  CONSTRAINT zero_upload_state CHECK (state IN ('CREATED','UPLOADING','PAUSED','FINALIZING','AVAILABLE','FAILED','ABORTED'))
);
CREATE TABLE IF NOT EXISTS zero_upload_chunks (
  upload_id UUID NOT NULL REFERENCES zero_upload_sessions(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  offset_bytes BIGINT NOT NULL,
  size_bytes INTEGER NOT NULL,
  integrity_digest BYTEA NOT NULL,
  nonce BYTEA NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(upload_id,chunk_index),
  CONSTRAINT zero_upload_chunk_index CHECK (chunk_index >= 0),
  CONSTRAINT zero_upload_offset CHECK (offset_bytes >= 0),
  CONSTRAINT zero_upload_chunk_size_positive CHECK (size_bytes > 0),
  CONSTRAINT zero_upload_digest CHECK (octet_length(integrity_digest)=32),
  CONSTRAINT zero_upload_nonce CHECK (octet_length(nonce)=12)
);
CREATE INDEX IF NOT EXISTS zero_upload_chunks_received_idx ON zero_upload_chunks(upload_id,received_at);
