-- ZERO Phase 6: 1-to-1 E2EE session metadata.
-- This schema contains routing/session metadata only. It must never contain plaintext messages or private keys.
CREATE TABLE IF NOT EXISTS zero_e2ee_sessions (
  id UUID PRIMARY KEY,
  local_device_id UUID NOT NULL REFERENCES zero_devices(id) ON DELETE CASCADE,
  remote_device_id UUID NOT NULL REFERENCES zero_devices(id) ON DELETE CASCADE,
  protocol_profile TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  established_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  CONSTRAINT zero_e2ee_sessions_profile CHECK (protocol_profile IN ('zero.msg.v1')),
  CONSTRAINT zero_e2ee_sessions_state CHECK (state IN ('PENDING','ESTABLISHED','PAUSED','REVOKED','DESTROYED')),
  CONSTRAINT zero_e2ee_sessions_devices_distinct CHECK (local_device_id <> remote_device_id)
);
CREATE UNIQUE INDEX IF NOT EXISTS zero_e2ee_sessions_pair_active_idx ON zero_e2ee_sessions(local_device_id, remote_device_id) WHERE state IN ('PENDING','ESTABLISHED','PAUSED');
CREATE INDEX IF NOT EXISTS zero_e2ee_sessions_local_idx ON zero_e2ee_sessions(local_device_id, state);
CREATE INDEX IF NOT EXISTS zero_e2ee_sessions_remote_idx ON zero_e2ee_sessions(remote_device_id, state);

CREATE TABLE IF NOT EXISTS zero_prekey_inventory (
  id UUID PRIMARY KEY,
  device_id UUID NOT NULL REFERENCES zero_devices(id) ON DELETE CASCADE,
  key_type TEXT NOT NULL,
  key_id BIGINT NOT NULL,
  public_key BYTEA NOT NULL,
  signature BYTEA,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zero_prekey_inventory_type CHECK (key_type IN ('SIGNED','ONE_TIME','PQ_SIGNED'))
);
CREATE UNIQUE INDEX IF NOT EXISTS zero_prekey_inventory_device_key_idx ON zero_prekey_inventory(device_id, key_type, key_id);
CREATE INDEX IF NOT EXISTS zero_prekey_inventory_available_idx ON zero_prekey_inventory(device_id, key_type) WHERE consumed_at IS NULL;
