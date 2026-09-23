-- ZERO Phase 25: security center and security events.
CREATE TABLE IF NOT EXISTS zero_security_events (
  id UUID PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES zero_accounts(id) ON DELETE CASCADE,
  device_id UUID REFERENCES zero_devices(id) ON DELETE SET NULL,
  kind TEXT NOT NULL,
  severity TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  acknowledged_at TIMESTAMPTZ,
  CONSTRAINT zero_security_event_kind CHECK (kind IN ('NEW_DEVICE','DEVICE_REVOKED','IDENTITY_KEY_CHANGED','SESSION_CREATED','SESSION_REVOKED','RECOVERY_STARTED','RECOVERY_COMPLETED','SUSPICIOUS_ACTIVITY')),
  CONSTRAINT zero_security_event_severity CHECK (severity IN ('INFO','WARNING','CRITICAL'))
);
CREATE TABLE IF NOT EXISTS zero_security_checks (
  id UUID PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES zero_accounts(id) ON DELETE CASCADE,
  check_code TEXT NOT NULL,
  status TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zero_security_check_status CHECK (status IN ('PASS','ACTION_REQUIRED','UNAVAILABLE')),
  UNIQUE(account_id,check_code)
);
CREATE INDEX IF NOT EXISTS zero_security_events_account_idx ON zero_security_events(account_id,created_at);
