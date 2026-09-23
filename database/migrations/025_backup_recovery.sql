CREATE TABLE IF NOT EXISTS zero_encrypted_backups (
id UUID PRIMARY KEY, account_id UUID NOT NULL REFERENCES zero_accounts(id) ON DELETE CASCADE,
device_id UUID NOT NULL REFERENCES zero_devices(id) ON DELETE CASCADE, state TEXT NOT NULL,
key_version INTEGER NOT NULL CHECK (key_version > 0), ciphertext_digest BYTEA NOT NULL CHECK (octet_length(ciphertext_digest)=32),
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), revoked_at TIMESTAMPTZ, destroyed_at TIMESTAMPTZ,
CONSTRAINT zero_backup_state CHECK (state IN ('CREATED','ACTIVE','REVOKED','DESTROYED')));
CREATE TABLE IF NOT EXISTS zero_recovery_requests (
id UUID PRIMARY KEY, account_id UUID NOT NULL REFERENCES zero_accounts(id) ON DELETE CASCADE,
level TEXT NOT NULL, state TEXT NOT NULL, expires_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), completed_at TIMESTAMPTZ,
CONSTRAINT zero_recovery_level CHECK (level IN ('STANDARD','ENHANCED','EMERGENCY')),
CONSTRAINT zero_recovery_state CHECK (state IN ('IDLE','PENDING','VERIFIED','COMPLETED','REVOKED')));
CREATE TABLE IF NOT EXISTS zero_trusted_contacts (
id UUID PRIMARY KEY, account_id UUID NOT NULL REFERENCES zero_accounts(id) ON DELETE CASCADE,
contact_account_id UUID NOT NULL REFERENCES zero_accounts(id) ON DELETE CASCADE, state TEXT NOT NULL,
verification_digest BYTEA, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), verified_at TIMESTAMPTZ, revoked_at TIMESTAMPTZ,
CONSTRAINT zero_trusted_contact_state CHECK (state IN ('PENDING','VERIFIED','REVOKED')),
CONSTRAINT zero_trusted_contact_not_self CHECK (account_id <> contact_account_id), UNIQUE(account_id,contact_account_id));
CREATE INDEX IF NOT EXISTS zero_backup_account_idx ON zero_encrypted_backups(account_id,created_at);
CREATE INDEX IF NOT EXISTS zero_recovery_account_idx ON zero_recovery_requests(account_id,created_at);
