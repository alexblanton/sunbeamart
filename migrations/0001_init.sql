-- Sunbeam Art House schema. Money is in cents; timestamps are UTC ISO strings.
-- Camps and events are one thing: the events table, split by category.

CREATE TABLE events (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'camps_events' CHECK (category IN ('camps_events', 'art_parties')),
  kind TEXT NOT NULL,
  season TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  dates TEXT NOT NULL DEFAULT '',
  time_text TEXT NOT NULL DEFAULT '',
  ages TEXT NOT NULL DEFAULT '',
  price_cents INTEGER NOT NULL DEFAULT 0,
  capacity INTEGER NOT NULL DEFAULT 1,
  sibling_discount_pct INTEGER NOT NULL DEFAULT 0,
  blurb TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  image_pos TEXT NOT NULL DEFAULT '50% 40%',
  published INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE registrations (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'expired', 'refunded')),
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT NOT NULL DEFAULT '',
  emergency_name TEXT NOT NULL DEFAULT '',
  emergency_phone TEXT NOT NULL DEFAULT '',
  pickup TEXT NOT NULL DEFAULT '',
  text_opt_in INTEGER NOT NULL DEFAULT 0,
  photo_consent TEXT NOT NULL DEFAULT '',
  waiver_signed_at TEXT,
  total_cents INTEGER NOT NULL,
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  hold_expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX registrations_event ON registrations(event_id, status);

CREATE TABLE campers (
  id TEXT PRIMARY KEY,
  registration_id TEXT NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  first TEXT NOT NULL,
  last TEXT NOT NULL,
  age TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  position INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX campers_registration ON campers(registration_id);

CREATE TABLE inquiries (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('message', 'party_request')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  done INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE email_templates (
  key TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  send_offset_hours INTEGER
);

CREATE TABLE email_log (
  id TEXT PRIMARY KEY,
  registration_id TEXT REFERENCES registrations(id),
  template_key TEXT NOT NULL,
  sent_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  provider_id TEXT,
  UNIQUE (registration_id, template_key)
);

CREATE TABLE stripe_events (
  event_id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  received_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
