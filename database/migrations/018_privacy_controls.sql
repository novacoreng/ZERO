-- ZERO Phase 19: privacy controls.
CREATE TABLE IF NOT EXISTS zero_privacy_controls (
  account_id UUID PRIMARY KEY REFERENCES zero_accounts(id) ON DELETE CASCADE,
  read_receipts TEXT NOT NULL DEFAULT 'CONTACTS',
  typing_indicators TEXT NOT NULL DEFAULT 'CONTACTS',
  presence_visibility TEXT NOT NULL DEFAULT 'CONTACTS',
  last_seen_visibility TEXT NOT NULL DEFAULT 'CONTACTS',
  forwarding_policy TEXT NOT NULL DEFAULT 'WARN',
  notification_privacy TEXT NOT NULL DEFAULT 'SENDER_ONLY',
  screenshot_protection_requested BOOLEAN NOT NULL DEFAULT TRUE,
  link_previews BOOLEAN NOT NULL DEFAULT FALSE,
  profile_discovery BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zero_priv_receipts CHECK (read_receipts IN ('EVERYONE','CONTACTS','NOBODY')),
  CONSTRAINT zero_priv_typing CHECK (typing_indicators IN ('EVERYONE','CONTACTS','NOBODY')),
  CONSTRAINT zero_priv_presence CHECK (presence_visibility IN ('EVERYONE','CONTACTS','NOBODY')),
  CONSTRAINT zero_priv_last_seen CHECK (last_seen_visibility IN ('EVERYONE','CONTACTS','NOBODY')),
  CONSTRAINT zero_priv_forwarding CHECK (forwarding_policy IN ('ALLOW','WARN','BLOCK')),
  CONSTRAINT zero_priv_notifications CHECK (notification_privacy IN ('FULL','SENDER_ONLY','HIDDEN'))
);
