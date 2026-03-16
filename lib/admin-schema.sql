-- Run this in your Neon SQL editor

-- Restaurant hours and status
CREATE TABLE IF NOT EXISTS restaurants (
  id           SERIAL PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  name         TEXT NOT NULL,
  category     TEXT,
  price        TEXT,
  description  TEXT,
  special_offer TEXT,
  phone        TEXT,
  website      TEXT,
  address      TEXT,
  hours        JSONB,  -- { monday: { open: '11:00', close: '22:00', closed: false }, ... }
  status_override TEXT, -- 'open' | 'closed' | null (null = auto from hours)
  stars        NUMERIC(2,1),
  photo_url    TEXT,
  sponsored    BOOLEAN DEFAULT FALSE,
  featured     BOOLEAN DEFAULT FALSE,
  active       BOOLEAN DEFAULT TRUE,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Beach condition overrides
CREATE TABLE IF NOT EXISTS beach_overrides (
  id          SERIAL PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  condition   TEXT,        -- 'great' | 'good' | 'busy' | 'rough' | null (null = auto)
  note_es     TEXT,
  note_en     TEXT,
  override_until TIMESTAMPTZ, -- auto-expires override
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Events (tonight page)
CREATE TABLE IF NOT EXISTS events (
  id          SERIAL PRIMARY KEY,
  date        DATE NOT NULL,
  time        TEXT NOT NULL,        -- '7:30'
  ampm        TEXT NOT NULL,        -- 'pm'
  name_es     TEXT NOT NULL,
  name_en     TEXT NOT NULL,
  where_es    TEXT,
  where_en    TEXT,
  desc_es     TEXT,
  desc_en     TEXT,
  category    TEXT DEFAULT 'music', -- music | food | nature | nightlife | family | deal
  type        TEXT DEFAULT 'free',  -- free | featured | sponsored
  label_es    TEXT DEFAULT 'Gratis',
  label_en    TEXT DEFAULT 'Free',
  recurs      TEXT,                 -- 'Todos los sábados'
  recurs_en   TEXT,                 -- 'Every Saturday'
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Ticker custom message
CREATE TABLE IF NOT EXISTS site_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Map pin visibility
CREATE TABLE IF NOT EXISTS map_pin_overrides (
  id         SERIAL PRIMARY KEY,
  pin_id     TEXT UNIQUE NOT NULL,
  visible    BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_date     ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_active   ON events(active);
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON restaurants(slug);

-- Default site settings
INSERT INTO site_settings (key, value) VALUES
  ('ticker_custom_es', ''),
  ('ticker_custom_en', ''),
  ('admin_password', 'pacaborojo2024')
ON CONFLICT (key) DO NOTHING;
