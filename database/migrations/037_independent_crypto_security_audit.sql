CREATE TABLE IF NOT EXISTS zero_independent_audits (
id UUID PRIMARY KEY, provider TEXT NOT NULL, status TEXT NOT NULL, scope_version TEXT NOT NULL,
started_at TIMESTAMPTZ, completed_at TIMESTAMPTZ, report_ref TEXT, evidence_ref TEXT,
CONSTRAINT zero_independent_audit_status CHECK (status IN ('PLANNED','IN_PROGRESS','FINDINGS','REMEDIATION','RETEST_REQUIRED','COMPLETED')));
CREATE TABLE IF NOT EXISTS zero_independent_audit_findings (
id UUID PRIMARY KEY, audit_id UUID NOT NULL REFERENCES zero_independent_audits(id) ON DELETE CASCADE,
domain TEXT NOT NULL, severity TEXT NOT NULL, finding_code TEXT NOT NULL, resolved BOOLEAN NOT NULL DEFAULT FALSE,
retested BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), resolved_at TIMESTAMPTZ,
CONSTRAINT zero_independent_audit_domain CHECK (domain IN ('CRYPTOGRAPHY','E2EE','KEY_MANAGEMENT','MULTI_DEVICE','FILES','RECOVERY','PROTOCOL','IMPLEMENTATION')),
CONSTRAINT zero_independent_audit_severity CHECK (severity IN ('LOW','MEDIUM','HIGH','CRITICAL')));
CREATE TABLE IF NOT EXISTS zero_independent_audit_retests (
id UUID PRIMARY KEY, finding_id UUID NOT NULL REFERENCES zero_independent_audit_findings(id) ON DELETE CASCADE,
result TEXT NOT NULL, tested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), evidence_ref TEXT,
CONSTRAINT zero_independent_audit_retest_result CHECK (result IN ('PASS','FAIL','INCONCLUSIVE')));
CREATE INDEX IF NOT EXISTS zero_independent_audit_findings_gate_idx ON zero_independent_audit_findings(audit_id,severity,resolved,retested);
