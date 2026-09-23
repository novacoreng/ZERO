CREATE TABLE IF NOT EXISTS zero_business_organizations (
id UUID PRIMARY KEY, account_id UUID NOT NULL REFERENCES zero_accounts(id) ON DELETE CASCADE,
legal_name TEXT NOT NULL, display_name TEXT NOT NULL, verification_state TEXT NOT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
CONSTRAINT zero_business_verification_state CHECK (verification_state IN ('PENDING','VERIFIED','SUSPENDED','REVOKED')),
CONSTRAINT zero_business_legal_name_len CHECK (char_length(legal_name) BETWEEN 2 AND 200),
CONSTRAINT zero_business_display_name_len CHECK (char_length(display_name) BETWEEN 2 AND 200),
UNIQUE(account_id));
CREATE TABLE IF NOT EXISTS zero_business_members (
id UUID PRIMARY KEY, organization_id UUID NOT NULL REFERENCES zero_business_organizations(id) ON DELETE CASCADE,
account_id UUID NOT NULL REFERENCES zero_accounts(id) ON DELETE CASCADE, role TEXT NOT NULL, state TEXT NOT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
CONSTRAINT zero_business_member_role CHECK (role IN ('OWNER','ADMIN','SECURITY_ADMIN','MEMBER','AUDITOR')),
CONSTRAINT zero_business_member_state CHECK (state IN ('INVITED','ACTIVE','SUSPENDED','REMOVED')),
UNIQUE(organization_id,account_id));
CREATE TABLE IF NOT EXISTS zero_business_policies (
id UUID PRIMARY KEY, organization_id UUID NOT NULL REFERENCES zero_business_organizations(id) ON DELETE CASCADE,
policy_code TEXT NOT NULL, state TEXT NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
CONSTRAINT zero_business_policy_state CHECK (state IN ('ACTIVE','DISABLED')),
UNIQUE(organization_id,policy_code));
CREATE INDEX IF NOT EXISTS zero_business_members_org_idx ON zero_business_members(organization_id,state);
