-- ZERO Phase 17: group security state. MLS cryptographic state remains client-side.
CREATE TABLE IF NOT EXISTS zero_groups (
  id UUID PRIMARY KEY,
  owner_account_id UUID NOT NULL REFERENCES zero_accounts(id) ON DELETE CASCADE,
  state TEXT NOT NULL DEFAULT 'CREATING',
  name_ciphertext BYTEA,
  current_epoch BIGINT NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zero_group_state CHECK (state IN ('CREATING','ACTIVE','PAUSED','EXPIRED','DESTROYED')),
  CONSTRAINT zero_group_epoch CHECK (current_epoch >= 0)
);
CREATE TABLE IF NOT EXISTS zero_group_members (
  group_id UUID NOT NULL REFERENCES zero_groups(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES zero_accounts(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES zero_devices(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'MEMBER',
  state TEXT NOT NULL DEFAULT 'INVITED',
  joined_at TIMESTAMPTZ,
  removed_at TIMESTAMPTZ,
  PRIMARY KEY(group_id,device_id),
  CONSTRAINT zero_group_role CHECK (role IN ('OWNER','ADMIN','MEMBER')),
  CONSTRAINT zero_group_member_state CHECK (state IN ('INVITED','ACTIVE','SUSPENDED','REMOVED'))
);
CREATE TABLE IF NOT EXISTS zero_group_epochs (
  group_id UUID NOT NULL REFERENCES zero_groups(id) ON DELETE CASCADE,
  epoch BIGINT NOT NULL,
  state TEXT NOT NULL DEFAULT 'CURRENT',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  retired_at TIMESTAMPTZ,
  PRIMARY KEY(group_id,epoch),
  CONSTRAINT zero_group_epoch_state CHECK (state IN ('CURRENT','RETIRED'))
);
CREATE INDEX IF NOT EXISTS zero_group_members_account_idx ON zero_group_members(account_id,state);
CREATE INDEX IF NOT EXISTS zero_group_epochs_current_idx ON zero_group_epochs(group_id,state);
