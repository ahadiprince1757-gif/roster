/**
 * Rosestar — Comprehensive Chicken Vaccination Guide
 *
 * Covers three flock types:
 *   'broiler'     — Commercial broilers sold at 6 weeks
 *   'layer'       — Laying hens kept 12–18 months
 *   'indigenous'  — Local/indigenous breeds kept for longer periods
 *
 * flockTypes: array of flock types this entry applies to
 * timing:     human-readable timing (e.g. "Day 1", "Week 4")
 * dayOffset:  day from hatch (used for auto-scheduling). Use the earliest day.
 * vaccine:    vaccine name
 * protects:   plain-language disease description
 * method:     administration method key (see METHOD_GLOSSARY)
 * methodNote: extra plain-language instruction
 * mandatory:  true = always included in auto-schedule, false = optional/situational
 */

export const VACCINATION_GUIDE = [
  // ── DAY 1 ─────────────────────────────────────────────────────────────────
  {
    id: 'mareks-d1',
    flockTypes: ['broiler', 'layer', 'indigenous'],
    timing: 'Day 1',
    dayOffset: 1,
    vaccine: "Marek's Disease",
    protects: 'Prevents a disease that causes paralysis, weakness and tumours in chickens. Very common and deadly without vaccination.',
    method: 'sc',
    methodNote: 'Usually given at the hatchery under the skin (neck or thigh). Ask for the hatchery certificate confirming this was done.',
    mandatory: true,
  },
  {
    id: 'ib-d1',
    flockTypes: ['broiler', 'layer', 'indigenous'],
    timing: 'Day 1',
    dayOffset: 1,
    vaccine: 'Infectious Bronchitis (IB) — 1st Dose',
    protects: 'Protects against a disease that causes coughing, sneezing and breathing difficulty. Can badly hurt egg production in layers.',
    method: 'coarse_spray',
    methodNote: 'Often combined with Newcastle vaccine. May be given at hatchery or on arrival.',
    mandatory: true,
  },
  {
    id: 'electrolytes-d1',
    flockTypes: ['broiler', 'layer', 'indigenous'],
    timing: 'Day 1',
    dayOffset: 1,
    vaccine: 'Glucose & Stress Electrolytes',
    protects: 'Not a vaccine — a rehydration supplement that helps chicks recover from transport stress.',
    method: 'drinking_water',
    methodNote: 'Mix warm dextrose (glucose) + electrolyte powder in the first drinking water. Withdraw plain water 30 minutes before.',
    mandatory: true,
  },

  // ── DAY 6–7 ───────────────────────────────────────────────────────────────
  {
    id: 'reovirus-d7',
    flockTypes: ['broiler', 'layer'],
    timing: 'Day 6–7',
    dayOffset: 6,
    vaccine: 'Tenosynovitis (Reovirus) — 1st Dose',
    protects: 'Prevents swollen joints, difficulty walking and lameness. Caused by a virus (Reovirus) that spreads flock-to-flock.',
    method: 'sc',
    methodNote: 'Subcutaneous injection under the skin — usually given by a vet or trained farm attendant.',
    mandatory: false,
  },

  // ── DAY 7 ─────────────────────────────────────────────────────────────────
  {
    id: 'gumboro-d7',
    flockTypes: ['broiler', 'layer', 'indigenous'],
    timing: 'Day 7',
    dayOffset: 7,
    vaccine: 'Gumboro (IBD — Infectious Bursal Disease) — 1st Dose',
    protects: "Protects against a disease that destroys the chicken's immune system, making them unable to fight other diseases.",
    method: 'drinking_water',
    methodNote: 'Withhold water 1.5–2 hours before dosing. Add skimmed milk powder to the water first to protect the live virus. Use chlorine-free water.',
    mandatory: true,
  },

  // ── DAY 14 ────────────────────────────────────────────────────────────────
  {
    id: 'nd-ib-d14',
    flockTypes: ['broiler', 'layer', 'indigenous'],
    timing: 'Day 14–21',
    dayOffset: 14,
    vaccine: 'Newcastle Disease + Infectious Bronchitis (ND+IB)',
    protects: 'Protects against two diseases that cause coughing, breathing difficulty, sneezing, reduced feed intake and deaths.',
    method: 'drinking_water',
    methodNote: 'Mix with cool, clean water early in the morning. Provide multivitamins the following evening to reduce vaccination stress.',
    mandatory: true,
  },

  // ── DAY 18 ────────────────────────────────────────────────────────────────
  {
    id: 'vitamins-d18',
    flockTypes: ['broiler', 'layer', 'indigenous'],
    timing: 'Day 18',
    dayOffset: 18,
    vaccine: 'Multivitamins & Amino Acids Booster',
    protects: 'Not a vaccine — a nutritional supplement for gut health and growth during the starter-to-grower feed transition.',
    method: 'drinking_water',
    methodNote: 'Give in drinking water for 3–5 consecutive days.',
    mandatory: true,
  },

  // ── DAY 21 ────────────────────────────────────────────────────────────────
  {
    id: 'gumboro-d21',
    flockTypes: ['broiler', 'layer', 'indigenous'],
    timing: 'Day 21',
    dayOffset: 21,
    vaccine: 'Gumboro (IBD) — 2nd Dose / Booster',
    protects: 'Critical secondary protection. The first dose primes the immune system; this dose strengthens it.',
    method: 'drinking_water',
    methodNote: 'Same water preparation as 1st dose — skimmed milk + chlorine-free water. Ensure full flock uptake.',
    mandatory: true,
  },

  // ── DAY 28 ────────────────────────────────────────────────────────────────
  {
    id: 'nd-d28',
    flockTypes: ['broiler', 'layer', 'indigenous'],
    timing: 'Day 28 (Week 4)',
    dayOffset: 28,
    vaccine: 'Newcastle Disease — Lasota Booster',
    protects: 'Strengthens immunity before the second half of the growth cycle when birds are more vulnerable.',
    method: 'drinking_water',
    methodNote: 'Pre-slaughter immunity booster. For broilers this is often the final vaccine before harvest.',
    mandatory: true,
  },

  // ── WEEKS 6–8 (Layer / Indigenous only beyond this point) ─────────────────
  {
    id: 'reovirus-w6',
    flockTypes: ['layer', 'indigenous'],
    timing: 'Week 6–8',
    dayOffset: 42,
    vaccine: 'Tenosynovitis (Reovirus) — Booster',
    protects: 'Strengthens protection against joint problems and lameness.',
    method: 'sc',
    methodNote: 'Subcutaneous injection. Follow manufacturer dosage instructions for flock size.',
    mandatory: false,
  },
  {
    id: 'nd-ib-w8',
    flockTypes: ['layer', 'indigenous'],
    timing: 'Week 8–10',
    dayOffset: 56,
    vaccine: 'Newcastle + IB Booster',
    protects: 'Provides additional protection against respiratory diseases before lay begins.',
    method: 'drinking_water',
    methodNote: 'Can also be given as a coarse spray. Confirm with vet if layer flock shows coughing signs.',
    mandatory: false,
  },
  {
    id: 'gumboro-w8',
    flockTypes: ['layer', 'indigenous'],
    timing: 'Week 8–10',
    dayOffset: 56,
    vaccine: 'Gumboro (IBD) — 3rd Dose',
    protects: 'Provides long-lasting bursal protection before onset of lay.',
    method: 'drinking_water',
    methodNote: 'Some vet programmes switch to injectable inactivated Gumboro at this age.',
    mandatory: false,
  },
  {
    id: 'enc-w10',
    flockTypes: ['layer', 'indigenous'],
    timing: 'Week 10–12',
    dayOffset: 70,
    vaccine: 'Avian Encephalomyelitis (AE)',
    protects: 'Protects against a disease that can cause shaking, paralysis and significant reduction in egg production.',
    method: 'wing_web',
    methodNote: 'Applied through the wing-web method (loose skin under the wing). Only vaccinate healthy birds.',
    mandatory: false,
  },
  {
    id: 'fowlpox-w10',
    flockTypes: ['layer', 'indigenous'],
    timing: 'Week 10–12',
    dayOffset: 70,
    vaccine: 'Fowlpox',
    protects: 'Prevents painful sores and scabs on the comb, face, wattles and body. Spread by mosquitoes and direct contact.',
    method: 'wing_web',
    methodNote: 'Wing-web stab method. Check for successful vaccination (small scab at site) 7–10 days later.',
    mandatory: false,
  },
  {
    id: 'cia-w10',
    flockTypes: ['layer', 'indigenous'],
    timing: 'Week 10–12',
    dayOffset: 70,
    vaccine: 'Chicken Infectious Anaemia (CIA)',
    protects: 'Prevents a disease that causes weakness, poor growth, pale combs and reduced immunity.',
    method: 'wing_web',
    methodNote: 'Wing-web method. Particularly important in areas with known CIA outbreaks.',
    mandatory: false,
  },
  {
    id: 'ilt-w10',
    flockTypes: ['layer'],
    timing: 'Week 10–12',
    dayOffset: 70,
    vaccine: 'Infectious Laryngotracheitis (ILT)',
    protects: 'Protects against a serious respiratory disease causing gasping, bloody mucus and high death rates.',
    method: 'intraocular',
    methodNote: 'One eye drop per bird. Only use where ILT has been confirmed in your area — do not vaccinate healthy uninfected flocks.',
    mandatory: false,
  },
  {
    id: 'reovirus-w10',
    flockTypes: ['layer'],
    timing: 'Week 10–12',
    dayOffset: 70,
    vaccine: 'Tenosynovitis (Reovirus) — 2nd Booster',
    protects: 'Final protection against joint disease before productive lay begins.',
    method: 'sc',
    methodNote: "Subcutaneous injection — follow manufacturer's dosage and dilution instructions.",
    mandatory: false,
  },
  {
    id: 'fowlcholera-w10',
    flockTypes: ['layer', 'indigenous'],
    timing: 'Week 10–12',
    dayOffset: 70,
    vaccine: 'Fowl Cholera (Pasteurellosis)',
    protects: 'Protects against a bacterial infection that can cause sudden deaths, swollen wattles and joint swelling.',
    method: 'sc',
    methodNote: 'Injection or wing-web method depending on the specific product. Always follow label instructions.',
    mandatory: false,
  },
  {
    id: 'nd-ib-w12',
    flockTypes: ['layer', 'indigenous'],
    timing: 'Week 12–14',
    dayOffset: 84,
    vaccine: 'Newcastle + IB — Pre-Lay Booster',
    protects: 'Strengthens respiratory protection before lay starts. Very important — ND causes huge drops in egg production.',
    method: 'drinking_water',
    methodNote: 'This is one of the most important pre-lay vaccines. Some programmes use inactivated (killed) vaccine by injection at this age instead.',
    mandatory: false,
  },
  {
    id: 'fowlcholera-w14',
    flockTypes: ['layer', 'indigenous'],
    timing: 'Week 14–18',
    dayOffset: 98,
    vaccine: 'Fowl Cholera — Booster',
    protects: 'Strengthens and extends protection against fowl cholera during lay.',
    method: 'sc',
    methodNote: 'Injection or wing-web depending on product. Time with pre-lay ND+IB booster where possible.',
    mandatory: false,
  },
  {
    id: 'gumboro-w16',
    flockTypes: ['layer'],
    timing: 'Week 16–18',
    dayOffset: 112,
    vaccine: 'Gumboro (IBD) — Pre-Lay',
    protects: 'Final immune system boost before lay. Inactivated (killed) vaccine preferred at this age for long-lasting protection.',
    method: 'sc',
    methodNote: 'Injectable inactivated vaccine — gives up to 6 months protection. Ask your vet for the correct product.',
    mandatory: false,
  },
  {
    id: 'nd-ib-w16',
    flockTypes: ['layer', 'indigenous'],
    timing: 'Week 16–18',
    dayOffset: 112,
    vaccine: 'Newcastle + IB — Final Pre-Lay',
    protects: 'Final protection before birds begin laying. Inactivated vaccines at this stage give protection throughout the lay period.',
    method: 'sc',
    methodNote: 'Inactivated (killed) vaccine by injection preferred. Ensures immunity throughout lay cycle.',
    mandatory: false,
  },
  {
    id: 'nd-ib-recurring',
    flockTypes: ['layer', 'indigenous'],
    timing: 'Every 60–90 days during lay',
    dayOffset: 180,
    vaccine: 'Newcastle + IB — Routine Booster During Lay',
    protects: 'Maintains protection throughout the lay cycle. Newcastle Disease is the biggest cause of sudden egg production drops.',
    method: 'drinking_water',
    methodNote: 'Live vaccine in water or spray. Some farms use inactivated injection every 6 months instead. Follow your vet\'s programme.',
    mandatory: false,
  },
];

// ── Method Glossary ───────────────────────────────────────────────────────────
// These explanations appear when a farmer taps on a vaccination method.

export const METHOD_GLOSSARY = {
  sc: {
    label: 'Subcutaneous Injection (SC)',
    icon: '💉',
    plain: 'An injection just under the skin — usually in the loose skin of the neck or thigh. Needs a trained person to administer correctly.',
  },
  drinking_water: {
    label: 'Drinking Water',
    icon: '💧',
    plain: 'The vaccine is mixed into the chickens\' drinking water. Withhold water 1–2 hours before so birds are thirsty and drink quickly. Use only clean, chlorine-free water.',
  },
  coarse_spray: {
    label: 'Coarse Spray',
    icon: '🌫️',
    plain: 'A special sprayer distributes large vaccine droplets over the birds from above. Birds breathe in and absorb the vaccine. Used for respiratory vaccines.',
  },
  wing_web: {
    label: 'Wing Web (Stab Method)',
    icon: '🪶',
    plain: 'A small two-pronged needle is dipped in the vaccine and used to stab through the loose thin skin under the wing. A small scab forms at the site within 7–10 days, showing the vaccine worked.',
  },
  intraocular: {
    label: 'Eye Drop (Intraocular)',
    icon: '👁️',
    plain: 'A single drop of vaccine is placed directly into one eye of each bird using a dropper. Hold the bird gently and wait for it to blink before releasing.',
  },
  parenteral: {
    label: 'Injection (Parenteral)',
    icon: '💉',
    plain: 'A vaccine given by injection — either under the skin (SC) or into the muscle (IM). Must be given by a trained person using the correct needle size.',
  },
};

// ── Flock type definitions ────────────────────────────────────────────────────

export const FLOCK_TYPES = {
  broiler: {
    label: 'Broiler (Commercial)',
    icon: '🐔',
    description: 'Fast-growing chickens raised for meat, sold at 5–7 weeks. Only core vaccines are needed.',
    colour: 'var(--primary)',
  },
  layer: {
    label: 'Layer (Egg Production)',
    icon: '🥚',
    description: 'Hens raised to produce eggs for 12–18 months. Require a full extended vaccination programme.',
    colour: '#f59e0b',
  },
  indigenous: {
    label: 'Indigenous / Local Breed',
    icon: '🐓',
    description: 'Local or traditional breeds kept for eggs and meat over longer periods. Use a simplified layer programme.',
    colour: '#22c55e',
  },
};

// ── Auto-schedule protocols per flock type ────────────────────────────────────
// These are the entries loaded when a farmer clicks "Auto-Schedule"

export const AUTO_SCHEDULE = {
  broiler: [
    'mareks-d1',
    'ib-d1',
    'electrolytes-d1',
    'gumboro-d7',
    'nd-ib-d14',
    'vitamins-d18',
    'gumboro-d21',
    'nd-d28',
  ],
  layer: [
    'mareks-d1',
    'ib-d1',
    'electrolytes-d1',
    'reovirus-d7',
    'gumboro-d7',
    'nd-ib-d14',
    'vitamins-d18',
    'gumboro-d21',
    'nd-d28',
    'reovirus-w6',
    'nd-ib-w8',
    'gumboro-w8',
    'enc-w10',
    'fowlpox-w10',
    'cia-w10',
    'fowlcholera-w10',
    'nd-ib-w12',
    'fowlcholera-w14',
    'gumboro-w16',
    'nd-ib-w16',
  ],
  indigenous: [
    'mareks-d1',
    'ib-d1',
    'electrolytes-d1',
    'gumboro-d7',
    'nd-ib-d14',
    'vitamins-d18',
    'gumboro-d21',
    'nd-d28',
    'nd-ib-w8',
    'fowlpox-w10',
    'fowlcholera-w10',
    'nd-ib-w12',
    'nd-ib-w16',
  ],
};

// Helper: get guide entries for a specific flock type
export function getGuideForType(flockType) {
  return VACCINATION_GUIDE.filter((v) => v.flockTypes.includes(flockType));
}

// Helper: get auto-schedule entries for a specific flock type
export function getAutoScheduleForType(flockType) {
  const ids = AUTO_SCHEDULE[flockType] || AUTO_SCHEDULE.broiler;
  const map = Object.fromEntries(VACCINATION_GUIDE.map((v) => [v.id, v]));
  return ids.map((id) => map[id]).filter(Boolean);
}
