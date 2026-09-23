-- ZERO Phase 23: abuse prevention metadata.
CREATE TABLE IF NOT EXISTS zero_trust_levels (
  account_id UUID PRIMARY KEY REFERENCES zero_accounts(id) ON DELETE CASCADE,
  level TEXT NOT NULL DEFAULT 'NEW',
  score INTEGER NOT NULL DEFAULT 0,
  restricted_until TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zero_trust_level CHECK (level IN ('NEW','STANDARD','TRUSTED','RESTRICTED')),
  CONSTRAINT zero_trust_score CHECK (score >= 0 AND score <= 100)
);
CREATE TABLE IF NOT EXISTS zero_abuse_events (
  id UUID PRIMARY KEY,
  account_id UUID REFERENCES zero_accounts(id) ON DELETE SET NULL,
  device_id UUID REFERENCES zero_devices(id) ON DELETE SET NULL,
  signal TEXT NOT NULL,
  action TEXT NOT NULL,
  reason_code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  CONSTRAINT zero_abuse_signal CHECK (signal IN ('RATE_LIMIT','AUTH_FAILURES','DEVICE_ANOMALY','REPORT_SPIKE','DROP_ABUSE','SPAM_PATTERN')),
  CONSTRAINT zero_abuse_action CHECK (action IN ('ALLOW','CHALLENGE','THROTTLE','BLOCK','REVIEW'))
);
CREATE INDEX IF NOT EXISTS zero_abuse_events_account_idx ON zero_abuse_events(account_id,created_at);
CREATE INDEX IF NOT EXISTS zero_abuse_events_device_idx ON zero_abuse_events(device_id,created_at);
