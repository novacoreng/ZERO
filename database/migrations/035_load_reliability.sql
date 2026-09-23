CREATE TABLE IF NOT EXISTS zero_load_test_runs (
id UUID PRIMARY KEY, workload TEXT NOT NULL, state TEXT NOT NULL, started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), completed_at TIMESTAMPTZ,
commit_ref TEXT, environment TEXT NOT NULL, target_rps NUMERIC NOT NULL, concurrency INTEGER NOT NULL, max_queue_depth INTEGER NOT NULL,
CONSTRAINT zero_load_workload CHECK (workload IN ('API','MESSAGING','UPLOAD','NOTIFICATION','BACKGROUND')),
CONSTRAINT zero_load_state CHECK (state IN ('REQUIRED','PASS','FAIL','BLOCKED')),
CONSTRAINT zero_load_environment CHECK (environment IN ('DEVELOPMENT','STAGING','PRODUCTION')),
CONSTRAINT zero_load_target_rps CHECK (target_rps > 0), CONSTRAINT zero_load_concurrency CHECK (concurrency > 0), CONSTRAINT zero_load_queue CHECK (max_queue_depth > 0));
CREATE TABLE IF NOT EXISTS zero_load_metrics (
id UUID PRIMARY KEY, run_id UUID NOT NULL REFERENCES zero_load_test_runs(id) ON DELETE CASCADE,
sample_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), requests_total BIGINT NOT NULL DEFAULT 0, errors_total BIGINT NOT NULL DEFAULT 0,
latency_p50_ms NUMERIC, latency_p95_ms NUMERIC, latency_p99_ms NUMERIC, queue_depth INTEGER NOT NULL DEFAULT 0,
retry_count BIGINT NOT NULL DEFAULT 0, timeout_count BIGINT NOT NULL DEFAULT 0,
CONSTRAINT zero_load_metrics_nonnegative CHECK (requests_total >= 0 AND errors_total >= 0 AND queue_depth >= 0 AND retry_count >= 0 AND timeout_count >= 0));
CREATE TABLE IF NOT EXISTS zero_load_findings (
id UUID PRIMARY KEY, run_id UUID NOT NULL REFERENCES zero_load_test_runs(id) ON DELETE CASCADE,
severity TEXT NOT NULL, finding_code TEXT NOT NULL, resolved BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), resolved_at TIMESTAMPTZ,
CONSTRAINT zero_load_finding_severity CHECK (severity IN ('LOW','MEDIUM','HIGH','CRITICAL')));
CREATE INDEX IF NOT EXISTS zero_load_metrics_run_idx ON zero_load_metrics(run_id,sample_at);
CREATE INDEX IF NOT EXISTS zero_load_findings_run_idx ON zero_load_findings(run_id,severity,resolved);
