-- ZERO Phase 20: local privacy policy metadata.
CREATE TABLE IF NOT EXISTS zero_local_privacy_policies (
  device_id UUID PRIMARY KEY REFERENCES zero_devices(id) ON DELETE CASCADE,
  auto_lock_seconds INTEGER NOT NULL DEFAULT 300,
  lock_on_background BOOLEAN NOT NULL DEFAULT TRUE,
  lock_on_device_change BOOLEAN NOT NULL DEFAULT TRUE,
  clipboard_clear_seconds INTEGER NOT NULL DEFAULT 30,
  screenshot_protection_requested BOOLEAN NOT NULL DEFAULT TRUE,
  panic_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zero_local_auto_lock CHECK (auto_lock_seconds >= 15 AND auto_lock_seconds <= 86400),
  CONSTRAINT zero_local_clipboard CHECK (clipboard_clear_seconds >= 0 AND clipboard_clear_seconds <= 3600)
);
