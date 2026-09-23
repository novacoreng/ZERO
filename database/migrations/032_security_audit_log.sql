CREATE TABLE IF NOT EXISTS zero_security_audit_log (
id UUID PRIMARY KEY, domain TEXT NOT NULL, event_code TEXT NOT NULL, severity TEXT NOT NULL,
actor_ref TEXT, target_ref TEXT, correlation_id TEXT NOT NULL, sequence BIGINT NOT NULL,
previous_digest BYTEA, event_digest BYTEA NOT NULL, retention_class TEXT NOT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
CONSTRAINT zero_audit_domain CHECK (domain IN ('AUTH','DEVICE','RECOVERY','ADMIN','ABUSE','INFRASTRUCTURE')),
CONSTRAINT zero_audit_severity CHECK (severity IN ('INFO','WARNING','CRITICAL')),
CONSTRAINT zero_audit_sequence CHECK (sequence >= 0),
CONSTRAINT zero_audit_digest CHECK (octet_length(event_digest)=32),
CONSTRAINT zero_audit_prev_digest CHECK (previous_digest IS NULL OR octet_length(previous_digest)=32));
CREATE UNIQUE INDEX IF NOT EXISTS zero_security_audit_sequence_idx ON zero_security_audit_log(correlation_id,sequence);
CREATE INDEX IF NOT EXISTS zero_security_audit_domain_idx ON zero_security_audit_log(domain,created_at);
