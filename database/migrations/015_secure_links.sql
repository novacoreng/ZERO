-- ZERO Phase 16: secure link handling.
CREATE TABLE IF NOT EXISTS zero_secure_links (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES zero_conversations(id) ON DELETE CASCADE,
  normalized_url TEXT NOT NULL,
  link_kind TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'UNREVIEWED',
  expires_at TIMESTAMPTZ,
  preview_allowed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zero_link_kind CHECK (link_kind IN ('HTTPS','HTTP','MAILTO','TEL','OTHER')),
  CONSTRAINT zero_link_state CHECK (state IN ('UNREVIEWED','SAFE','BLOCKED','EXPIRED')),
  CONSTRAINT zero_link_length CHECK (octet_length(normalized_url) <= 4096)
);
CREATE INDEX IF NOT EXISTS zero_secure_links_conversation_idx ON zero_secure_links(conversation_id,created_at);
