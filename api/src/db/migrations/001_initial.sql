-- Migration 001 — schema inicial del diario de Japón

CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- para gen_random_uuid()

-- ─── ENTRIES ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS entries (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  date               DATE        NOT NULL,
  day_number         INT,
  sort_order         INT         NOT NULL DEFAULT 0,
  title              TEXT        NOT NULL,
  body               TEXT        NOT NULL,
  location           TEXT,
  city               TEXT,
  coordinates        JSONB,
  mood               TEXT,
  tags               TEXT[]      NOT NULL DEFAULT '{}',
  status             TEXT        NOT NULL DEFAULT 'draft'
                                 CHECK (status IN ('draft', 'approved', 'published')),
  review_notes       TEXT,
  source_channel     TEXT,
  source_message_id  TEXT,
  source_timestamp   TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS entries_date_idx    ON entries (date);
CREATE INDEX IF NOT EXISTS entries_status_idx  ON entries (status);
CREATE INDEX IF NOT EXISTS entries_city_idx    ON entries (city);

-- auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER entries_updated_at
  BEFORE UPDATE ON entries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── MEDIA ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id           UUID        REFERENCES entries(id) ON DELETE SET NULL,
  type               TEXT        NOT NULL CHECK (type IN ('photo', 'video', 'audio')),
  sort_order         INT         NOT NULL DEFAULT 0,
  storage_key        TEXT        NOT NULL,
  url                TEXT        NOT NULL,
  caption            TEXT,
  width              INT,
  height             INT,
  duration_s         INT,
  mime_type          TEXT,
  size_bytes         BIGINT,
  coordinates        JSONB,
  status             TEXT        NOT NULL DEFAULT 'draft'
                                 CHECK (status IN ('draft', 'approved', 'published')),
  source_channel     TEXT,
  source_message_id  TEXT,
  source_timestamp   TIMESTAMPTZ,
  taken_at           TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS media_entry_id_idx ON media (entry_id);
CREATE INDEX IF NOT EXISTS media_status_idx   ON media (status);
CREATE INDEX IF NOT EXISTS media_type_idx     ON media (type);

-- ─── PLACES ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS places (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name               TEXT        NOT NULL,
  name_jp            TEXT,
  type               TEXT        NOT NULL DEFAULT 'other'
                                 CHECK (type IN ('restaurant','temple','park','museum','shop','other')),
  city               TEXT,
  address            TEXT,
  coordinates        JSONB,
  category           TEXT,
  rating             DECIMAL(2,1) CHECK (rating BETWEEN 1 AND 5),
  price_range        TEXT,
  description        TEXT,
  cover_media_id     UUID        REFERENCES media(id) ON DELETE SET NULL,
  visited_at         TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS places_city_idx  ON places (city);
CREATE INDEX IF NOT EXISTS places_type_idx  ON places (type);

-- ─── ENTRY ↔ PLACES ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS entry_places (
  entry_id  UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  place_id  UUID NOT NULL REFERENCES places(id)  ON DELETE CASCADE,
  PRIMARY KEY (entry_id, place_id)
);

-- ─── MIGRATIONS TRACKER ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS _migrations (
  id         SERIAL      PRIMARY KEY,
  filename   TEXT        NOT NULL UNIQUE,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
