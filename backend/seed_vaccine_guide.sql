-- ============================================================
-- Rosestar Farm App — All-in-One Vaccine Guide Schema & Seed
-- Run in: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================
-- Self-contained: automatically creates the required tables
-- if they don't already exist, then inserts/updates the data.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. Create Tables (if not exist) ───────────────────────────

CREATE TABLE IF NOT EXISTS vaccine_guide (
  id           TEXT PRIMARY KEY,
  flock_types  TEXT[] NOT NULL,
  timing       TEXT NOT NULL,
  day_offset   INTEGER NOT NULL DEFAULT 1,
  vaccine      TEXT NOT NULL,
  protects     TEXT,
  method       TEXT,
  method_note  TEXT,
  mandatory    BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS method_glossary (
  id         TEXT PRIMARY KEY,
  label      TEXT NOT NULL,
  icon       TEXT,
  plain      TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS flock_type_defs (
  id          TEXT PRIMARY KEY,
  label       TEXT NOT NULL,
  icon        TEXT,
  description TEXT,
  colour      TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS auto_schedule (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flock_type       TEXT NOT NULL,
  vaccine_guide_id TEXT REFERENCES vaccine_guide(id) ON DELETE CASCADE,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vaccine_guide_flock ON vaccine_guide USING gin(flock_types);
CREATE INDEX IF NOT EXISTS idx_auto_schedule_type  ON auto_schedule(flock_type, sort_order);

ALTER TABLE vaccine_guide   DISABLE ROW LEVEL SECURITY;
ALTER TABLE method_glossary DISABLE ROW LEVEL SECURITY;
ALTER TABLE flock_type_defs DISABLE ROW LEVEL SECURITY;
ALTER TABLE auto_schedule   DISABLE ROW LEVEL SECURITY;


-- ── 2. Seed Data ──────────────────────────────────────────────

-- ── Flock Type Definitions ────────────────────────────────────
INSERT INTO flock_type_defs (id, label, icon, description, colour) VALUES
  ('broiler',    'Broiler (Commercial)',   'broiler', 'Fast-growing chickens raised for meat, sold at 5–7 weeks. Only core vaccines are needed.', '#6366f1'),
  ('layer',      'Layer (Egg Production)', 'layer', 'Hens raised to produce eggs for 12–18 months. Require a full extended vaccination programme.', '#f59e0b'),
  ('indigenous', 'Indigenous / Local Breed','indigenous', 'Local or traditional breeds kept for eggs and meat over longer periods. Use a simplified layer programme.', '#22c55e')
ON CONFLICT (id) DO UPDATE
  SET label       = EXCLUDED.label,
      icon        = EXCLUDED.icon,
      description = EXCLUDED.description,
      colour      = EXCLUDED.colour;


-- ── Method Glossary ───────────────────────────────────────────────────────────
INSERT INTO method_glossary (id, label, icon, plain) VALUES
  ('sc',
   'SC (Under the skin)',
   'sc',
   'A small injection is given just beneath the chicken''s skin — not into the muscle. Usually done in the loose skin on the back of the neck or the thigh. A trained farm attendant or vet should do this.'),

  ('drinking_water',
   'Drinking Water (Mixed in water)',
   'drinking_water',
   'The vaccine is dissolved in the chickens'' drinking water. Remove water 1–2 hours first so the birds are thirsty and will drink quickly. Always use clean water with no chlorine or disinfectant — these kill the vaccine.'),

  ('coarse_spray',
   'Coarse Spray (Spray over birds)',
   'coarse_spray',
   'A special pump sprayer is used to mist large droplets of vaccine over the birds from above. The chickens breathe in the droplets. Keep the house closed during spraying so the vaccine stays in the air.'),

  ('wing_web',
   'Wing Web (Stab under the wing)',
   'wing_web',
   'A small two-pronged needle is dipped in the vaccine liquid and then pressed through the loose, thin skin found under the wing — like a thin flap of skin. Within 7–10 days a small scab forms at that spot. If you see the scab, the vaccination worked.'),

  ('intraocular',
   'Intraocular (Eye drop)',
   'intraocular',
   'One single drop of vaccine is placed directly into the chicken''s eye using a small dropper. Hold the bird still and wait for it to blink before you let it go. The eye absorbs the vaccine quickly.'),

  ('parenteral',
   'Parenteral (Injection)',
   'parenteral',
   'The vaccine is given by injection — either just under the skin (SC) or deeper into the muscle (IM). Always use the correct needle size for the bird''s age and follow the dosage on the vaccine label.')

ON CONFLICT (id) DO UPDATE
  SET label = EXCLUDED.label,
      icon  = EXCLUDED.icon,
      plain = EXCLUDED.plain;



-- ── Vaccine Guide Entries ─────────────────────────────────────────────────────
INSERT INTO vaccine_guide
  (id, flock_types, timing, day_offset, vaccine, protects, method, method_note, mandatory)
VALUES

-- ─────────────── DAY 1 ───────────────────────────────────────────────────────
(
  'mareks-d1',
  '{broiler,layer,indigenous}',
  'Day 1',
  1,
  'Marek''s Disease',
  'Prevents a disease that causes paralysis, weakness and tumours in chickens. Very common and deadly without vaccination.',
  'sc',
  'Usually given at the hatchery under the skin (neck or thigh). Ask for the hatchery certificate confirming this was done.',
  true
),
(
  'ib-d1',
  '{broiler,layer,indigenous}',
  'Day 1',
  1,
  'Infectious Bronchitis (IB) — 1st Dose',
  'Protects against a disease that causes coughing, sneezing and breathing difficulty. Can badly hurt egg production in layers.',
  'coarse_spray',
  'Often combined with Newcastle vaccine. May be given at hatchery or on arrival.',
  true
),
(
  'electrolytes-d1',
  '{broiler,layer,indigenous}',
  'Day 1',
  1,
  'Glucose & Stress Electrolytes',
  'Not a vaccine — a rehydration supplement that helps chicks recover from transport stress.',
  'drinking_water',
  'Mix warm dextrose (glucose) + electrolyte powder in the first drinking water. Withdraw plain water 30 minutes before.',
  true
),

-- ─────────────── DAY 6–7 ─────────────────────────────────────────────────────
(
  'reovirus-d7',
  '{broiler,layer}',
  'Day 6–7',
  6,
  'Tenosynovitis (Reovirus) — 1st Dose',
  'Prevents swollen joints, difficulty walking and lameness. Caused by a virus (Reovirus) that spreads flock-to-flock.',
  'sc',
  'Subcutaneous injection under the skin — usually given by a vet or trained farm attendant.',
  false
),

-- ─────────────── DAY 7 ───────────────────────────────────────────────────────
(
  'gumboro-d7',
  '{broiler,layer,indigenous}',
  'Day 7',
  7,
  'Gumboro (IBD — Infectious Bursal Disease) — 1st Dose',
  'Protects against a disease that destroys the chicken''s immune system, making them unable to fight other diseases.',
  'drinking_water',
  'Withhold water 1.5–2 hours before dosing. Add skimmed milk powder to the water first to protect the live virus. Use chlorine-free water.',
  true
),

-- ─────────────── DAY 14–21 ───────────────────────────────────────────────────
(
  'nd-ib-d14',
  '{broiler,layer,indigenous}',
  'Day 14–21',
  14,
  'Newcastle Disease + Infectious Bronchitis (ND+IB)',
  'Protects against two diseases that cause coughing, breathing difficulty, sneezing, reduced feed intake and deaths.',
  'drinking_water',
  'Mix with cool, clean water early in the morning. Provide multivitamins the following evening to reduce vaccination stress.',
  true
),

-- ─────────────── DAY 18 ───────────────────────────────────────────────────────
(
  'vitamins-d18',
  '{broiler,layer,indigenous}',
  'Day 18',
  18,
  'Multivitamins & Amino Acids Booster',
  'Not a vaccine — a nutritional supplement for gut health and growth during the starter-to-grower feed transition.',
  'drinking_water',
  'Give in drinking water for 3–5 consecutive days.',
  true
),

-- ─────────────── DAY 21 ───────────────────────────────────────────────────────
(
  'gumboro-d21',
  '{broiler,layer,indigenous}',
  'Day 21',
  21,
  'Gumboro (IBD) — 2nd Dose / Booster',
  'Critical secondary protection. The first dose primes the immune system; this dose strengthens it.',
  'drinking_water',
  'Same water preparation as 1st dose — skimmed milk + chlorine-free water. Ensure full flock uptake.',
  true
),

-- ─────────────── DAY 28 ───────────────────────────────────────────────────────
(
  'nd-d28',
  '{broiler,layer,indigenous}',
  'Day 28 (Week 4)',
  28,
  'Newcastle Disease — Lasota Booster',
  'Strengthens immunity before the second half of the growth cycle when birds are more vulnerable.',
  'drinking_water',
  'Pre-slaughter immunity booster. For broilers this is often the final vaccine before harvest.',
  true
),

-- ─────────────── WEEK 6–8 (Layer / Indigenous) ───────────────────────────────
(
  'reovirus-w6',
  '{layer,indigenous}',
  'Week 6–8',
  42,
  'Tenosynovitis (Reovirus) — Booster',
  'Strengthens protection against joint problems and lameness.',
  'sc',
  'Subcutaneous injection. Follow manufacturer dosage instructions for flock size.',
  false
),

-- ─────────────── WEEK 8–10 ───────────────────────────────────────────────────
(
  'nd-ib-w8',
  '{layer,indigenous}',
  'Week 8–10',
  56,
  'Newcastle + IB Booster',
  'Provides additional protection against respiratory diseases before lay begins.',
  'drinking_water',
  'Can also be given as a coarse spray. Confirm with vet if layer flock shows coughing signs.',
  false
),
(
  'gumboro-w8',
  '{layer,indigenous}',
  'Week 8–10',
  56,
  'Gumboro (IBD) — 3rd Dose',
  'Provides long-lasting bursal protection before onset of lay.',
  'drinking_water',
  'Some vet programmes switch to injectable inactivated Gumboro at this age.',
  false
),

-- ─────────────── WEEK 10–12 ──────────────────────────────────────────────────
(
  'enc-w10',
  '{layer,indigenous}',
  'Week 10–12',
  70,
  'Avian Encephalomyelitis (AE)',
  'Protects against a disease that can cause shaking, paralysis and significant reduction in egg production.',
  'wing_web',
  'Applied through the wing-web method (loose skin under the wing). Only vaccinate healthy birds.',
  false
),
(
  'fowlpox-w10',
  '{layer,indigenous}',
  'Week 10–12',
  70,
  'Fowlpox',
  'Prevents painful sores and scabs on the comb, face, wattles and body. Spread by mosquitoes and direct contact.',
  'wing_web',
  'Wing-web stab method. Check for successful vaccination (small scab at site) 7–10 days later.',
  false
),
(
  'cia-w10',
  '{layer,indigenous}',
  'Week 10–12',
  70,
  'Chicken Infectious Anaemia (CIA)',
  'Prevents a disease that causes weakness, poor growth, pale combs and reduced immunity.',
  'wing_web',
  'Wing-web method. Particularly important in areas with known CIA outbreaks.',
  false
),
(
  'ilt-w10',
  '{layer}',
  'Week 10–12',
  70,
  'Infectious Laryngotracheitis (ILT)',
  'Protects against a serious respiratory disease causing gasping, bloody mucus and high death rates.',
  'intraocular',
  'One eye drop per bird. Only use where ILT has been confirmed in your area — do not vaccinate healthy uninfected flocks.',
  false
),
(
  'reovirus-w10',
  '{layer}',
  'Week 10–12',
  70,
  'Tenosynovitis (Reovirus) — 2nd Booster',
  'Final protection against joint disease before productive lay begins.',
  'sc',
  'Subcutaneous injection — follow manufacturer''s dosage and dilution instructions.',
  false
),
(
  'fowlcholera-w10',
  '{layer,indigenous}',
  'Week 10–12',
  70,
  'Fowl Cholera (Pasteurellosis)',
  'Protects against a bacterial infection that can cause sudden deaths, swollen wattles and joint swelling.',
  'sc',
  'Injection or wing-web method depending on the specific product. Always follow label instructions.',
  false
),

-- ─────────────── WEEK 12–14 ──────────────────────────────────────────────────
(
  'nd-ib-w12',
  '{layer,indigenous}',
  'Week 12–14',
  84,
  'Newcastle + IB — Pre-Lay Booster',
  'Strengthens respiratory protection before lay starts. Very important — ND causes huge drops in egg production.',
  'drinking_water',
  'This is one of the most important pre-lay vaccines. Some programmes use inactivated (killed) vaccine by injection at this age instead.',
  false
),

-- ─────────────── WEEK 14–18 ──────────────────────────────────────────────────
(
  'fowlcholera-w14',
  '{layer,indigenous}',
  'Week 14–18',
  98,
  'Fowl Cholera — Booster',
  'Strengthens and extends protection against fowl cholera during lay.',
  'sc',
  'Injection or wing-web depending on product. Time with pre-lay ND+IB booster where possible.',
  false
),

-- ─────────────── WEEK 16–18 ──────────────────────────────────────────────────
(
  'gumboro-w16',
  '{layer}',
  'Week 16–18',
  112,
  'Gumboro (IBD) — Pre-Lay',
  'Final immune system boost before lay. Inactivated (killed) vaccine preferred at this age for long-lasting protection.',
  'sc',
  'Injectable inactivated vaccine — gives up to 6 months protection. Ask your vet for the correct product.',
  false
),
(
  'nd-ib-w16',
  '{layer,indigenous}',
  'Week 16–18',
  112,
  'Newcastle + IB — Final Pre-Lay',
  'Final protection before birds begin laying. Inactivated vaccines at this stage give protection throughout the lay period.',
  'sc',
  'Inactivated (killed) vaccine by injection preferred. Ensures immunity throughout lay cycle.',
  false
),

-- ─────────────── RECURRING ───────────────────────────────────────────────────
(
  'nd-ib-recurring',
  '{layer,indigenous}',
  'Every 60–90 days during lay',
  180,
  'Newcastle + IB — Routine Booster During Lay',
  'Maintains protection throughout the lay cycle. Newcastle Disease is the biggest cause of sudden egg production drops.',
  'drinking_water',
  'Live vaccine in water or spray. Some farms use inactivated injection every 6 months instead. Follow your vet''s programme.',
  false
)

ON CONFLICT (id) DO NOTHING;


-- ── Auto-Schedule (which vaccines load per flock type) ────────────────────────
-- Clear existing and re-insert (allows re-running safely)
DELETE FROM auto_schedule;

INSERT INTO auto_schedule (flock_type, vaccine_guide_id, sort_order) VALUES
-- ── Broiler ──────────────────────────────────────────────────────────────────
('broiler', 'mareks-d1',      1),
('broiler', 'ib-d1',          2),
('broiler', 'electrolytes-d1',3),
('broiler', 'gumboro-d7',     4),
('broiler', 'nd-ib-d14',      5),
('broiler', 'vitamins-d18',   6),
('broiler', 'gumboro-d21',    7),
('broiler', 'nd-d28',         8),

-- ── Layer ─────────────────────────────────────────────────────────────────────
('layer', 'mareks-d1',         1),
('layer', 'ib-d1',             2),
('layer', 'electrolytes-d1',   3),
('layer', 'reovirus-d7',       4),
('layer', 'gumboro-d7',        5),
('layer', 'nd-ib-d14',         6),
('layer', 'vitamins-d18',      7),
('layer', 'gumboro-d21',       8),
('layer', 'nd-d28',            9),
('layer', 'reovirus-w6',      10),
('layer', 'nd-ib-w8',         11),
('layer', 'gumboro-w8',       12),
('layer', 'enc-w10',          13),
('layer', 'fowlpox-w10',      14),
('layer', 'cia-w10',          15),
('layer', 'ilt-w10',          16),
('layer', 'reovirus-w10',     17),
('layer', 'fowlcholera-w10',  18),
('layer', 'nd-ib-w12',        19),
('layer', 'fowlcholera-w14',  20),
('layer', 'gumboro-w16',      21),
('layer', 'nd-ib-w16',        22),

-- ── Indigenous ───────────────────────────────────────────────────────────────
('indigenous', 'mareks-d1',        1),
('indigenous', 'ib-d1',            2),
('indigenous', 'electrolytes-d1',  3),
('indigenous', 'gumboro-d7',       4),
('indigenous', 'nd-ib-d14',        5),
('indigenous', 'vitamins-d18',     6),
('indigenous', 'gumboro-d21',      7),
('indigenous', 'nd-d28',           8),
('indigenous', 'nd-ib-w8',         9),
('indigenous', 'fowlpox-w10',     10),
('indigenous', 'fowlcholera-w10', 11),
('indigenous', 'nd-ib-w12',       12),
('indigenous', 'nd-ib-w16',       13);
