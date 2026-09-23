CREATE TABLE IF NOT EXISTS zero_dr_backups (
id UUID PRIMARY KEY, tier TEXT NOT NULL, backup_reference TEXT NOT NULL, integrity_state TEXT NOT NULL,
region TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), verified_at TIMESTAMPTZ,
expires_at TIMESTAMPTZ NOT NULL,
CONSTRAINT zero_dr_tier CHECK (tier IN ('DATABASE','OBJECT_STORAGE','KEY_METADATA','SERVICE_CONFIG')),
CONSTRAINT zero_dr_integrity CHECK (integrity_state IN ('PENDING','VERIFIED','CORRUPTED','EXPIRED')));
CREATE TABLE IF NOT EXISTS zero_dr_recovery_tests (
id UUID PRIMARY KEY, backup_id UUID NOT NULL REFERENCES zero_dr_backups(id) ON DELETE RESTRICT,
state TEXT NOT NULL, started_at TIMESTAMPTZ, completed_at TIMESTAMPTZ, result_digest BYTEA,
CONSTRAINT zero_dr_test_state CHECK (state IN ('PLANNED','RUNNING','PASSED','FAILED')));
CREATE TABLE IF NOT EXISTS zero_dr_incidents (
id UUID PRIMARY KEY, severity TEXT NOT NULL, state TEXT NOT NULL, started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
resolved_at TIMESTAMPTZ, recovery_reference TEXT,
CONSTRAINT zero_dr_incident_severity CHECK (severity IN ('SEV1','SEV2','SEV3','SEV4')),
CONSTRAINT zero_dr_incident_state CHECK (state IN ('OPEN','RECOVERING','RESOLVED')));
CREATE INDEX IF NOT EXISTS zero_dr_backups_tier_idx ON zero_dr_backups(tier,region,created_at);
CREATE INDEX IF NOT EXISTS zero_dr_tests_backup_idx ON zero_dr_recovery_tests(backup_id,state);
