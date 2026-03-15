-- Run this in your Neon SQL editor to create the listings table

CREATE TABLE IF NOT EXISTS business_listings (
  id            SERIAL PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),

  -- Plan
  plan          TEXT NOT NULL DEFAULT 'free',   -- 'free' | 'featured'
  status        TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'active' | 'rejected'

  -- Business info
  name          TEXT NOT NULL,
  category      TEXT NOT NULL,
  description   TEXT,
  special_offer TEXT,

  -- Contact
  phone         TEXT,
  website       TEXT,
  email         TEXT NOT NULL,

  -- Location
  address       TEXT NOT NULL,
  neighborhood  TEXT,

  -- Hours (stored as JSON)
  hours         JSONB,

  -- Photo
  photo_url     TEXT,

  -- Stripe
  stripe_session_id    TEXT,
  stripe_payment_intent TEXT,
  stripe_paid          BOOLEAN DEFAULT FALSE,

  -- Internal notes
  notes         TEXT
);

CREATE INDEX IF NOT EXISTS idx_listings_status ON business_listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_plan   ON business_listings(plan);
CREATE INDEX IF NOT EXISTS idx_listings_email  ON business_listings(email);
