CREATE TABLE IF NOT EXISTS zero_infrastructure_controls (
id UUID PRIMARY KEY, control_code TEXT NOT NULL, environment TEXT NOT NULL, state TEXT NOT NULL,
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), exception_reason TEXT, expires_at TIMESTAMPTZ,
CONSTRAINT zero_infra_environment CHECK (environment IN ('DEVELOPMENT','STAGING','PRODUCTION')),
CONSTRAINT zero_infra_state CHECK (state IN ('REQUIRED','ENFORCED','EXCEPTION')),
CONSTRAINT zero_infra_control_code CHECK (control_code ~ '^[A-Z0-9_]{3,64}$'),
CONSTRAINT zero_infra_exception_reason CHECK ((state='EXCEPTION' AND exception_reason IS NOT NULL) OR state<>'EXCEPTION'));
CREATE TABLE IF NOT EXISTS zero_security_audit_events (
id UUID PRIMARY KEY, service_code TEXT NOT NULL, event_code TEXT NOT NULL, severity TEXT NOT NULL,
environment TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
CONSTRAINT zero_security_audit_severity CHECK (severity IN ('INFO','WARNING','CRITICAL')),
CONSTRAINT zero_security_audit_environment CHECK (environment IN ('DEVELOPMENT','STAGING','PRODUCTION')));
CREATE INDEX IF NOT EXISTS zero_infra_controls_env_idx ON zero_infrastructure_controls(environment,state);
CREATE INDEX IF NOT EXISTS zero_security_audit_events_idx ON zero_security_audit_events(environment,created_at);
