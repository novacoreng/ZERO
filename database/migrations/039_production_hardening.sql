CREATE TABLE IF NOT EXISTS zero_release_evidence (
  id UUID PRIMARY KEY,
  commit_sha TEXT NOT NULL,
  artifact_digest TEXT NOT NULL,
  environment TEXT NOT NULL,
  source_reviewed BOOLEAN NOT NULL DEFAULT FALSE,
  dependency_lock_verified BOOLEAN NOT NULL DEFAULT FALSE,
  migrations_reviewed BOOLEAN NOT NULL DEFAULT FALSE,
  secrets_scan_passed BOOLEAN NOT NULL DEFAULT FALSE,
  security_tests_passed BOOLEAN NOT NULL DEFAULT FALSE,
  backup_restore_verified BOOLEAN NOT NULL DEFAULT FALSE,
  rollback_verified BOOLEAN NOT NULL DEFAULT FALSE,
  observability_verified BOOLEAN NOT NULL DEFAULT FALSE,
  beta_exit_reviewed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zero_release_environment CHECK (environment IN ('STAGING','PRODUCTION'))
);

CREATE TABLE IF NOT EXISTS zero_hardening_findings (
  id UUID PRIMARY KEY,
  release_id UUID NOT NULL REFERENCES zero_release_evidence(id) ON DELETE CASCADE,
  control TEXT NOT NULL,
  severity TEXT NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  evidence_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  CONSTRAINT zero_hardening_severity CHECK (severity IN ('LOW','MEDIUM','HIGH','CRITICAL'))
);

CREATE INDEX IF NOT EXISTS zero_hardening_findings_gate_idx
  ON zero_hardening_findings(release_id, severity, resolved);

CREATE TABLE IF NOT EXISTS zero_deployment_events (
  id UUID PRIMARY KEY,
  release_id UUID NOT NULL REFERENCES zero_release_evidence(id) ON DELETE RESTRICT,
  event_type TEXT NOT NULL,
  actor_id UUID,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  details_digest TEXT,
  CONSTRAINT zero_deployment_event_type CHECK (
    event_type IN ('PROMOTION_REQUESTED','PROMOTED','ROLLED_BACK','KILL_SWITCH_ENABLED','KILL_SWITCH_DISABLED','MIGRATION_APPLIED')
  )
);
