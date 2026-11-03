-- ============================================================
-- Rosestar Farm App — Supabase PostgreSQL Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- BATCHES (Flock settings / batch info)
-- ============================================================
create table if not exists batches (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null default 'My Broiler Batch',
  date        date,                         -- chick arrival date
  birds       integer not null default 500, -- initial chick count
  breed       text default 'Cobb 500',
  supplier    text,
  chick_cost  numeric(12,2) default 0,      -- total cost of buying chicks
  target_age  integer default 42,           -- target harvest age in days
  target_weight integer default 2500,       -- target body weight in grams
  notes       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ============================================================
-- WEIGHTS (Flock weight sampling records)
-- ============================================================
create table if not exists weights (
  id          uuid primary key default uuid_generate_v4(),
  batch_id    uuid references batches(id) on delete cascade,
  date        date not null,
  sample      integer not null default 50,  -- number of birds sampled
  avg         numeric(8,2) not null,        -- average weight in grams
  min         numeric(8,2),                 -- min weight in grams
  max         numeric(8,2),                 -- max weight in grams
  notes       text,
  created_at  timestamptz default now()
);

-- ============================================================
-- FEEDS (Feed purchases and daily consumption)
-- ============================================================
create table if not exists feeds (
  id          uuid primary key default uuid_generate_v4(),
  batch_id    uuid references batches(id) on delete cascade,
  date        date not null,
  type        text not null check (type in ('purchase', 'consumption')),
  category    text not null default 'Starter',  -- Starter / Grower / Finisher / Other
  qty         numeric(10,2) not null,            -- kilograms
  cost        numeric(12,2) default 0,           -- only for purchases
  notes       text,
  created_at  timestamptz default now()
);

-- ============================================================
-- HEALTH (Vaccinations, treatments, preventive events)
-- ============================================================
create table if not exists health_events (
  id          uuid primary key default uuid_generate_v4(),
  batch_id    uuid references batches(id) on delete cascade,
  name        text not null,
  date        date not null,
  type        text default 'Vaccination',    -- Vaccination / Treatment / Medication
  method      text,                          -- Spray / Drinking water / Injection
  status      text default 'Pending' check (status in ('Pending', 'Completed')),
  notes       text,
  created_at  timestamptz default now()
);

-- ============================================================
-- DEATHS (Daily mortality records)
-- ============================================================
create table if not exists deaths (
  id          uuid primary key default uuid_generate_v4(),
  batch_id    uuid references batches(id) on delete cascade,
  date        date not null,
  qty         integer not null default 1,
  cause       text default 'Unspecified',
  created_at  timestamptz default now()
);

-- ============================================================
-- FINANCES (Expenses and sales)
-- ============================================================
create table if not exists finances (
  id          uuid primary key default uuid_generate_v4(),
  batch_id    uuid references batches(id) on delete cascade,
  date        date not null,
  type        text not null check (type in ('Expense', 'Sale')),
  description text,
  amount      numeric(12,2) not null,
  qty         integer,        -- for sales: number of birds sold
  weight      numeric(8,2),   -- for sales: avg weight per bird (kg)
  created_at  timestamptz default now()
);

-- ============================================================
-- Indexes for query performance
-- ============================================================
create index if not exists idx_weights_batch   on weights(batch_id, date);
create index if not exists idx_feeds_batch     on feeds(batch_id, date);
create index if not exists idx_health_batch    on health_events(batch_id, date);
create index if not exists idx_deaths_batch    on deaths(batch_id, date);
create index if not exists idx_finances_batch  on finances(batch_id, date);

-- ============================================================
-- Row Level Security (RLS) — disable for now, enable after adding auth
-- ============================================================
alter table batches       disable row level security;
alter table weights       disable row level security;
alter table feeds         disable row level security;
alter table health_events disable row level security;
alter table deaths        disable row level security;
alter table finances      disable row level security;

-- ============================================================
-- VACCINATION REFERENCE GUIDE TABLES
-- ============================================================
create table if not exists vaccine_guide (
  id           text primary key,
  flock_types  text[] not null,
  timing       text not null,
  day_offset   integer not null default 1,
  vaccine      text not null,
  protects     text,
  method       text,
  method_note  text,
  mandatory    boolean default false,
  created_at   timestamptz default now()
);

create table if not exists method_glossary (
  id         text primary key,
  label      text not null,
  icon       text,
  plain      text not null,
  created_at timestamptz default now()
);

create table if not exists flock_type_defs (
  id          text primary key,
  label       text not null,
  icon        text,
  description text,
  colour      text,
  created_at  timestamptz default now()
);

create table if not exists auto_schedule (
  id               uuid primary key default gen_random_uuid(),
  flock_type       text not null,
  vaccine_guide_id text references vaccine_guide(id) on delete cascade,
  sort_order       integer not null default 0,
  created_at       timestamptz default now()
);

create index if not exists idx_vaccine_guide_flock on vaccine_guide using gin(flock_types);
create index if not exists idx_auto_schedule_type  on auto_schedule(flock_type, sort_order);

alter table vaccine_guide   disable row level security;
alter table method_glossary disable row level security;
alter table flock_type_defs disable row level security;
alter table auto_schedule   disable row level security;

