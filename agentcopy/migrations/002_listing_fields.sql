-- Migration 002: Listing fields update
-- Adds:
--   1. Structured address columns to the generations table (via form_data JSONB — no DDL needed)
--   2. A standalone listings table for future dedicated listing management
--   3. Credits column type changed to DECIMAL to support 0.5-credit increments

-- ─── 1. Credits: support fractional amounts (0.5 per additional output channel) ───
ALTER TABLE users
  ALTER COLUMN credits TYPE DECIMAL(10,1) USING credits::DECIMAL(10,1);

-- ─── 2. Listings table ────────────────────────────────────────────────────────────
-- A normalised listing record. Linked to a generation and the creating user.
-- Structured address replaces the previous single-string field.
CREATE TABLE IF NOT EXISTS listings (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  generation_id   UUID        REFERENCES generations(id) ON DELETE SET NULL,

  -- Structured address (NZ Post / Addressfinder output)
  street_no       TEXT,
  street_name     TEXT        NOT NULL,
  suburb          TEXT        NOT NULL,
  city_town       TEXT        NOT NULL,

  -- Property specs
  bedrooms        SMALLINT,
  bathrooms       SMALLINT,
  garage          TEXT,
  section_size    DECIMAL(10,2),   -- m²
  floor_area      DECIMAL(10,2),   -- m² — added per spec
  title_type      TEXT,

  -- Sale method
  sale_method     TEXT        NOT NULL,
  sale_date       DATE,
  sale_time       TIME,
  sale_location   TEXT,

  -- Viewing
  viewing_type    TEXT,            -- 'By Appointment' | 'Open Home'
  open_home_date  DATE,
  open_home_time  TIME,

  -- Marketing content
  price_guide     TEXT,
  hero_features   TEXT,
  outdoor_living  TEXT,
  location_highlights TEXT,
  vibe            TEXT,

  -- Output channels (comma-separated: 'Open2view', 'Company Website', 'Newspaper')
  output_channels TEXT[],

  -- Generated copy (mirrors generations.output_text for convenience)
  output_text     TEXT,

  -- Metadata
  track           TEXT        NOT NULL DEFAULT 'residential',  -- 'residential' | 'commercial'
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Keep updated_at current automatically
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS listings_updated_at ON listings;
CREATE TRIGGER listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS listings_user_id_idx       ON listings(user_id);
CREATE INDEX IF NOT EXISTS listings_generation_id_idx  ON listings(generation_id);
CREATE INDEX IF NOT EXISTS listings_created_at_idx     ON listings(created_at DESC);
CREATE INDEX IF NOT EXISTS listings_output_channels_idx ON listings USING gin(output_channels);
