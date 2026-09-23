CREATE TABLE IF NOT EXISTS zero_production_launch_evidence (
  id UUID PRIMARY KEY,
  release_sha TEXT NOT NULL,
  artifact_digest TEXT NOT NULL,
  independent_crypto_audit_completed BOOLEAN NOT NULL DEFAULT FALSE,
  external_penetration_test_completed BOOLEAN NOT NULL DEFAULT FALSE,
  security_findings_resolved BOOLEAN NOT NULL DEFAULT FALSE,
  production_cloud_controls_verified BOOLEAN NOT NULL DEFAULT FALSE,
  dependency_review_completed BOOLEAN NOT NULL DEFAULT FALSE,
  browser_device_validation_completed BOOLEAN NOT NULL DEFAULT FALSE,
  production_load_evidence_completed BOOLEAN NOT NULL DEFAULT FALSE,
  disaster_recovery_exercise_completed BOOLEAN NOT NULL DEFAULT FALSE,
  backup_restore_verified BOOLEAN NOT NULL DEFAULT FALSE,
  rollback_verified BOOLEAN NOT NULL DEFAULT FALSE,
  privacy_legal_review_completed BOOLEAN NOT NULL DEFAULT FALSE,
  accessibility_validation_completed BOOLEAN NOT NULL DEFAULT FALSE,
  operational_support_ready BOOLEAN NOT NULL DEFAULT FALSE,
  security_disclosure_ready BOOLEAN NOT NULL DEFAULT FALSE,
  incident_response_ready BOOLEAN NOT NULL DEFAULT FALSE,
  monitoring_ready BOOLEAN NOT NULL DEFAULT FALSE,
  migration_review_completed BOOLEAN NOT NULL DEFAULT FALSE,
  release_artifact_verified BOOLEAN NOT NULL DEFAULT FALSE,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS zero_production_launch_events (
  id UUID PRIMARY KEY,
  launch_evidence_id UUID NOT NULL REFERENCES zero_production_launch_evidence(id) ON DELETE RESTRICT,
  event_type TEXT NOT NULL,
  actor_id UUID,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  details_digest TEXT,
  CONSTRAINT zero_production_launch_event_type CHECK (
    event_type IN ('READINESS_REVIEWED','LAUNCH_BLOCKED','LAUNCH_APPROVED','PRODUCTION_DEPLOYED','ROLLBACK_EXECUTED','LAUNCH_SUSPENDED')
  )
);

CREATE INDEX IF NOT EXISTS zero_production_launch_evidence_captured_idx
  ON zero_production_launch_evidence(captured_at DESC);
