-- ============================================================
-- Rosestar Farm App — Vaccine Guide Tables
-- Run AFTER schema.sql in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================
-- Creates 4 tables:
--   vaccine_guide        — the master vaccination reference entries
--   method_glossary      — plain-language explanation of each method
--   flock_type_defs      — broiler / layer / indigenous definitions
--   auto_schedule        — which vaccines auto-load per flock type
-- ============================================================

-- ── vaccine_guide ─────────────────────────────────────────────────────────────
create table if not exists vaccine_guide (
  id           text primary key,              -- e.g. 'mareks-d1'
  flock_types  text[] not null,               -- e.g. '{broiler,layer,indigenous}'
  timing       text not null,                 -- e.g. 'Day 1', 'Week 6–8'
  day_offset   integer not null default 1,    -- earliest day from hatch
  vaccine      text not null,                 -- vaccine name
  protects     text,                          -- plain-language protection desc
  method       text,                          -- key into method_glossary
  method_note  text,                          -- extra practical instructions
  mandatory    boolean default false,
  created_at   timestamptz default now()
);

-- ── method_glossary ───────────────────────────────────────────────────────────
create table if not exists method_glossary (
  id    text primary key,   -- e.g. 'sc', 'drinking_water'
  label text not null,
  icon  text,
  plain text not null,
  created_at timestamptz default now()
);

-- ── flock_type_defs ───────────────────────────────────────────────────────────
create table if not exists flock_type_defs (
  id          text primary key,   -- 'broiler' | 'layer' | 'indigenous'
  label       text not null,
  icon        text,
  description text,
  colour      text,
  created_at  timestamptz default now()
);

-- ── auto_schedule ─────────────────────────────────────────────────────────────
create table if not exists auto_schedule (
  id               uuid primary key default uuid_generate_v4(),
  flock_type       text not null,
  vaccine_guide_id text references vaccine_guide(id) on delete cascade,
  sort_order       integer not null default 0,
  created_at       timestamptz default now()
);

create index if not exists idx_vaccine_guide_flock on vaccine_guide using gin(flock_types);
create index if not exists idx_auto_schedule_type  on auto_schedule(flock_type, sort_order);

-- Disable RLS (enable after adding auth)
alter table vaccine_guide   disable row level security;
alter table method_glossary disable row level security;
alter table flock_type_defs disable row level security;
alter table auto_schedule   disable row level security;
