-- ZERO Phase 18: temporary conversation state.
CREATE TABLE IF NOT EXISTS zero_temporary_conversations (
  id UUID PRIMARY KEY,
  state TEXT NOT NULL DEFAULT 'ACTIVE',
  ttl_policy TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  destroy_keys_on_expiry BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expired_at TIMESTAMPTZ,
  destroyed_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  CONSTRAINT zero_temp_conv_state CHECK (state IN ('ACTIVE','EXPIRING','EXPIRED','DESTROYING','DESTROYED','REVOKED')),
  CONSTRAINT zero_temp_conv_ttl CHECK (ttl_policy IN ('10_MINUTES','1_HOUR','6_HOURS','24_HOURS','3_DAYS','7_DAYS','CUSTOM'))
);
CREATE TABLE IF NOT EXISTS zero_temporary_conversation_members (
  conversation_id UUID NOT NULL REFERENCES zero_temporary_conversations(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES zero_accounts(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES zero_devices(id) ON DELETE CASCADE,
  state TEXT NOT NULL DEFAULT 'ACTIVE',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  removed_at TIMESTAMPTZ,
  PRIMARY KEY(conversation_id,device_id),
  CONSTRAINT zero_temp_conv_member_state CHECK (state IN ('ACTIVE','REMOVED','REVOKED'))
);
CREATE INDEX IF NOT EXISTS zero_temp_conv_expiry_idx ON zero_temporary_conversations(state,expires_at);
CREATE INDEX IF NOT EXISTS zero_temp_conv_member_account_idx ON zero_temporary_conversation_members(account_id,state);
