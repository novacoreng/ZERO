CREATE TABLE IF NOT EXISTS zero_call_sessions (
id UUID PRIMARY KEY, conversation_id UUID NOT NULL, caller_device_id UUID NOT NULL REFERENCES zero_devices(id),
callee_device_id UUID NOT NULL REFERENCES zero_devices(id), kind TEXT NOT NULL, state TEXT NOT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), expires_at TIMESTAMPTZ NOT NULL, ended_at TIMESTAMPTZ,
end_reason TEXT,
CONSTRAINT zero_call_kind CHECK (kind IN ('AUDIO','VIDEO')),
CONSTRAINT zero_call_state CHECK (state IN ('OFFERED','RINGING','CONNECTING','CONNECTED','RECONNECTING','ENDED','MISSED','REJECTED','FAILED')),
CONSTRAINT zero_call_reason CHECK (end_reason IS NULL OR end_reason IN ('COMPLETED','DECLINED','TIMEOUT','NETWORK_FAILURE','REVOKED','EXPIRED','USER_ENDED')));
CREATE TABLE IF NOT EXISTS zero_call_events (
id UUID PRIMARY KEY, call_id UUID NOT NULL REFERENCES zero_call_sessions(id) ON DELETE CASCADE,
event_code TEXT NOT NULL, device_id UUID REFERENCES zero_devices(id), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE INDEX IF NOT EXISTS zero_call_sessions_callee_idx ON zero_call_sessions(callee_device_id,created_at);
CREATE INDEX IF NOT EXISTS zero_call_events_call_idx ON zero_call_events(call_id,created_at);
