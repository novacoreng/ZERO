-- ZERO Phase 1 migration.
-- No message plaintext or cryptographic private material is stored here.
CREATE TABLE IF NOT EXISTS zero_migration_health (
  id SMALLINT PRIMARY KEY,
  phase TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zero_migration_health_phase CHECK (phase = 'phase-1')
);

INSERT INTO zero_migration_health (id, phase)
VALUES (1, 'phase-1')
ON CONFLICT (id) DO NOTHING;
