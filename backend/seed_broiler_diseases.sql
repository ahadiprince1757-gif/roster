-- ============================================================
-- Rosestar Farm App — Broiler Disease Catalog Seed Data
-- 22 Commercial Broiler Diseases (Cobb 500 / Merck Veterinary Guide)
-- Run in: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

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


-- ============================================================
-- 22 Broiler Disease Records (Idempotent: Upsert on conflict)
-- ============================================================

INSERT INTO broiler_diseases (
  id, name, category, severity, severity_score, common_age,
  symptoms, broiler_signs, what_to_do_now, prevention,
  treatment_type, treatment_action, treatment_note,
  emergency, reportable, zoonotic, veterinarian, keywords
) VALUES (
  'newcastle_disease',
  'Newcastle Disease',
  'Viral',
  'Critical',
  4,
  'Any age',
  '{"Depression and lethargy","Loss of appetite","Difficulty breathing / open-mouth breathing","Coughing or respiratory sounds","Green or watery droppings","Twisted neck (torticollis)","Loss of coordination / circling","Paralysis","Sudden death"}',
  '{"Sudden drop in feed intake","Respiratory distress across the flock","Green diarrhea","Neurological signs in multiple birds","Unexplained sudden deaths"}',
  '{"Isolate any birds showing signs immediately.","Stop movement of people and equipment between houses.","Tighten all biosecurity: disinfect footwear, restrict entry.","Do not cull or move sick birds without veterinary instruction.","Contact a poultry veterinarian or animal-health authority today."}',
  '{"Follow an appropriate Newcastle vaccination program (LaSota + booster)","Maintain strict farm biosecurity","Limit contact with other poultry and wild birds","Disinfect equipment, vehicles, and footwear before entering","Quarantine new birds for at least 2 weeks before mixing"}',
  'No specific antiviral cure',
  'Supportive care to reduce losses; isolate and prevent spread.',
  'Antibiotics do not treat Newcastle virus. Seek veterinary guidance.',
  true,
  true,
  false,
  true,
  '{"newcastle","nd","respiratory","twisting neck","green diarrhea","sudden death","viral"}'
)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  category         = EXCLUDED.category,
  severity         = EXCLUDED.severity,
  severity_score   = EXCLUDED.severity_score,
  common_age       = EXCLUDED.common_age,
  symptoms         = EXCLUDED.symptoms,
  broiler_signs    = EXCLUDED.broiler_signs,
  what_to_do_now   = EXCLUDED.what_to_do_now,
  prevention       = EXCLUDED.prevention,
  treatment_type   = EXCLUDED.treatment_type,
  treatment_action = EXCLUDED.treatment_action,
  treatment_note   = EXCLUDED.treatment_note,
  emergency        = EXCLUDED.emergency,
  reportable       = EXCLUDED.reportable,
  zoonotic         = EXCLUDED.zoonotic,
  veterinarian     = EXCLUDED.veterinarian,
  keywords         = EXCLUDED.keywords;

INSERT INTO broiler_diseases (
  id, name, category, severity, severity_score, common_age,
  symptoms, broiler_signs, what_to_do_now, prevention,
  treatment_type, treatment_action, treatment_note,
  emergency, reportable, zoonotic, veterinarian, keywords
) VALUES (
  'infectious_bursal_disease',
  'Infectious Bursal Disease (Gumboro)',
  'Viral',
  'High',
  3,
  'Young broilers — especially 3–6 weeks',
  '{"Sudden severe depression","Reduced feed and water intake","Fluffed feathers and huddling","Watery or white diarrhea","Dehydration","Weakness","Sudden rise in mortality rate"}',
  '{"Rapid deterioration across young flock","White watery droppings (classic sign)","Dehydration within 24–48 hours","Increased mortality peaking at 3–5 days","Immunosuppression leading to secondary infections"}',
  '{"Isolate the affected pen if possible.","Increase warmth — chilled birds deteriorate faster.","Ensure easy access to water with electrolytes.","Record mortality and onset date.","Contact a veterinarian — Gumboro causes immunosuppression and opens the door to secondary diseases."}',
  '{"Use an appropriate IBD vaccination program at Day 10 and Day 14","Maintain good biosecurity between flocks","Keep litter dry — IBD virus survives in wet litter","Avoid overcrowding","Thorough clean-out and disinfection between batches"}',
  'No specific antiviral treatment',
  'Supportive care: warmth, electrolytes, easy water access.',
  'Secondary bacterial infections after Gumboro may require veterinary-directed treatment.',
  true,
  false,
  false,
  true,
  '{"gumboro","ibd","bursal","white diarrhea","young chicks","immunosuppression"}'
)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  category         = EXCLUDED.category,
  severity         = EXCLUDED.severity,
  severity_score   = EXCLUDED.severity_score,
  common_age       = EXCLUDED.common_age,
  symptoms         = EXCLUDED.symptoms,
  broiler_signs    = EXCLUDED.broiler_signs,
  what_to_do_now   = EXCLUDED.what_to_do_now,
  prevention       = EXCLUDED.prevention,
  treatment_type   = EXCLUDED.treatment_type,
  treatment_action = EXCLUDED.treatment_action,
  treatment_note   = EXCLUDED.treatment_note,
  emergency        = EXCLUDED.emergency,
  reportable       = EXCLUDED.reportable,
  zoonotic         = EXCLUDED.zoonotic,
  veterinarian     = EXCLUDED.veterinarian,
  keywords         = EXCLUDED.keywords;

INSERT INTO broiler_diseases (
  id, name, category, severity, severity_score, common_age,
  symptoms, broiler_signs, what_to_do_now, prevention,
  treatment_type, treatment_action, treatment_note,
  emergency, reportable, zoonotic, veterinarian, keywords
) VALUES (
  'mareks_disease',
  'Marek''s Disease',
  'Viral',
  'Critical',
  4,
  'Young birds — clinical signs may appear later in grow-out',
  '{"Progressive weight loss","Weakness","Paralysis of one or both legs","Classic \"splits\" posture — one leg forward, one backward","Drooping wings","Loss of coordination","Vision abnormalities"}',
  '{"Poor and uneven growth across the flock","Increasing number of birds unable to reach feeders/drinkers","Progressive wasting despite adequate feed","Paralysis in multiple birds"}',
  '{"Remove paralysed birds from the flock to prevent trampling.","Provide feed and water directly accessible to affected birds.","Do not introduce new unvaccinated birds to the farm.","Record the number and age affected.","Request veterinary diagnosis — paralysis has multiple causes."}',
  '{"Vaccinate all chicks on hatch day (Day 0) — Marek''s vaccine must be given before exposure","Maintain strict hygiene — virus spreads in feather dander","Good biosecurity to prevent introduction from outside","Source chicks only from reputable vaccinated flocks"}',
  'No specific treatment',
  'Humane removal of severely affected birds. Veterinary diagnosis to confirm and rule out other causes.',
  NULL,
  true,
  false,
  false,
  true,
  '{"marek''s","paralysis","splits","leg weakness","wasting","one leg forward"}'
)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  category         = EXCLUDED.category,
  severity         = EXCLUDED.severity,
  severity_score   = EXCLUDED.severity_score,
  common_age       = EXCLUDED.common_age,
  symptoms         = EXCLUDED.symptoms,
  broiler_signs    = EXCLUDED.broiler_signs,
  what_to_do_now   = EXCLUDED.what_to_do_now,
  prevention       = EXCLUDED.prevention,
  treatment_type   = EXCLUDED.treatment_type,
  treatment_action = EXCLUDED.treatment_action,
  treatment_note   = EXCLUDED.treatment_note,
  emergency        = EXCLUDED.emergency,
  reportable       = EXCLUDED.reportable,
  zoonotic         = EXCLUDED.zoonotic,
  veterinarian     = EXCLUDED.veterinarian,
  keywords         = EXCLUDED.keywords;

INSERT INTO broiler_diseases (
  id, name, category, severity, severity_score, common_age,
  symptoms, broiler_signs, what_to_do_now, prevention,
  treatment_type, treatment_action, treatment_note,
  emergency, reportable, zoonotic, veterinarian, keywords
) VALUES (
  'infectious_bronchitis',
  'Infectious Bronchitis (IB)',
  'Viral',
  'High',
  3,
  'Any age — especially impactful in young broilers',
  '{"Sneezing","Coughing","Nasal discharge","Watery eyes","Difficulty breathing / gasping","Rales (crackling sounds at night)","Depression and huddling","Reduced feed intake","Poor growth"}',
  '{"Night rales audible when house is quiet","Wet litter under drinkers from watery eyes","Poor and uneven flock growth","Reduced feed intake flock-wide","Predisposes flock to secondary bacterial respiratory disease"}',
  '{"Check ventilation immediately — reduce ammonia and dust levels.","Increase house temperature slightly for young chicks.","Ensure all birds have access to fresh water.","Walk the house at night and listen for rales.","Consult a veterinarian for secondary infection management."}',
  '{"Appropriate IB vaccination program (Day 1 spray or water + booster)","Good ventilation — reduce ammonia below 15 ppm","Reduce dust and litter moisture","Maintain biosecurity — IB spreads via airborne droplets","Avoid overcrowding"}',
  'Supportive',
  'Improve ventilation, water access, and house temperature. Veterinarian to assess for secondary bacterial infections.',
  NULL,
  false,
  false,
  false,
  true,
  '{"bronchitis","ib","coughing","sneezing","rales","respiratory","gasping","night sounds"}'
)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  category         = EXCLUDED.category,
  severity         = EXCLUDED.severity,
  severity_score   = EXCLUDED.severity_score,
  common_age       = EXCLUDED.common_age,
  symptoms         = EXCLUDED.symptoms,
  broiler_signs    = EXCLUDED.broiler_signs,
  what_to_do_now   = EXCLUDED.what_to_do_now,
  prevention       = EXCLUDED.prevention,
  treatment_type   = EXCLUDED.treatment_type,
  treatment_action = EXCLUDED.treatment_action,
  treatment_note   = EXCLUDED.treatment_note,
  emergency        = EXCLUDED.emergency,
  reportable       = EXCLUDED.reportable,
  zoonotic         = EXCLUDED.zoonotic,
  veterinarian     = EXCLUDED.veterinarian,
  keywords         = EXCLUDED.keywords;

INSERT INTO broiler_diseases (
  id, name, category, severity, severity_score, common_age,
  symptoms, broiler_signs, what_to_do_now, prevention,
  treatment_type, treatment_action, treatment_note,
  emergency, reportable, zoonotic, veterinarian, keywords
) VALUES (
  'infectious_laryngotracheitis',
  'Infectious Laryngotracheitis (ILT)',
  'Viral',
  'Critical',
  4,
  'Susceptible at any age; more severe in older birds',
  '{"Severe breathing difficulty","Open-mouth breathing with neck extended","Violent coughing / gasping","Gurgling or rattling sounds","Blood-tinged mucus coughed up","Sudden deaths from suffocation"}',
  '{"Sudden severe respiratory distress","Birds coughing and shaking heads","Blood-stained walls or litter from coughing","Rapid spread through the house","High mortality if untreated"}',
  '{"Isolate the flock and restrict all movement immediately.","Reduce stocking density if possible to ease breathing.","Improve airflow without creating cold drafts.","Do NOT introduce new birds to the farm.","Call a veterinarian urgently — ILT has a very similar presentation to other severe respiratory diseases."}',
  '{"Vaccination where ILT is endemic in your area","Strict biosecurity — ILT spreads by direct contact and fomites","Separate affected birds early","Improve ventilation","Reduce stress on the flock"}',
  'Supportive',
  'Veterinary diagnosis required. Supportive management to reduce deaths. Secondary infections may need treatment.',
  'Antibiotics do not eliminate the viral infection.',
  true,
  false,
  false,
  true,
  '{"ilt","laryngotracheitis","gasping","blood mucus","coughing blood","severe respiratory"}'
)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  category         = EXCLUDED.category,
  severity         = EXCLUDED.severity,
  severity_score   = EXCLUDED.severity_score,
  common_age       = EXCLUDED.common_age,
  symptoms         = EXCLUDED.symptoms,
  broiler_signs    = EXCLUDED.broiler_signs,
  what_to_do_now   = EXCLUDED.what_to_do_now,
  prevention       = EXCLUDED.prevention,
  treatment_type   = EXCLUDED.treatment_type,
  treatment_action = EXCLUDED.treatment_action,
  treatment_note   = EXCLUDED.treatment_note,
  emergency        = EXCLUDED.emergency,
  reportable       = EXCLUDED.reportable,
  zoonotic         = EXCLUDED.zoonotic,
  veterinarian     = EXCLUDED.veterinarian,
  keywords         = EXCLUDED.keywords;

INSERT INTO broiler_diseases (
  id, name, category, severity, severity_score, common_age,
  symptoms, broiler_signs, what_to_do_now, prevention,
  treatment_type, treatment_action, treatment_note,
  emergency, reportable, zoonotic, veterinarian, keywords
) VALUES (
  'avian_influenza',
  'Avian Influenza (Bird Flu)',
  'Viral',
  'Critical',
  4,
  'Any age',
  '{"Sudden unexplained mass death","Severe depression","Respiratory distress","Swollen head / eyes","Bluish or purple comb and wattles","Diarrhea","Neurological signs","Discoloration or bleeding on legs/feet"}',
  '{"Very sudden mass mortality — often overnight","Severe respiratory signs spreading rapidly","Swollen head and purple-blue comb (key visual)","Flock-wide collapse within 24–48 hours"}',
  '{"Do not enter the house without protective clothing and footwear disinfection.","Immediately isolate the farm — no birds, vehicles, or people leave.","Do not dispose of or move any dead birds.","Call the government veterinary / animal health authority right now.","This is a notifiable disease in most countries."}',
  '{"Strict biosecurity — keep wild birds away from feed, water, and housing","Disinfect vehicles, equipment, and footwear at the farm gate","Quarantine all incoming birds","Cover water and feed stores","Report any sudden mass mortality immediately"}',
  'No home treatment',
  'Immediately isolate the flock and contact veterinary/animal-health authorities. This is a government-managed disease.',
  NULL,
  true,
  true,
  true,
  true,
  '{"avian influenza","bird flu","ai","hpai","mass death","swollen head","blue comb","notifiable"}'
)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  category         = EXCLUDED.category,
  severity         = EXCLUDED.severity,
  severity_score   = EXCLUDED.severity_score,
  common_age       = EXCLUDED.common_age,
  symptoms         = EXCLUDED.symptoms,
  broiler_signs    = EXCLUDED.broiler_signs,
  what_to_do_now   = EXCLUDED.what_to_do_now,
  prevention       = EXCLUDED.prevention,
  treatment_type   = EXCLUDED.treatment_type,
  treatment_action = EXCLUDED.treatment_action,
  treatment_note   = EXCLUDED.treatment_note,
  emergency        = EXCLUDED.emergency,
  reportable       = EXCLUDED.reportable,
  zoonotic         = EXCLUDED.zoonotic,
  veterinarian     = EXCLUDED.veterinarian,
  keywords         = EXCLUDED.keywords;

INSERT INTO broiler_diseases (
  id, name, category, severity, severity_score, common_age,
  symptoms, broiler_signs, what_to_do_now, prevention,
  treatment_type, treatment_action, treatment_note,
  emergency, reportable, zoonotic, veterinarian, keywords
) VALUES (
  'coccidiosis',
  'Coccidiosis',
  'Parasitic',
  'High',
  3,
  'Young broilers — Day 14 to Day 42',
  '{"Depression","Reduced feed and water intake","Puffed feathers","Diarrhea","Bloody droppings (red/brown/dark)","Pale comb and face","Weakness and lethargy","Dehydration","Sudden death in severe cases"}',
  '{"Poor weight gain — the number one economic impact","Bloody or orange-brown droppings in feeders/drinker area","Pale birds with puffed feathers","Increased mortality if untreated quickly","Wet litter amplifies the cycle (sporulation in moisture)"}',
  '{"Check litter moisture immediately — wet litter accelerates the coccidial cycle.","Fix any leaking drinkers.","Increase ventilation to dry litter.","Remove severely wet litter patches.","Contact a veterinarian for anticoccidial treatment — early treatment is critical."}',
  '{"Keep litter dry at all times — this is the single most important control","Fix all drinker leaks immediately","Maintain appropriate stocking density","Use a coccidiosis prevention program appropriate for your region","Clean drinkers daily"}',
  'Anticoccidial treatment required',
  'Use an appropriate anticoccidial product per veterinary or product-label instructions. Early treatment (at first signs) is critical.',
  NULL,
  true,
  false,
  false,
  true,
  '{"coccidiosis","cocci","bloody droppings","red droppings","wet litter","pale birds","eimeria"}'
)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  category         = EXCLUDED.category,
  severity         = EXCLUDED.severity,
  severity_score   = EXCLUDED.severity_score,
  common_age       = EXCLUDED.common_age,
  symptoms         = EXCLUDED.symptoms,
  broiler_signs    = EXCLUDED.broiler_signs,
  what_to_do_now   = EXCLUDED.what_to_do_now,
  prevention       = EXCLUDED.prevention,
  treatment_type   = EXCLUDED.treatment_type,
  treatment_action = EXCLUDED.treatment_action,
  treatment_note   = EXCLUDED.treatment_note,
  emergency        = EXCLUDED.emergency,
  reportable       = EXCLUDED.reportable,
  zoonotic         = EXCLUDED.zoonotic,
  veterinarian     = EXCLUDED.veterinarian,
  keywords         = EXCLUDED.keywords;

INSERT INTO broiler_diseases (
  id, name, category, severity, severity_score, common_age,
  symptoms, broiler_signs, what_to_do_now, prevention,
  treatment_type, treatment_action, treatment_note,
  emergency, reportable, zoonotic, veterinarian, keywords
) VALUES (
  'necrotic_enteritis',
  'Necrotic Enteritis (NE)',
  'Bacterial',
  'Critical',
  4,
  'Growing broilers — Day 14 to Day 35',
  '{"Sudden severe depression","Rapid drop in feed intake","Ruffled feathers","Dark brown or black tar-like droppings","Blood in droppings","Rapid deterioration","Sudden death — birds often found dead overnight"}',
  '{"Feed intake drops 20–40% in 24 hours without warning","Dark sticky feces with foul smell","Birds dying quickly — flock mortality rises fast","Often follows coccidiosis or gut-disrupting events"}',
  '{"Record the number of deaths and onset time precisely.","Check if coccidiosis preceded this — NE often follows cocci.","Do not change the feed abruptly.","Contact a veterinarian immediately — NE mortality can be very high.","Increase ventilation and check litter condition."}',
  '{"Control coccidiosis — NE is frequently triggered by cocci gut damage","Maintain good litter management — dry litter reduces Clostridium load","Balanced nutrition and avoid sudden feed changes","Good hygiene and house sanitation between batches"}',
  'Veterinary-directed — urgent',
  'Prompt veterinary assessment and appropriate treatment. Do not delay.',
  NULL,
  true,
  false,
  false,
  true,
  '{"necrotic enteritis","ne","black droppings","dark feces","clostridium","sudden death","gut rot"}'
)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  category         = EXCLUDED.category,
  severity         = EXCLUDED.severity,
  severity_score   = EXCLUDED.severity_score,
  common_age       = EXCLUDED.common_age,
  symptoms         = EXCLUDED.symptoms,
  broiler_signs    = EXCLUDED.broiler_signs,
  what_to_do_now   = EXCLUDED.what_to_do_now,
  prevention       = EXCLUDED.prevention,
  treatment_type   = EXCLUDED.treatment_type,
  treatment_action = EXCLUDED.treatment_action,
  treatment_note   = EXCLUDED.treatment_note,
  emergency        = EXCLUDED.emergency,
  reportable       = EXCLUDED.reportable,
  zoonotic         = EXCLUDED.zoonotic,
  veterinarian     = EXCLUDED.veterinarian,
  keywords         = EXCLUDED.keywords;

INSERT INTO broiler_diseases (
  id, name, category, severity, severity_score, common_age,
  symptoms, broiler_signs, what_to_do_now, prevention,
  treatment_type, treatment_action, treatment_note,
  emergency, reportable, zoonotic, veterinarian, keywords
) VALUES (
  'coryza',
  'Infectious Coryza',
  'Bacterial',
  'High',
  3,
  'Older broilers — typically after 3 weeks',
  '{"Foul-smelling nasal discharge","Sneezing","Facial swelling (especially around eyes and sinuses)","Watery eyes","Difficulty breathing","Reduced feed intake","Depression"}',
  '{"Swollen face and sinuses (highly visible)","Foul smell from nasal discharge","Reduced feed intake and growth rate","Respiratory distress","Often spreads quickly through the house"}',
  '{"Improve ventilation — reduce ammonia and humidity.","Isolate visibly swollen birds if possible.","Avoid introducing new birds to an affected flock.","Contact a veterinarian for diagnosis and treatment options."}',
  '{"Strict biosecurity and quarantine of new birds","Avoid mixing birds from unknown sources","Improve ventilation to reduce ammonia","Clean equipment between flocks"}',
  'Veterinary-directed',
  'Veterinary diagnosis and appropriate antimicrobial treatment where indicated.',
  NULL,
  false,
  false,
  false,
  true,
  '{"coryza","swollen face","nasal discharge","smell","facial swelling","sinusitis"}'
)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  category         = EXCLUDED.category,
  severity         = EXCLUDED.severity,
  severity_score   = EXCLUDED.severity_score,
  common_age       = EXCLUDED.common_age,
  symptoms         = EXCLUDED.symptoms,
  broiler_signs    = EXCLUDED.broiler_signs,
  what_to_do_now   = EXCLUDED.what_to_do_now,
  prevention       = EXCLUDED.prevention,
  treatment_type   = EXCLUDED.treatment_type,
  treatment_action = EXCLUDED.treatment_action,
  treatment_note   = EXCLUDED.treatment_note,
  emergency        = EXCLUDED.emergency,
  reportable       = EXCLUDED.reportable,
  zoonotic         = EXCLUDED.zoonotic,
  veterinarian     = EXCLUDED.veterinarian,
  keywords         = EXCLUDED.keywords;

INSERT INTO broiler_diseases (
  id, name, category, severity, severity_score, common_age,
  symptoms, broiler_signs, what_to_do_now, prevention,
  treatment_type, treatment_action, treatment_note,
  emergency, reportable, zoonotic, veterinarian, keywords
) VALUES (
  'ecoli',
  'E. coli Infection (Colibacillosis)',
  'Bacterial',
  'High',
  3,
  'Any age — most common as secondary infection',
  '{"Depression","Reduced appetite","Weakness","Diarrhea","Respiratory difficulty","Swollen abdomen","Joint swelling and lameness","Sudden death"}',
  '{"Poor growth and feed conversion","Lameness and swollen joints (hot, hard joints)","Respiratory signs alongside diarrhea","Mortality that is hard to explain by one cause","Often secondary to poor water quality or ventilation failures"}',
  '{"Check and clean all drinkers — dirty water is the primary vector.","Check ventilation — ammonia damages the respiratory lining, letting E. coli in.","Identify and address the primary underlying issue first.","Contact a veterinarian for diagnosis before any treatment."}',
  '{"Clean drinking water daily — sanitise drinkers regularly","Good litter management — keep it dry","Good ventilation to reduce ammonia","Reduce overcrowding","Control primary diseases (IB, Mycoplasma) that open the door to E. coli"}',
  'Veterinary-directed',
  'Treatment must be based on veterinary diagnosis and, where appropriate, antimicrobial susceptibility testing (sensitivity). Do not guess the antibiotic.',
  NULL,
  false,
  false,
  true,
  true,
  '{"ecoli","e coli","colibacillosis","swollen joints","lameness","diarrhea","dirty water","secondary"}'
)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  category         = EXCLUDED.category,
  severity         = EXCLUDED.severity,
  severity_score   = EXCLUDED.severity_score,
  common_age       = EXCLUDED.common_age,
  symptoms         = EXCLUDED.symptoms,
  broiler_signs    = EXCLUDED.broiler_signs,
  what_to_do_now   = EXCLUDED.what_to_do_now,
  prevention       = EXCLUDED.prevention,
  treatment_type   = EXCLUDED.treatment_type,
  treatment_action = EXCLUDED.treatment_action,
  treatment_note   = EXCLUDED.treatment_note,
  emergency        = EXCLUDED.emergency,
  reportable       = EXCLUDED.reportable,
  zoonotic         = EXCLUDED.zoonotic,
  veterinarian     = EXCLUDED.veterinarian,
  keywords         = EXCLUDED.keywords;

INSERT INTO broiler_diseases (
  id, name, category, severity, severity_score, common_age,
  symptoms, broiler_signs, what_to_do_now, prevention,
  treatment_type, treatment_action, treatment_note,
  emergency, reportable, zoonotic, veterinarian, keywords
) VALUES (
  'mycoplasmosis',
  'Mycoplasmosis / CRD',
  'Bacterial',
  'Moderate',
  2,
  'Any age',
  '{"Sneezing and coughing","Nasal discharge","Watery eyes","Swollen sinuses","Respiratory sounds (rales)","Poor growth","Weakness"}',
  '{"Chronic low-grade respiratory signs across the flock","Poor and inconsistent weight gain","Poor feed conversion — eating but not growing","Predisposes flock to secondary E. coli and other bacterial infections"}',
  '{"Improve ventilation — reduce ammonia and dust immediately.","Increase litter management frequency.","Avoid adding more stress (overcrowding, cold nights).","Contact a veterinarian — Mycoplasma is best controlled early."}',
  '{"Source chicks from Mycoplasma-free or monitored hatcheries","Good ventilation — ammonia is a key trigger","Reduce stress on the flock","Good biosecurity","Avoid mixing birds from unknown sources"}',
  'Control — not elimination',
  'Veterinary-directed treatment can reduce signs but Mycoplasma is rarely fully eliminated. Focus on management improvement.',
  NULL,
  false,
  false,
  false,
  true,
  '{"mycoplasma","crd","chronic respiratory","sneezing","rales","poor growth","mgs"}'
)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  category         = EXCLUDED.category,
  severity         = EXCLUDED.severity,
  severity_score   = EXCLUDED.severity_score,
  common_age       = EXCLUDED.common_age,
  symptoms         = EXCLUDED.symptoms,
  broiler_signs    = EXCLUDED.broiler_signs,
  what_to_do_now   = EXCLUDED.what_to_do_now,
  prevention       = EXCLUDED.prevention,
  treatment_type   = EXCLUDED.treatment_type,
  treatment_action = EXCLUDED.treatment_action,
  treatment_note   = EXCLUDED.treatment_note,
  emergency        = EXCLUDED.emergency,
  reportable       = EXCLUDED.reportable,
  zoonotic         = EXCLUDED.zoonotic,
  veterinarian     = EXCLUDED.veterinarian,
  keywords         = EXCLUDED.keywords;

INSERT INTO broiler_diseases (
  id, name, category, severity, severity_score, common_age,
  symptoms, broiler_signs, what_to_do_now, prevention,
  treatment_type, treatment_action, treatment_note,
  emergency, reportable, zoonotic, veterinarian, keywords
) VALUES (
  'aspergillosis',
  'Aspergillosis (Fungal Pneumonia)',
  'Fungal',
  'High',
  3,
  'Especially young broilers (Day 1–21)',
  '{"Difficulty breathing / gasping","Open-mouth breathing","Depression","Reduced appetite","Weakness","Poor growth","Eye involvement (cloudy eye) in some birds"}',
  '{"Gasping and laboured breathing in young chicks","Poor growth in first 2 weeks despite eating","High early mortality in young chicks","Often linked to mouldy feed or mouldy litter/bedding"}',
  '{"Remove and replace all suspect mouldy feed immediately.","Check the litter/bedding for mould — replace if necessary.","Improve ventilation to reduce humidity.","Do NOT continue using mouldy feed even if it looks minor.","Contact a veterinarian — aspergillosis is difficult to treat."}',
  '{"Never use mouldy, wet, or damaged feed","Store feed in dry, cool, ventilated conditions","Keep litter dry — mould grows in wet litter","Improve house ventilation","Remove mouldy material from the farm immediately"}',
  'Difficult to treat — prevention is critical',
  'Remove mould source immediately. Veterinary assessment for treatment options. Antifungal drugs are expensive and not always effective.',
  NULL,
  false,
  false,
  false,
  true,
  '{"aspergillosis","mould","mold","fungal","gasping","pneumonia","mouldy feed"}'
)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  category         = EXCLUDED.category,
  severity         = EXCLUDED.severity,
  severity_score   = EXCLUDED.severity_score,
  common_age       = EXCLUDED.common_age,
  symptoms         = EXCLUDED.symptoms,
  broiler_signs    = EXCLUDED.broiler_signs,
  what_to_do_now   = EXCLUDED.what_to_do_now,
  prevention       = EXCLUDED.prevention,
  treatment_type   = EXCLUDED.treatment_type,
  treatment_action = EXCLUDED.treatment_action,
  treatment_note   = EXCLUDED.treatment_note,
  emergency        = EXCLUDED.emergency,
  reportable       = EXCLUDED.reportable,
  zoonotic         = EXCLUDED.zoonotic,
  veterinarian     = EXCLUDED.veterinarian,
  keywords         = EXCLUDED.keywords;

INSERT INTO broiler_diseases (
  id, name, category, severity, severity_score, common_age,
  symptoms, broiler_signs, what_to_do_now, prevention,
  treatment_type, treatment_action, treatment_note,
  emergency, reportable, zoonotic, veterinarian, keywords
) VALUES (
  'fowl_cholera',
  'Fowl Cholera',
  'Bacterial',
  'Critical',
  4,
  'Any age — more severe in older/heavier birds',
  '{"Sudden unexpected death","Severe depression","Reduced appetite","Greenish watery diarrhea","Mucus from mouth","Swollen wattles","Swollen or hot joints","Lameness"}',
  '{"Birds found dead overnight with no prior warning signs","Flock depression within 24 hours","Greenish diarrhea spreading through the house","Lameness and joint swelling in survivors"}',
  '{"Remove dead birds immediately — do not leave them in the house.","Disinfect feeders and drinkers.","Identify and eliminate rodent access — rodents carry Pasteurella.","Block wild bird access.","Contact a veterinarian urgently."}',
  '{"Good sanitation and clean water","Aggressive rodent and wild bird control","Disinfect housing between batches","Good biosecurity"}',
  'Veterinary-directed — urgent',
  'Prompt veterinary diagnosis and treatment. Pasteurella multocida requires specific antimicrobial management.',
  NULL,
  true,
  false,
  false,
  true,
  '{"fowl cholera","pasteurella","sudden death","green diarrhea","swollen wattles","rodents"}'
)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  category         = EXCLUDED.category,
  severity         = EXCLUDED.severity,
  severity_score   = EXCLUDED.severity_score,
  common_age       = EXCLUDED.common_age,
  symptoms         = EXCLUDED.symptoms,
  broiler_signs    = EXCLUDED.broiler_signs,
  what_to_do_now   = EXCLUDED.what_to_do_now,
  prevention       = EXCLUDED.prevention,
  treatment_type   = EXCLUDED.treatment_type,
  treatment_action = EXCLUDED.treatment_action,
  treatment_note   = EXCLUDED.treatment_note,
  emergency        = EXCLUDED.emergency,
  reportable       = EXCLUDED.reportable,
  zoonotic         = EXCLUDED.zoonotic,
  veterinarian     = EXCLUDED.veterinarian,
  keywords         = EXCLUDED.keywords;

INSERT INTO broiler_diseases (
  id, name, category, severity, severity_score, common_age,
  symptoms, broiler_signs, what_to_do_now, prevention,
  treatment_type, treatment_action, treatment_note,
  emergency, reportable, zoonotic, veterinarian, keywords
) VALUES (
  'pullorum',
  'Pullorum Disease / White Diarrhea',
  'Bacterial',
  'High',
  3,
  'Young chicks — Day 1 to Day 14',
  '{"Weakness and depression in young chicks","Chilling and huddling near heat source","Poor appetite","White sticky diarrhea","Pasted vent (blocked vent with dried droppings)","Difficulty breathing","High early mortality"}',
  '{"Very weak chicks in first days of life","White paste clogging vents — birds straining","High mortality in first week","Severely stunted growth in survivors"}',
  '{"Gently clean pasted vents with warm water — be careful not to tear the skin.","Increase brooder temperature — chilling accelerates deaths.","Provide electrolytes in water.","Record hatchery source and batch details.","Contact a veterinarian — Pullorum is a Salmonella and may be a reportable issue."}',
  '{"Source chicks only from certified disease-controlled hatcheries","Maintain strict brooder hygiene","Good brooder temperature management","Good biosecurity from day one"}',
  'Veterinary/regulatory matter',
  'Veterinary diagnosis required. Follow local disease control requirements — Pullorum is Salmonella Pullorum and may require reporting.',
  NULL,
  true,
  true,
  false,
  true,
  '{"pullorum","white diarrhea","pasted vent","salmonella pullorum","weak chicks","early mortality"}'
)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  category         = EXCLUDED.category,
  severity         = EXCLUDED.severity,
  severity_score   = EXCLUDED.severity_score,
  common_age       = EXCLUDED.common_age,
  symptoms         = EXCLUDED.symptoms,
  broiler_signs    = EXCLUDED.broiler_signs,
  what_to_do_now   = EXCLUDED.what_to_do_now,
  prevention       = EXCLUDED.prevention,
  treatment_type   = EXCLUDED.treatment_type,
  treatment_action = EXCLUDED.treatment_action,
  treatment_note   = EXCLUDED.treatment_note,
  emergency        = EXCLUDED.emergency,
  reportable       = EXCLUDED.reportable,
  zoonotic         = EXCLUDED.zoonotic,
  veterinarian     = EXCLUDED.veterinarian,
  keywords         = EXCLUDED.keywords;

INSERT INTO broiler_diseases (
  id, name, category, severity, severity_score, common_age,
  symptoms, broiler_signs, what_to_do_now, prevention,
  treatment_type, treatment_action, treatment_note,
  emergency, reportable, zoonotic, veterinarian, keywords
) VALUES (
  'heat_stress',
  'Heat Stress',
  'Environmental',
  'Critical',
  4,
  'Any age — most dangerous in heavy birds (Week 4–6)',
  '{"Heavy panting / open-mouth breathing","Wings held away from body","Lethargy — birds not moving","Severely reduced feed intake","Increased water consumption","Weakness","Sudden death during peak heat"}',
  '{"Flock panting and spreading wings during afternoon heat","Feed intake collapses after midday","Birds found dead near drinkers","Rapid mortality during heatwaves — heavy birds die fastest","FCR worsens as feed intake shifts away from hot afternoons"}',
  '{"Open all ventilation points immediately.","Check all drinkers are flowing and water is cool.","Wet the roof or spray the birds if temperature exceeds 35°C.","Remove feed for 2 hours during peak heat (11am–2pm) to reduce heat of digestion.","Do not handle or disturb birds during heat — handling causes additional stress deaths."}',
  '{"Ensure adequate ventilation capacity before hot season","Provide multiple drinker points with cool clean water always available","Reduce stocking density in hot climates","Provide shade on the roof","Monitor house temperature daily — take action above 30°C","Never restrict water during heat"}',
  'Emergency management',
  'Immediately reduce heat load: open ventilation, cool water, reduce feed. Deaths happen within hours.',
  NULL,
  true,
  false,
  false,
  false,
  '{"heat stress","panting","hot weather","temperature","wings spread","heat death","summer"}'
)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  category         = EXCLUDED.category,
  severity         = EXCLUDED.severity,
  severity_score   = EXCLUDED.severity_score,
  common_age       = EXCLUDED.common_age,
  symptoms         = EXCLUDED.symptoms,
  broiler_signs    = EXCLUDED.broiler_signs,
  what_to_do_now   = EXCLUDED.what_to_do_now,
  prevention       = EXCLUDED.prevention,
  treatment_type   = EXCLUDED.treatment_type,
  treatment_action = EXCLUDED.treatment_action,
  treatment_note   = EXCLUDED.treatment_note,
  emergency        = EXCLUDED.emergency,
  reportable       = EXCLUDED.reportable,
  zoonotic         = EXCLUDED.zoonotic,
  veterinarian     = EXCLUDED.veterinarian,
  keywords         = EXCLUDED.keywords;

INSERT INTO broiler_diseases (
  id, name, category, severity, severity_score, common_age,
  symptoms, broiler_signs, what_to_do_now, prevention,
  treatment_type, treatment_action, treatment_note,
  emergency, reportable, zoonotic, veterinarian, keywords
) VALUES (
  'dehydration',
  'Dehydration',
  'Environmental',
  'High',
  3,
  'Any age — critical in first 48 hours of life',
  '{"Lethargy and weakness","Reduced or zero water intake","Dry beak and oral tissue","Sunken eyes","Poor growth","Huddling","Sudden deterioration"}',
  '{"Birds not moving to drinkers","Very weak chicks in first days (nipple height wrong)","Sudden deterioration with no respiratory signs","Often triggered by drinker failure, blockage, or wrong height"}',
  '{"Check every drinker is working and flowing — this is the first step.","Adjust nipple height — Day 1 chicks need nipples at eye level.","If chicks have been without water: add electrolytes/glucose to water and place birds near nipples.","Count affected birds and check the timeline of drinker failure.","If no improvement in 2 hours, contact a veterinarian."}',
  '{"Check all drinkers every morning — do not skip this","Adjust drinker height as birds grow (every 3–4 days)","Never allow birds to run out of water during heat","Flush and clean drinker lines weekly"}',
  'Supportive',
  'Restore water access immediately. Add electrolytes or glucose for severely affected birds.',
  NULL,
  true,
  false,
  false,
  false,
  '{"dehydration","no water","drinker","weak chicks","sunken eyes","lethargy"}'
)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  category         = EXCLUDED.category,
  severity         = EXCLUDED.severity,
  severity_score   = EXCLUDED.severity_score,
  common_age       = EXCLUDED.common_age,
  symptoms         = EXCLUDED.symptoms,
  broiler_signs    = EXCLUDED.broiler_signs,
  what_to_do_now   = EXCLUDED.what_to_do_now,
  prevention       = EXCLUDED.prevention,
  treatment_type   = EXCLUDED.treatment_type,
  treatment_action = EXCLUDED.treatment_action,
  treatment_note   = EXCLUDED.treatment_note,
  emergency        = EXCLUDED.emergency,
  reportable       = EXCLUDED.reportable,
  zoonotic         = EXCLUDED.zoonotic,
  veterinarian     = EXCLUDED.veterinarian,
  keywords         = EXCLUDED.keywords;

INSERT INTO broiler_diseases (
  id, name, category, severity, severity_score, common_age,
  symptoms, broiler_signs, what_to_do_now, prevention,
  treatment_type, treatment_action, treatment_note,
  emergency, reportable, zoonotic, veterinarian, keywords
) VALUES (
  'nutritional_deficiency',
  'Nutritional Deficiency',
  'Nutritional',
  'Moderate',
  2,
  'Any age — depends on the deficient nutrient',
  '{"Poor and uneven growth","Leg weakness or bone problems","Reduced appetite","Poor feather development","Neurological signs in some deficiencies","Poor body condition"}',
  '{"Flock growth far below Cobb 500 targets","High proportion of small birds — runts across the flock","Leg weakness preventing birds reaching feeders (Vitamin D/Ca issue)","Poor feather cover in young birds","Poor feed conversion — eating but not converting"}',
  '{"Check feed — is it the correct phase (Starter/Grower/Finisher for the age)?","Check feed storage — is it wet, mouldy, or old?","Is the feed being diluted with low-quality ingredients?","Calculate the feed-to-weight ratio — is FCR reasonable?","Contact a veterinarian or nutritionist to assess the diet."}',
  '{"Use complete commercial broiler feed appropriate for the age phase","Store feed correctly in dry, cool, ventilated conditions","Never use feed older than manufacturer recommendation","Avoid diluting feed with grains or low-quality ingredients","Provide fresh clean water always"}',
  'Nutritional correction',
  'Identify the deficiency with veterinary/nutritional guidance and correct the diet. Supplementation alone may not be enough without fixing the root cause.',
  NULL,
  false,
  false,
  false,
  true,
  '{"nutrition","vitamin","mineral","leg weakness","poor growth","rickets","deficiency","runts"}'
)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  category         = EXCLUDED.category,
  severity         = EXCLUDED.severity,
  severity_score   = EXCLUDED.severity_score,
  common_age       = EXCLUDED.common_age,
  symptoms         = EXCLUDED.symptoms,
  broiler_signs    = EXCLUDED.broiler_signs,
  what_to_do_now   = EXCLUDED.what_to_do_now,
  prevention       = EXCLUDED.prevention,
  treatment_type   = EXCLUDED.treatment_type,
  treatment_action = EXCLUDED.treatment_action,
  treatment_note   = EXCLUDED.treatment_note,
  emergency        = EXCLUDED.emergency,
  reportable       = EXCLUDED.reportable,
  zoonotic         = EXCLUDED.zoonotic,
  veterinarian     = EXCLUDED.veterinarian,
  keywords         = EXCLUDED.keywords;

INSERT INTO broiler_diseases (
  id, name, category, severity, severity_score, common_age,
  symptoms, broiler_signs, what_to_do_now, prevention,
  treatment_type, treatment_action, treatment_note,
  emergency, reportable, zoonotic, veterinarian, keywords
) VALUES (
  'fowl_pox',
  'Fowl Pox',
  'Viral',
  'Moderate',
  2,
  'Any age',
  '{"Scabs and wart-like lesions on comb, wattles, and face","Lesions on unfeathered skin areas","Reduced activity","In wet form: lesions inside mouth and throat","Difficulty eating in wet form","Difficulty breathing in severe wet form"}',
  '{"Visible skin lesions on head and face","Reduced feed intake and poor growth during outbreak","Wet form causes more severe production losses","Mosquito-active periods increase risk"}',
  '{"Isolate visibly affected birds to prevent pecking of lesions.","Identify and reduce mosquito breeding sites near the farm.","Keep lesions clean and dry.","Provide easily accessible soft feed and water.","Contact a veterinarian for confirmation and to treat secondary infections."}',
  '{"Vaccination where fowl pox is endemic","Aggressive mosquito and vector control","Screen housing to reduce insect entry","Isolate affected birds early"}',
  'Supportive',
  'No antiviral treatment. Keep lesions clean. Veterinary guidance for secondary bacterial infections in wet form.',
  NULL,
  false,
  false,
  false,
  true,
  '{"fowl pox","skin lesions","scabs","warts","comb lesions","mosquito","pox"}'
)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  category         = EXCLUDED.category,
  severity         = EXCLUDED.severity,
  severity_score   = EXCLUDED.severity_score,
  common_age       = EXCLUDED.common_age,
  symptoms         = EXCLUDED.symptoms,
  broiler_signs    = EXCLUDED.broiler_signs,
  what_to_do_now   = EXCLUDED.what_to_do_now,
  prevention       = EXCLUDED.prevention,
  treatment_type   = EXCLUDED.treatment_type,
  treatment_action = EXCLUDED.treatment_action,
  treatment_note   = EXCLUDED.treatment_note,
  emergency        = EXCLUDED.emergency,
  reportable       = EXCLUDED.reportable,
  zoonotic         = EXCLUDED.zoonotic,
  veterinarian     = EXCLUDED.veterinarian,
  keywords         = EXCLUDED.keywords;

INSERT INTO broiler_diseases (
  id, name, category, severity, severity_score, common_age,
  symptoms, broiler_signs, what_to_do_now, prevention,
  treatment_type, treatment_action, treatment_note,
  emergency, reportable, zoonotic, veterinarian, keywords
) VALUES (
  'staphylococcal_disease',
  'Staphylococcal Disease',
  'Bacterial',
  'Moderate',
  2,
  'Any age',
  '{"Depression","Reduced feed intake","Swollen, hot joints","Lameness — difficulty walking","Skin lesions or abscesses","Foot pad lesions"}',
  '{"Lame birds unable to reach feeders — direct production loss","Swollen hocks and wing joints","Skin wounds from pecking or rough equipment","Poor growth in affected birds"}',
  '{"Check litter condition — wet litter causes footpad lesions that allow Staph entry.","Inspect for sharp edges on equipment that might cause skin wounds.","Remove severely lame birds to a care pen with easy feed/water access.","Contact a veterinarian for treatment options."}',
  '{"Keep litter dry — wet litter is the primary risk factor","Remove or smooth any sharp edges in housing","Prevent overcrowding","Manage any skin injuries or wounds promptly"}',
  'Veterinary-directed',
  'Veterinary diagnosis and appropriate antimicrobial treatment where indicated.',
  NULL,
  false,
  false,
  false,
  true,
  '{"staphylococcal","staph","joint swelling","lameness","footpad","abscess","arthritis"}'
)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  category         = EXCLUDED.category,
  severity         = EXCLUDED.severity,
  severity_score   = EXCLUDED.severity_score,
  common_age       = EXCLUDED.common_age,
  symptoms         = EXCLUDED.symptoms,
  broiler_signs    = EXCLUDED.broiler_signs,
  what_to_do_now   = EXCLUDED.what_to_do_now,
  prevention       = EXCLUDED.prevention,
  treatment_type   = EXCLUDED.treatment_type,
  treatment_action = EXCLUDED.treatment_action,
  treatment_note   = EXCLUDED.treatment_note,
  emergency        = EXCLUDED.emergency,
  reportable       = EXCLUDED.reportable,
  zoonotic         = EXCLUDED.zoonotic,
  veterinarian     = EXCLUDED.veterinarian,
  keywords         = EXCLUDED.keywords;

INSERT INTO broiler_diseases (
  id, name, category, severity, severity_score, common_age,
  symptoms, broiler_signs, what_to_do_now, prevention,
  treatment_type, treatment_action, treatment_note,
  emergency, reportable, zoonotic, veterinarian, keywords
) VALUES (
  'salmonellosis',
  'Salmonellosis',
  'Bacterial',
  'High',
  3,
  'Any age',
  '{"Weakness and depression","Diarrhea","Reduced appetite","Poor growth","Sudden death in young birds"}',
  '{"Poor and uneven growth","Diarrhea causing wet litter","Increased early mortality","Public health risk — Salmonella in broiler meat"}',
  '{"Improve sanitation — clean all feeders and drinkers.","Identify and eliminate rodent access to feed stores.","Record mortality rate and onset.","Contact a veterinarian — Salmonella is a public health (food safety) concern.","Do not sell affected birds without veterinary clearance."}',
  '{"Clean, uncontaminated feed — rodent-proof feed storage","Aggressive rodent control on the farm","Strict biosecurity","Good sanitation between batches","Source chicks from reputable suppliers"}',
  'Veterinary-directed',
  'Antimicrobial decisions must be made by a veterinarian, ideally with susceptibility testing. Salmonella has food safety implications.',
  NULL,
  false,
  true,
  true,
  true,
  '{"salmonella","diarrhea","food safety","rodent","contamination","zoonotic"}'
)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  category         = EXCLUDED.category,
  severity         = EXCLUDED.severity,
  severity_score   = EXCLUDED.severity_score,
  common_age       = EXCLUDED.common_age,
  symptoms         = EXCLUDED.symptoms,
  broiler_signs    = EXCLUDED.broiler_signs,
  what_to_do_now   = EXCLUDED.what_to_do_now,
  prevention       = EXCLUDED.prevention,
  treatment_type   = EXCLUDED.treatment_type,
  treatment_action = EXCLUDED.treatment_action,
  treatment_note   = EXCLUDED.treatment_note,
  emergency        = EXCLUDED.emergency,
  reportable       = EXCLUDED.reportable,
  zoonotic         = EXCLUDED.zoonotic,
  veterinarian     = EXCLUDED.veterinarian,
  keywords         = EXCLUDED.keywords;

INSERT INTO broiler_diseases (
  id, name, category, severity, severity_score, common_age,
  symptoms, broiler_signs, what_to_do_now, prevention,
  treatment_type, treatment_action, treatment_note,
  emergency, reportable, zoonotic, veterinarian, keywords
) VALUES (
  'histomoniasis',
  'Histomoniasis (Blackhead Disease)',
  'Protozoal',
  'High',
  3,
  'Growing birds — primarily 4–12 weeks',
  '{"Depression and lethargy","Reduced feed intake","Progressive weight loss","Huddling","Yellow or yellow-green droppings","Weakness","Death"}',
  '{"Characteristic yellow-sulphur droppings (key visual)","Rapid weight loss","Birds becoming progressively weaker over days","Higher risk in houses with earthworm exposure (soil floor)"}',
  '{"Isolate affected birds.","Review the flooring — soil or earthworm access is a major risk.","Improve litter management.","Contact a veterinarian — treatment options vary by country."}',
  '{"Good litter management and dry litter","Reduce exposure to soil and earthworms (the vector)","Maintain biosecurity","Clean housing thoroughly between batches"}',
  'Veterinary management',
  'Obtain veterinary diagnosis. Treatment options vary by country and local approvals.',
  NULL,
  false,
  false,
  false,
  true,
  '{"histomoniasis","blackhead","yellow droppings","sulphur","earthworm","protozoa"}'
)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  category         = EXCLUDED.category,
  severity         = EXCLUDED.severity,
  severity_score   = EXCLUDED.severity_score,
  common_age       = EXCLUDED.common_age,
  symptoms         = EXCLUDED.symptoms,
  broiler_signs    = EXCLUDED.broiler_signs,
  what_to_do_now   = EXCLUDED.what_to_do_now,
  prevention       = EXCLUDED.prevention,
  treatment_type   = EXCLUDED.treatment_type,
  treatment_action = EXCLUDED.treatment_action,
  treatment_note   = EXCLUDED.treatment_note,
  emergency        = EXCLUDED.emergency,
  reportable       = EXCLUDED.reportable,
  zoonotic         = EXCLUDED.zoonotic,
  veterinarian     = EXCLUDED.veterinarian,
  keywords         = EXCLUDED.keywords;

INSERT INTO broiler_diseases (
  id, name, category, severity, severity_score, common_age,
  symptoms, broiler_signs, what_to_do_now, prevention,
  treatment_type, treatment_action, treatment_note,
  emergency, reportable, zoonotic, veterinarian, keywords
) VALUES (
  'avian_encephalomyelitis',
  'Avian Encephalomyelitis',
  'Viral',
  'High',
  3,
  'Young chicks — Day 1 to Day 14',
  '{"Progressive depression","Tremors — especially of head and neck","Unsteady walking (ataxia)","Falling over","Inability to stand","Loss of coordination"}',
  '{"Young chicks trembling and falling","Unable to reach feed and water","Progressive neurological decline over days","High mortality in young affected chicks"}',
  '{"Provide feed and water directly to affected chicks on the floor.","Keep the brooder warm.","Record the number affected and age at onset.","Contact a veterinarian — tremors in chicks have multiple causes."}',
  '{"Use appropriate vaccination programs","Good biosecurity","Source chicks from reliable, disease-tested hatcheries"}',
  'No specific treatment',
  'Supportive care. Veterinary diagnosis to rule out other neurological conditions.',
  NULL,
  false,
  false,
  false,
  true,
  '{"encephalomyelitis","ae","tremors","shaking","ataxia","young chicks","neurological"}'
)
ON CONFLICT (id) DO UPDATE SET
  name             = EXCLUDED.name,
  category         = EXCLUDED.category,
  severity         = EXCLUDED.severity,
  severity_score   = EXCLUDED.severity_score,
  common_age       = EXCLUDED.common_age,
  symptoms         = EXCLUDED.symptoms,
  broiler_signs    = EXCLUDED.broiler_signs,
  what_to_do_now   = EXCLUDED.what_to_do_now,
  prevention       = EXCLUDED.prevention,
  treatment_type   = EXCLUDED.treatment_type,
  treatment_action = EXCLUDED.treatment_action,
  treatment_note   = EXCLUDED.treatment_note,
  emergency        = EXCLUDED.emergency,
  reportable       = EXCLUDED.reportable,
  zoonotic         = EXCLUDED.zoonotic,
  veterinarian     = EXCLUDED.veterinarian,
  keywords         = EXCLUDED.keywords;
