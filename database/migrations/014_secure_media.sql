-- ZERO Phase 15: secure media and metadata boundary.
CREATE TABLE IF NOT EXISTS zero_secure_media (
  id UUID PRIMARY KEY,
  object_id UUID NOT NULL REFERENCES zero_file_objects(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'UNPROCESSED',
  trust_level TEXT NOT NULL DEFAULT 'UNTRUSTED',
  original_name TEXT NOT NULL,
  safe_name TEXT NOT NULL,
  declared_mime TEXT,
  detected_mime TEXT,
  metadata_stripped BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zero_media_kind CHECK (kind IN ('IMAGE','VIDEO','AUDIO','DOCUMENT','OTHER')),
  CONSTRAINT zero_media_state CHECK (state IN ('UNPROCESSED','SANITIZING','SANITIZED','FAILED','QUARANTINED')),
  CONSTRAINT zero_media_trust CHECK (trust_level IN ('UNTRUSTED','SANITIZED','VERIFIED')),
  CONSTRAINT zero_media_name_length CHECK (octet_length(safe_name) <= 255)
);
CREATE TABLE IF NOT EXISTS zero_media_derivatives (
  id UUID PRIMARY KEY,
  media_id UUID NOT NULL REFERENCES zero_secure_media(id) ON DELETE CASCADE,
  derivative_type TEXT NOT NULL,
  object_id UUID NOT NULL REFERENCES zero_file_objects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zero_media_derivative_type CHECK (derivative_type IN ('THUMBNAIL','PREVIEW','TRANSCODED'))
);
CREATE INDEX IF NOT EXISTS zero_secure_media_object_idx ON zero_secure_media(object_id);
CREATE INDEX IF NOT EXISTS zero_media_derivatives_media_idx ON zero_media_derivatives(media_id);
