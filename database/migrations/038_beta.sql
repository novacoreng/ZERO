CREATE TABLE IF NOT EXISTS zero_beta_invitations (
  id UUID PRIMARY KEY,
  invitation_digest TEXT NOT NULL UNIQUE,
  channel TEXT NOT NULL,
  status TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  redeemed_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  CONSTRAINT zero_beta_invitation_channel CHECK (channel IN ('CONTROLLED_BETA','INTERNAL')),
  CONSTRAINT zero_beta_invitation_status CHECK (status IN ('ISSUED','REDEEMED','EXPIRED','REVOKED'))
);

CREATE TABLE IF NOT EXISTS zero_beta_participants (
  id UUID PRIMARY KEY,
  account_id UUID NOT NULL,
  invitation_id UUID NOT NULL REFERENCES zero_beta_invitations(id) ON DELETE RESTRICT,
  status TEXT NOT NULL,
  channel TEXT NOT NULL,
  privacy_notice_version TEXT NOT NULL,
  terms_version TEXT NOT NULL,
  consented_at TIMESTAMPTZ NOT NULL,
  enrolled_at TIMESTAMPTZ,
  withdrawn_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zero_beta_participant_status CHECK (status IN ('INVITED','ENROLLED','ACTIVE','SUSPENDED','REVOKED','WITHDRAWN')),
  CONSTRAINT zero_beta_participant_channel CHECK (channel IN ('CONTROLLED_BETA','INTERNAL'))
);

CREATE UNIQUE INDEX IF NOT EXISTS zero_beta_participant_account_channel_idx
  ON zero_beta_participants(account_id, channel);

CREATE TABLE IF NOT EXISTS zero_beta_feedback (
  id UUID PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES zero_beta_participants(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  body TEXT NOT NULL,
  contains_private_content BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zero_beta_feedback_category CHECK (category IN ('BUG','PERFORMANCE','ACCESSIBILITY','USABILITY','PRIVACY','SECURITY','OTHER'))
);

CREATE TABLE IF NOT EXISTS zero_beta_gate_evidence (
  id UUID PRIMARY KEY,
  known_critical_findings INTEGER NOT NULL DEFAULT 0,
  emergency_rollback_ready BOOLEAN NOT NULL DEFAULT FALSE,
  kill_switch_ready BOOLEAN NOT NULL DEFAULT FALSE,
  backup_recovery_verified BOOLEAN NOT NULL DEFAULT FALSE,
  privacy_notice_published BOOLEAN NOT NULL DEFAULT FALSE,
  support_path_ready BOOLEAN NOT NULL DEFAULT FALSE,
  security_reporting_path_ready BOOLEAN NOT NULL DEFAULT FALSE,
  telemetry_content_free BOOLEAN NOT NULL DEFAULT FALSE,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS zero_beta_participants_status_idx
  ON zero_beta_participants(channel, status);

CREATE INDEX IF NOT EXISTS zero_beta_feedback_participant_idx
  ON zero_beta_feedback(participant_id, created_at);
