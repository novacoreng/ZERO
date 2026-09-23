CREATE TABLE IF NOT EXISTS zero_security_test_runs (
id UUID PRIMARY KEY, suite_code TEXT NOT NULL, state TEXT NOT NULL, started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
completed_at TIMESTAMPTZ, commit_ref TEXT, environment TEXT NOT NULL,
CONSTRAINT zero_security_test_state CHECK (state IN ('REQUIRED','PASS','FAIL','BLOCKED')),
CONSTRAINT zero_security_test_environment CHECK (environment IN ('DEVELOPMENT','STAGING','PRODUCTION')));
CREATE TABLE IF NOT EXISTS zero_security_findings (
id UUID PRIMARY KEY, run_id UUID NOT NULL REFERENCES zero_security_test_runs(id) ON DELETE CASCADE,
domain TEXT NOT NULL, severity TEXT NOT NULL, finding_code TEXT NOT NULL, resolved BOOLEAN NOT NULL DEFAULT FALSE,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), resolved_at TIMESTAMPTZ,
CONSTRAINT zero_security_finding_domain CHECK (domain IN ('AUTH','AUTHZ','CRYPTO','FILES','API','WEB','PRIVACY','ABUSE','DEPENDENCY')),
CONSTRAINT zero_security_finding_severity CHECK (severity IN ('LOW','MEDIUM','HIGH','CRITICAL')));
CREATE INDEX IF NOT EXISTS zero_security_findings_run_idx ON zero_security_findings(run_id,severity,resolved);
