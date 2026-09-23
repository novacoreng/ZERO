CREATE TABLE IF NOT EXISTS zero_security_disclosures (
  id UUID PRIMARY KEY,
  advisory_id TEXT NOT NULL UNIQUE,
  severity TEXT NOT NULL,
  status TEXT NOT NULL,
  affected_component TEXT NOT NULL,
  reporter_digest TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  evidence_ref TEXT,
  CONSTRAINT zero_security_disclosure_severity CHECK (severity IN ('LOW','MEDIUM','HIGH','CRITICAL')),
  CONSTRAINT zero_security_disclosure_status CHECK (
    status IN ('RECEIVED','TRIAGED','ACKNOWLEDGED','REMEDIATION','RETEST','RESOLVED','CLOSED')
  )
);

CREATE TABLE IF NOT EXISTS zero_public_security_evidence (
  id UUID PRIMARY KEY,
  security_contact_published BOOLEAN NOT NULL DEFAULT FALSE,
  vulnerability_policy_published BOOLEAN NOT NULL DEFAULT FALSE,
  security_architecture_published BOOLEAN NOT NULL DEFAULT FALSE,
  privacy_architecture_published BOOLEAN NOT NULL DEFAULT FALSE,
  transparency_page_published BOOLEAN NOT NULL DEFAULT FALSE,
  advisory_process_operational BOOLEAN NOT NULL DEFAULT FALSE,
  security_update_process_operational BOOLEAN NOT NULL DEFAULT FALSE,
  release_evidence_available BOOLEAN NOT NULL DEFAULT FALSE,
  unresolved_critical_public_claim BOOLEAN NOT NULL DEFAULT FALSE,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS zero_security_disclosures_status_idx
  ON zero_security_disclosures(status, severity, received_at);
