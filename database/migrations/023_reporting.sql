-- ZERO Phase 24: privacy-preserving reporting.
CREATE TABLE IF NOT EXISTS zero_reports (
  id UUID PRIMARY KEY,
  reporter_account_id UUID NOT NULL REFERENCES zero_accounts(id) ON DELETE CASCADE,
  target_account_id UUID REFERENCES zero_accounts(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'SUBMITTED',
  reporter_identity_hidden BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zero_report_category CHECK (category IN ('SPAM','HARASSMENT','FRAUD','ABUSE','MALICIOUS_FILE','SECURITY','OTHER')),
  CONSTRAINT zero_report_state CHECK (state IN ('SUBMITTED','TRIAGED','UNDER_REVIEW','ACTIONED','DISMISSED','APPEALED','CLOSED'))
);
CREATE TABLE IF NOT EXISTS zero_report_evidence (
  id UUID PRIMARY KEY,
  report_id UUID NOT NULL REFERENCES zero_reports(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  encrypted_payload BYTEA NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zero_report_evidence_kind CHECK (kind IN ('USER_NOTE','MESSAGE_CIPHERTEXT','FILE_OBJECT_REF','SECURITY_METADATA'))
);
CREATE TABLE IF NOT EXISTS zero_report_actions (
  id UUID PRIMARY KEY,
  report_id UUID NOT NULL REFERENCES zero_reports(id) ON DELETE CASCADE,
  action_code TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS zero_reports_target_idx ON zero_reports(target_account_id,state,created_at);
CREATE INDEX IF NOT EXISTS zero_reports_reporter_idx ON zero_reports(reporter_account_id,created_at);
CREATE INDEX IF NOT EXISTS zero_report_evidence_report_idx ON zero_report_evidence(report_id);
