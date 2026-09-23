-- ZERO Phase 22: privacy-preserving notifications.
CREATE TABLE IF NOT EXISTS zero_push_devices (
  device_id UUID PRIMARY KEY REFERENCES zero_devices(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  token_digest BYTEA NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  CONSTRAINT zero_push_provider CHECK (provider IN ('APNS','FCM','WEB_PUSH')),
  CONSTRAINT zero_push_digest CHECK (octet_length(token_digest)=32)
);
CREATE TABLE IF NOT EXISTS zero_notifications (
  id UUID PRIMARY KEY,
  device_id UUID NOT NULL REFERENCES zero_devices(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  privacy TEXT NOT NULL DEFAULT 'SENDER_ONLY',
  opaque_payload BYTEA NOT NULL,
  state TEXT NOT NULL DEFAULT 'QUEUED',
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  CONSTRAINT zero_notification_kind CHECK (kind IN ('MESSAGE_WAKE','CALL_WAKE','SECURITY_EVENT','SYSTEM')),
  CONSTRAINT zero_notification_privacy CHECK (privacy IN ('FULL','SENDER_ONLY','HIDDEN')),
  CONSTRAINT zero_notification_state CHECK (state IN ('QUEUED','SENT','DELIVERED','FAILED','EXPIRED','REVOKED')),
  CONSTRAINT zero_notification_payload CHECK (octet_length(opaque_payload) <= 4096)
);
CREATE INDEX IF NOT EXISTS zero_notifications_dispatch_idx ON zero_notifications(state,expires_at,created_at);
