-- ============================================================
-- Rosestar Farm App — Broiler Disease Catalog Schema
-- Run in: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS broiler_diseases (
  id               TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  category         TEXT NOT NULL,
  severity         TEXT NOT NULL,
  severity_score   INTEGER NOT NULL DEFAULT 1,
  common_age       TEXT,
  symptoms         TEXT[] DEFAULT '{}',
  broiler_signs    TEXT[] DEFAULT '{}',
  what_to_do_now   TEXT[] DEFAULT '{}',
  prevention       TEXT[] DEFAULT '{}',
  treatment_type   TEXT,
  treatment_action TEXT,
  treatment_note   TEXT,
  emergency        BOOLEAN DEFAULT false,
  reportable       BOOLEAN DEFAULT false,
  zoonotic         BOOLEAN DEFAULT false,
  veterinarian     BOOLEAN DEFAULT true,
  keywords         TEXT[] DEFAULT '{}',
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_broiler_diseases_category ON broiler_diseases(category);
CREATE INDEX IF NOT EXISTS idx_broiler_diseases_severity ON broiler_diseases(severity);
CREATE INDEX IF NOT EXISTS idx_broiler_diseases_severity_score ON broiler_diseases(severity_score DESC);
CREATE INDEX IF NOT EXISTS idx_broiler_diseases_emergency ON broiler_diseases(emergency);
CREATE INDEX IF NOT EXISTS idx_broiler_diseases_keywords ON broiler_diseases USING gin(keywords);
CREATE INDEX IF NOT EXISTS idx_broiler_diseases_symptoms ON broiler_diseases USING gin(symptoms);

-- Row Level Security (Public Read)
ALTER TABLE broiler_diseases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on broiler_diseases" ON broiler_diseases;
CREATE POLICY "Allow public read on broiler_diseases"
  ON broiler_diseases FOR SELECT
  USING (true);
