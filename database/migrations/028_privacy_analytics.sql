CREATE TABLE IF NOT EXISTS zero_analytics_aggregates (
id UUID PRIMARY KEY, purpose TEXT NOT NULL, event_code TEXT NOT NULL, bucket TEXT NOT NULL,
count INTEGER NOT NULL CHECK (count >= 10), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
retention_until TIMESTAMPTZ NOT NULL,
CONSTRAINT zero_analytics_purpose CHECK (purpose IN ('RELIABILITY','SECURITY','ABUSE_PREVENTION','PRODUCT_USAGE')));
CREATE TABLE IF NOT EXISTS zero_analytics_preferences (
account_id UUID PRIMARY KEY REFERENCES zero_accounts(id) ON DELETE CASCADE,
usage_mode TEXT NOT NULL DEFAULT 'DISABLED', updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
CONSTRAINT zero_analytics_usage_mode CHECK (usage_mode IN ('OPTIONAL','DISABLED')));
CREATE INDEX IF NOT EXISTS zero_analytics_bucket_idx ON zero_analytics_aggregates(purpose,bucket);
