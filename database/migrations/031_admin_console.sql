CREATE TABLE IF NOT EXISTS zero_admin_identities (
id UUID PRIMARY KEY, account_id UUID NOT NULL REFERENCES zero_accounts(id) ON DELETE CASCADE,
role TEXT NOT NULL, active BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
CONSTRAINT zero_admin_role CHECK (role IN ('SUPER_ADMIN','SECURITY_ADMIN','TRUST_SAFETY_ADMIN','SUPPORT_ADMIN','AUDITOR')));
CREATE TABLE IF NOT EXISTS zero_admin_audit_events (
id UUID PRIMARY KEY, admin_id UUID NOT NULL REFERENCES zero_admin_identities(id) ON DELETE RESTRICT,
role TEXT NOT NULL, action TEXT NOT NULL, target_type TEXT NOT NULL, target_id UUID,
state TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
CONSTRAINT zero_admin_audit_state CHECK (state IN ('REQUESTED','AUTHORIZED','EXECUTED','DENIED')));
CREATE TABLE IF NOT EXISTS zero_admin_action_requests (
id UUID PRIMARY KEY, admin_id UUID NOT NULL REFERENCES zero_admin_identities(id) ON DELETE RESTRICT,
action TEXT NOT NULL, target_type TEXT NOT NULL, target_id UUID, reason TEXT NOT NULL,
state TEXT NOT NULL DEFAULT 'REQUESTED', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
CONSTRAINT zero_admin_request_state CHECK (state IN ('REQUESTED','AUTHORIZED','EXECUTED','DENIED')));
CREATE INDEX IF NOT EXISTS zero_admin_audit_idx ON zero_admin_audit_events(admin_id,created_at);
CREATE INDEX IF NOT EXISTS zero_admin_requests_idx ON zero_admin_action_requests(state,created_at);
