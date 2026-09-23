CREATE TABLE IF NOT EXISTS zero_pentest_engagements (
id UUID PRIMARY KEY, provider TEXT NOT NULL, status TEXT NOT NULL, scope_version TEXT NOT NULL, started_at TIMESTAMPTZ, completed_at TIMESTAMPTZ, report_ref TEXT,
CONSTRAINT zero_pentest_status CHECK (status IN ('PLANNED','IN_PROGRESS','RETEST_REQUIRED','PASSED','FAILED')));
CREATE TABLE IF NOT EXISTS zero_pentest_findings (
id UUID PRIMARY KEY, engagement_id UUID NOT NULL REFERENCES zero_pentest_engagements(id) ON DELETE CASCADE, domain TEXT NOT NULL, severity TEXT NOT NULL, title_code TEXT NOT NULL, resolved BOOLEAN NOT NULL DEFAULT FALSE, retired BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), resolved_at TIMESTAMPTZ,
CONSTRAINT zero_pentest_domain CHECK (domain IN ('AUTH','AUTHZ','E2EE','API','WEB','FILES','DATA_DROPS','CALLS','ADMIN','INFRASTRUCTURE','PRIVACY')),
CONSTRAINT zero_pentest_severity CHECK (severity IN ('LOW','MEDIUM','HIGH','CRITICAL')));
CREATE INDEX IF NOT EXISTS zero_pentest_findings_gate_idx ON zero_pentest_findings(engagement_id,severity,resolved,retired);
CREATE TABLE IF NOT EXISTS zero_pentest_retests (
id UUID PRIMARY KEY, finding_id UUID NOT NULL REFERENCES zero_pentest_findings(id) ON DELETE CASCADE, result TEXT NOT NULL, tested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), evidence_ref TEXT,
CONSTRAINT zero_pentest_retest_result CHECK (result IN ('PASS','FAIL','INCONCLUSIVE')));
