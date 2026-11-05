/**
 * Rosestar Poultry Problem Map & Diagnostic Engine
 * Clinical decision-support system for broiler and layer farmers.
 * 
 * Flow:
 * Observed Symptoms -> Triage Questions -> Ranked Causes + Confidence
 * -> Immediate Protocol ("DO THIS NOW")
 * -> Mistakes to Avoid ("WHAT NOT TO DO")
 * -> Critical Warning Signs ("WATCH FOR")
 * -> Escalation Criteria ("WHEN TO CALL A VET")
 */

export const PRIMARY_SYMPTOM_CATEGORIES = [
  {
    id: 'locomotion',
    title: 'Cannot Walk / Lame',
    subtitle: 'Sitting on hocks, limping, twisted legs, inability to reach feeders',
    icon: 'Footprints',
    badge: 'High Impact',
  },
  {
    id: 'respiratory',
    title: 'Breathing & Sneezing',
    subtitle: 'Gasping, night rales, wet eyes, coughing, swollen face',
    icon: 'Wind',
    badge: 'Urgent',
  },
  {
    id: 'droppings',
    title: 'Abnormal Droppings',
    subtitle: 'Bloody, watery white, orange mucus, bright green or undigested feed',
    icon: 'AlertTriangle',
    badge: 'Critical',
  },
  {
    id: 'mortality',
    title: 'Sudden Mortality Spike',
    subtitle: 'Birds dying suddenly, dead on back, unexplained losses overnight',
    icon: 'Skull',
    badge: 'Emergency',
  },
  {
    id: 'growth',
    title: 'Not Growing / Uneven',
    subtitle: 'Runts, weight far behind target, high feed intake with low gain',
    icon: 'TrendingDown',
    badge: 'Economic Leak',
  },
  {
    id: 'appetite',
    title: 'Not Eating / Not Drinking',
    subtitle: 'Lethargic, huddling under brooder, crop empty, listless',
    icon: 'UtensilsCrossed',
    badge: 'Early Warning',
  },
];

export const TRIAGE_QUESTIONS = [
  {
    id: 'ageRange',
    label: 'What is the current flock age?',
    options: [
      { value: 'brooding', label: 'Day 1 – 10 (Brooding phase)' },
      { value: 'grower', label: 'Day 11 – 24 (Grower phase)' },
      { value: 'finisher', label: 'Day 25+ (Finisher / Pre-market)' },
    ],
  },
  {
    id: 'scope',
    label: 'How many birds are showing these signs?',
    options: [
      { value: 'isolated', label: 'Isolated (1 – 3 birds)' },
      { value: 'cluster', label: 'A noticeable cluster (5% – 15%)' },
      { value: 'widespread', label: 'Widespread flock issue (> 20%)' },
    ],
  },
  {
    id: 'droppingsState',
    label: 'What do the droppings look like?',
    options: [
      { value: 'normal', label: 'Normal firm brownish with white uric acid cap' },
      { value: 'bloody', label: 'Bloody or reddish currant-jelly streaks' },
      { value: 'white', label: 'Chalky watery white or creamy paste' },
      { value: 'watery_green', label: 'Bright yellowish-green watery diarrhea' },
      { value: 'undigested', label: 'Wet watery with unabsorbed feed grain' },
    ],
  },
  {
    id: 'eatingState',
    label: 'Are they currently eating and drinking?',
    options: [
      { value: 'normal', label: 'Eating and drinking normally' },
      { value: 'reduced_feed', label: 'Feed consumption dropped noticeably' },
      { value: 'reduced_water', label: 'Water consumption dropped' },
      { value: 'refusing_all', label: 'Refusing both feed and water' },
    ],
  },
  {
    id: 'recentChange',
    label: 'Any recent changes on the farm in the last 48 hours?',
    options: [
      { value: 'none', label: 'No significant changes' },
      { value: 'feed_switch', label: 'Changed feed brand or batch' },
      { value: 'weather_heat', label: 'Extreme heatwave or cold spike' },
      { value: 'vaccination', label: 'Recent vaccination within 3 days' },
      { value: 'wet_litter', label: 'Damp/wet bedding around drinkers' },
    ],
  },
];

/**
 * Diagnostic Knowledge Base
 */
export const DIAGNOSTIC_CONDITIONS = [
  {
    id: 'coccidiosis_caecal',
    name: 'Caecal Coccidiosis (Eimeria tenella)',
    category: 'droppings',
    severity: 'High',
    matchRule: (answers, primary) => {
      let score = 0;
      if (primary === 'droppings' || primary === 'mortality') score += 40;
      if (answers.droppingsState === 'bloody') score += 50;
      if (answers.ageRange === 'grower') score += 15;
      if (answers.recentChange === 'wet_litter') score += 15;
      return score;
    },
    summary: 'Parasitic protozoan multiplying rapidly inside the bird’s caeca, causing severe internal bleeding.',
    evidence: [
      'Bloody droppings or blood clots in litter',
      'Pale comb, wattles, and shanks from blood loss',
      'Huddling, ruffled feathers, and listlessness',
    ],
    doThisNow: [
      'Administer water-soluble Amprolium, Toltrazuril, or Sulfaquinoxaline strictly via drinking water immediately.',
      'Do not rely on medicated feed—sick birds stop eating before they stop drinking.',
      'Remove damp litter clumps around drinkers and replace with dry, clean wood shavings.',
      'Add Vitamin K to drinking water to help blood coagulation and stop hemorrhaging.',
    ],
    whatNotToDo: [
      'DO NOT use broad-spectrum tetracyclines or random antibiotics—coccidia are protozoa, not bacteria.',
      'DO NOT restrict water; dehydration accelerates death exponentially.',
      'DO NOT let litter stay wet—moisture and heat incubate millions of coccidial oocysts in 24 hours.',
    ],
    watchFor: [
      'Number of dead birds found around brooding lights or corners.',
      'Whether droppings clear from red to brown within 36 hours of treatment.',
    ],
    whenToCallVet: [
      'Mortality exceeds 1% of flock in a single 12-hour period.',
      'No improvement after 48 hours of targeted anticoccidial water treatment.',
    ],
  },

  {
    id: 'rickets_minerals',
    name: 'Rickets / Calcium-Phosphorus Imbalance',
    category: 'locomotion',
    severity: 'Medium',
    matchRule: (answers, primary) => {
      let score = 0;
      if (primary === 'locomotion') score += 45;
      if (answers.eatingState === 'normal') score += 20; // Birds eat if feed brought near them
      if (answers.droppingsState === 'normal') score += 15;
      if (answers.ageRange === 'brooding' || answers.ageRange === 'grower') score += 20;
      if (answers.recentChange === 'feed_switch') score += 15;
      return score;
    },
    summary: 'Deficiency or wrong ratio of Calcium, Phosphorus, or Vitamin D3, causing soft, pliable bones unable to support fast muscle mass.',
    evidence: [
      'Birds sitting on hocks; beaks and long bones feel rubbery and flexible rather than rigid',
      'Chicks remain bright and hungry, actively eating if feed trough is placed directly in front of them',
      'No bloody droppings or respiratory distress',
    ],
    doThisNow: [
      'Provide Vitamin D3 + Calcium + Phosphorus water supplement immediately.',
      'Move waterers and feeder trays directly onto floor level so crippled birds do not starve or dehydrate.',
      'Verify feed mill batch quality—test if feed has adequate mineral premix.',
    ],
    whatNotToDo: [
      'DO NOT treat with antibiotics; this is purely metabolic/nutritional.',
      'DO NOT cull birds immediately if they are still alert—mineral supplementation often reverses early rickets in 4–5 days.',
    ],
    watchFor: [
      'Whether birds can stand upright after 72 hours of Vitamin D3 / mineral therapy.',
      'Bedding burns (hocks sores) developing on sitting birds.',
    ],
    whenToCallVet: [
      'More than 15% of the batch cannot stand within 48 hours.',
      'Joints feel hot, red, or filled with pus (indicates bacterial arthritis/Staph, not pure rickets).',
    ],
  },

  {
    id: 'gumboro_ibd',
    name: 'Gumboro Disease (Infectious Bursal Disease - IBD)',
    category: 'mortality',
    severity: 'Critical',
    matchRule: (answers, primary) => {
      let score = 0;
      if (primary === 'mortality' || primary === 'droppings') score += 40;
      if (answers.droppingsState === 'white') score += 40;
      if (answers.ageRange === 'grower') score += 25; // Peak Day 18-28
      if (answers.scope === 'widespread') score += 20;
      return score;
    },
    summary: 'Highly contagious viral infection targeting the Bursa of Fabricius, destroying immune defenses with a sharp spike in mortality between Day 18–28.',
    evidence: [
      'Birds pecking at their own vent; watery chalky-white vent feathers pasting',
      'Severe depression, tremors, ruffled feathers, huddling together tightly',
      'Spike in mortality that rises steeply for 3 days then subsides',
    ],
    doThisNow: [
      'Flush with electrolytes + Vitamin C + Paracetamol/Analgesic in drinking water to reduce fever and kidney stress.',
      'Increase house temperature slightly (2°C) as sick birds suffer hypothermia.',
      'Strictly disinfect footwear before entering and contain flock to prevent cross-pen transmission.',
    ],
    whatNotToDo: [
      'DO NOT vaccinate an actively infected sick flock with live IBD vaccine; it accelerates mortality.',
      'DO NOT use nephrotoxic antibiotics (like high-dose sulfonamides or gentamicin) as Gumboro already damages kidneys.',
    ],
    watchFor: [
      'Daily death curve; IBD typically peaks at day 3 of onset and recedes by day 5–7.',
      'Signs of secondary bacterial infections (E. coli) taking advantage of immune crash.',
    ],
    whenToCallVet: [
      'Urgent post-mortem required: Check if Bursa is swollen/hemorrhagic and thighs have pin-point muscle bleeds.',
      'Mortality curve climbs above 2% daily.',
    ],
  },

  {
    id: 'chronic_respiratory_disease',
    name: 'CRD (Chronic Respiratory Disease / Mycoplasma + E. coli)',
    category: 'respiratory',
    severity: 'High',
    matchRule: (answers, primary) => {
      let score = 0;
      if (primary === 'respiratory') score += 45;
      if (answers.recentChange === 'wet_litter' || answers.recentChange === 'weather_heat') score += 15;
      if (answers.eatingState === 'reduced_feed') score += 20;
      if (answers.ageRange === 'grower' || answers.ageRange === 'finisher') score += 15;
      return score;
    },
    summary: 'Mycoplasma gallisepticum complicated by secondary E. coli, provoked by poor house ventilation and ammonia fumes.',
    evidence: [
      'Snoring or clicking sounds heard clearly at night when the shed is quiet',
      'Watery eyes, foamy eye corners, nasal discharge, or facial swelling',
      'Gradual drop in feed consumption and weight stagnation',
    ],
    doThisNow: [
      'Improve side-curtain ventilation immediately—ammonia above 20 ppm paralyzes the bird’s tracheal cilia.',
      'Consult agrovet for approved respiratory antimicrobials (e.g., Tylosin, Doxycycline, or Enrofloxacin).',
      'Add menthol/essential oil vaporizers or spray to ease breathing airways.',
    ],
    whatNotToDo: [
      'DO NOT close curtains completely to "keep them warm"—trapped ammonia is the exact trigger.',
      'DO NOT leave dead or severely gasping birds in the pen—they continuously aerosolize bacteria.',
    ],
    watchFor: [
      'Swelling around the eyes turning into hard cheesy plugs (sinusitis).',
      'FCR worsening as birds consume feed without putting on weight.',
    ],
    whenToCallVet: [
      'Breathing accompanied by gasping with outstretched necks.',
      'High mortality with greenish droppings (could be velogenic Newcastle Disease rather than standard CRD).',
    ],
  },

  {
    id: 'heat_stress_flip',
    name: 'Acute Heat Stress & Heart Failure (Flip-Over)',
    category: 'mortality',
    severity: 'Urgent',
    matchRule: (answers, primary) => {
      let score = 0;
      if (primary === 'mortality' || primary === 'appetite') score += 40;
      if (answers.recentChange === 'weather_heat') score += 35;
      if (answers.ageRange === 'finisher') score += 25; // Heaviest birds succumb first
      if (answers.eatingState === 'reduced_feed' || answers.eatingState === 'reduced_water') score += 15;
      return score;
    },
    summary: 'Broilers have no sweat glands. In heavy finishers, heat buildup leads to hyperventilation, blood alkalosis, and sudden cardiac failure.',
    evidence: [
      'Heaviest, best-performing birds found dead on their backs with wings spread',
      'Intense panting, rapid chest movement, wings held loosely away from body',
      'Water consumption up 200–300% while feed intake drops to near zero during midday',
    ],
    doThisNow: [
      'Withdraw feed 2–3 hours before peak afternoon heat—digestion produces intense internal metabolic heat.',
      'Add Vitamin C (Ascorbic Acid) + Sodium Bicarbonate (baking soda) + Electrolytes to cool drinking water.',
      'Run roof sprinklers, wet burlap sacks on windward curtains, or increase fan airflow.',
      'Ensure cool drinking water—flush tank and pipes if water is warm.',
    ],
    whatNotToDo: [
      'DO NOT disturb or walk through the flock during hottest hours (12 PM – 4 PM).',
      'DO NOT feed heavy pelleted feed during the heat peak.',
      'DO NOT supply warm or sun-heated pipe water.',
    ],
    watchFor: [
      'Birds crowding under drinkers or in pen corners suffocating each other.',
      'Water meter consumption trends during 11 AM – 3 PM.',
    ],
    whenToCallVet: [
      'House temperature exceeds 33°C (91°F) for over 4 continuous hours.',
      'Sudden death of > 1% of heavy birds within 24 hours of hot weather.',
    ],
  },

  {
    id: 'stunted_growth_brooding',
    name: 'Early Brooding Stunting & Crop Starvation',
    category: 'growth',
    severity: 'Medium',
    matchRule: (answers, primary) => {
      let score = 0;
      if (primary === 'growth' || primary === 'appetite') score += 50;
      if (answers.ageRange === 'brooding' || answers.ageRange === 'grower') score += 30;
      if (answers.scope === 'cluster' || answers.scope === 'widespread') score += 15;
      return score;
    },
    summary: 'Failure of early crop fill in the first 48 hours or cold stress leads to permanent gut villi stunting and uneven flock growth.',
    evidence: [
      'Wide gap in bird sizes: 20–30% of chicks are half the size of normal birds',
      'Chicks have poor feathering, unabsorbed yolk remnants, or pasty vents',
      'Crops felt empty or hard at 24 hours post-placement',
    ],
    doThisNow: [
      'Conduct a 20-bird crop check: gently feel crops. At 24h, 95% should be soft, full, and pliable like dough.',
      'Double the number of feeder trays on paper for easy accessibility.',
      'Ensure brooding floor temperature is 32°C (not just air temp, check concrete/litter).',
      'Separate small runts into a dedicated "recovery nursery pen" with lower feeders and high-density crumble.',
    ],
    whatNotToDo: [
      'DO NOT allow larger birds to bully smaller birds away from feed troughs.',
      'DO NOT switch from starter crumble to coarse grower pellets too early.',
    ],
    watchFor: [
      '7-day body weight: target should be at least 4.5x day-old chick placement weight (~180g+).',
    ],
    whenToCallVet: [
      'Average 7-day weight is 30% below breed standard.',
      'Belly feels tight, watery, or distended (Ascites / systemic infection).',
    ],
  },
];

/**
 * Run Diagnostic Triage Algorithm
 */
export function diagnoseFlock(primarySymptomId, answers = {}) {
  const ranked = DIAGNOSTIC_CONDITIONS.map((cond) => {
    const score = cond.matchRule(answers, primarySymptomId);
    return {
      ...cond,
      score,
      confidence: Math.min(96, Math.max(25, score)),
    };
  })
    .sort((a, b) => b.score - a.score);

  const topMatch = ranked[0];
  const secondaryMatches = ranked.slice(1, 3).filter((m) => m.score > 35);

  return {
    primarySymptom: PRIMARY_SYMPTOM_CATEGORIES.find((c) => c.id === primarySymptomId) || null,
    answers,
    topMatch,
    secondaryMatches,
    timestamp: new Date().toISOString(),
  };
}
