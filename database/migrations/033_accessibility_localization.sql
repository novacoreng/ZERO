CREATE TABLE IF NOT EXISTS zero_accessibility_preferences (
account_id UUID PRIMARY KEY REFERENCES zero_accounts(id) ON DELETE CASCADE,
locale TEXT NOT NULL DEFAULT 'en-US', reduced_motion BOOLEAN NOT NULL DEFAULT FALSE,
large_text BOOLEAN NOT NULL DEFAULT FALSE, high_contrast BOOLEAN NOT NULL DEFAULT FALSE,
screen_reader_hints BOOLEAN NOT NULL DEFAULT TRUE, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
CONSTRAINT zero_accessibility_locale CHECK (locale ~ '^[a-z]{2}(?:-[A-Z]{2})?$'));
CREATE TABLE IF NOT EXISTS zero_localization_preferences (
account_id UUID PRIMARY KEY REFERENCES zero_accounts(id) ON DELETE CASCADE,
locale TEXT NOT NULL DEFAULT 'en-US', updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
CONSTRAINT zero_localization_locale CHECK (locale ~ '^[a-z]{2}(?:-[A-Z]{2})?$'));
