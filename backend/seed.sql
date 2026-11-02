-- ============================================================
-- Rosestar Farm App — Seed Data
-- Paste and run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================
-- This inserts:
--   • 1 realistic demo batch (Alpha Flock 2026-B, 1,200 birds)
--   • 5 weight records
--   • 6 feed records (purchases + consumption)
--   • 7 health / vaccination events (full Cobb 500 protocol)
--   • 5 mortality records
--   • 5 finance records (expenses + 1 early sale)
-- ============================================================

-- Step 1: Store the batch id in a variable for use in all child inserts
DO $$
DECLARE
  batch_uuid UUID;
  start_date DATE := CURRENT_DATE - INTERVAL '24 days';
BEGIN

-- ────────────────────────────────────────────
-- BATCH
-- ────────────────────────────────────────────
INSERT INTO batches (
  name, date, birds, breed, supplier,
  chick_cost, target_age, target_weight, notes
)
VALUES (
  'Alpha Flock 2026-B',
  start_date,
  1200,
  'Cobb 500',
  'Kenbro Farms Hatchery Ltd',
  120000.00,
  42,
  2600,
  'Demo batch. Full Cobb 500 vaccination protocol applied.'
)
RETURNING id INTO batch_uuid;

-- ────────────────────────────────────────────
-- WEIGHTS (grams per bird)
-- ────────────────────────────────────────────
INSERT INTO weights (batch_id, date, sample, avg, min, max, notes) VALUES
  (batch_uuid, start_date + 0,  50, 44,   40,  48,  'Day-old chicks arrived in good vigour.'),
  (batch_uuid, start_date + 7,  60, 202,  185, 218, 'Exceeding Cobb week-1 benchmark target.'),
  (batch_uuid, start_date + 14, 70, 510,  475, 545, 'Good flock uniformity (>88%).'),
  (batch_uuid, start_date + 21, 80, 1040, 980, 1110,'Transitioned to grower pellets seamlessly.'),
  (batch_uuid, start_date + 24, 85, 1260, 1190,1340,'Active feeding and high vitality.');

-- ────────────────────────────────────────────
-- FEEDS (qty in kg)
-- ────────────────────────────────────────────
INSERT INTO feeds (batch_id, date, type, category, qty, cost, notes) VALUES
  (batch_uuid, start_date + 0,  'purchase',    'Starter', 600,  42000, '22% protein starter crumbles — 12 bags x 50 kg'),
  (batch_uuid, start_date + 7,  'consumption', 'Starter', 210,  0,     'Week 1 cumulative consumption'),
  (batch_uuid, start_date + 12, 'purchase',    'Grower',  1200, 78000, 'Balanced grower pellets 20% — 24 bags x 50 kg'),
  (batch_uuid, start_date + 14, 'consumption', 'Starter', 380,  0,     'Week 2 feed consumption'),
  (batch_uuid, start_date + 21, 'consumption', 'Grower',  620,  0,     'Week 3 feed consumption'),
  (batch_uuid, start_date + 24, 'consumption', 'Grower',  310,  0,     'Days 22-24 feed consumption');

-- ────────────────────────────────────────────
-- HEALTH EVENTS — Full Cobb 500 Broiler Protocol
-- ────────────────────────────────────────────
INSERT INTO health_events (batch_id, name, date, type, method, status, notes) VALUES

  -- Day 1: Hatchery vaccines + arrival support
  (batch_uuid,
   'Marek''s Disease + IB (Infectious Bronchitis)',
   start_date + 0,
   'Vaccination',
   'Hatchery Spray / Subcutaneous',
   'Completed',
   'Administered at hatchery upon hatching. Verify hatchery certificate before receiving birds.'),

  (batch_uuid,
   'Glucose & Stress Electrolytes — Arrival Support',
   start_date + 1,
   'Vitamins',
   'Drinking water',
   'Completed',
   'Warm dextrose + electrolyte water on arrival for rehydration. Remove plain water 30 min before.'),

  -- Day 7: Gumboro 1st dose
  (batch_uuid,
   'Gumboro IBD — 1st Dose (Intermediate Plus)',
   start_date + 7,
   'Vaccination',
   'Drinking water (skimmed milk stabiliser)',
   'Completed',
   'Withhold water 1.5–2 hrs before dosing. Use cool, chlorine-free water. Skimmed milk stabilises live virus. Blue dye showed 96% intake.'),

  -- Day 14: Newcastle + IB combo
  (batch_uuid,
   'Newcastle Disease (Lasota / Hitchner B1) + IB Combo',
   start_date + 14,
   'Vaccination',
   'Drinking water / Eye drop',
   'Completed',
   'Protects against Newcastle Disease. Administer in cool morning water. Provide multivitamins the following evening.'),

  -- Day 18: Vitamin booster
  (batch_uuid,
   'Multivitamins & Amino Acids Growth Booster',
   start_date + 18,
   'Vitamins',
   'Drinking water',
   'Completed',
   'Supports gut integrity and growth acceleration during starter-to-grower feed transition.'),

  -- Day 21: Gumboro 2nd dose
  (batch_uuid,
   'Gumboro IBD — 2nd Dose / Booster',
   start_date + 21,
   'Vaccination',
   'Drinking water',
   'Completed',
   'Critical secondary protection against bursal viral challenge. Ensure full flock uptake.'),

  -- Day 28: Newcastle final booster
  (batch_uuid,
   'Newcastle Disease — Lasota Final Booster',
   start_date + 28,
   'Vaccination',
   'Drinking water',
   'Pending',
   'Pre-slaughter immunity booster. Scheduled for day 28.'),

  -- Day 35: Pre-slaughter antibiotic/vitamin withdrawal check
  (batch_uuid,
   'Withdrawal Period — Stop All Medications',
   start_date + 35,
   'Medication',
   'N/A',
   'Pending',
   'Cease all antibiotics and non-essential supplements. Observe minimum 7-day pre-slaughter withdrawal.'),

  -- Day 38: Vet inspection
  (batch_uuid,
   'Pre-Slaughter Health Audit & Vet Inspection',
   start_date + 38,
   'Health check',
   'Visual & Vet inspection',
   'Pending',
   'Full flock readiness assessment. Check uniformity, walking ability, absence of disease signs.');

-- ────────────────────────────────────────────
-- DEATHS (mortality log)
-- ────────────────────────────────────────────
INSERT INTO deaths (batch_id, date, qty, cause) VALUES
  (batch_uuid, start_date + 1,  5, 'Transport dehydration and weak spraddle leg on arrival'),
  (batch_uuid, start_date + 3,  3, 'Smothering in corner during chilling period'),
  (batch_uuid, start_date + 8,  4, 'Ascites / small runts culled from flock'),
  (batch_uuid, start_date + 15, 2, 'Heart failure / Sudden Death Syndrome (SDS)'),
  (batch_uuid, start_date + 22, 3, 'Natural background mortality');

-- ────────────────────────────────────────────
-- FINANCES (KSh)
-- ────────────────────────────────────────────
INSERT INTO finances (batch_id, date, type, description, amount, qty, weight) VALUES
  (batch_uuid, start_date + 0,  'Expense', 'Chick cost — 1,200 Cobb 500 DOC from Kenbro Hatchery',  120000, NULL, NULL),
  (batch_uuid, start_date + 0,  'Expense', 'Bedding — Wood shavings (3 truckloads)',                  15000,  NULL, NULL),
  (batch_uuid, start_date + 0,  'Expense', 'Brooding setup — gas heaters, feeders, drinkers',         12500,  NULL, NULL),
  (batch_uuid, start_date + 7,  'Expense', 'Vaccines — Gumboro, Newcastle, Vitamins (week 1)',          8400,  NULL, NULL),
  (batch_uuid, start_date + 15, 'Expense', 'Farm attendant bi-weekly labor stipend',                   18000,  NULL, NULL),
  (batch_uuid, start_date + 23, 'Sale',    '50 early heavyweight cockerels sold to local restaurant',  37500,  50,   1.25);

END $$;
