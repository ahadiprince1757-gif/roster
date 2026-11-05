/**
 * Rosestar Poultry Problem Map & Diagnostic Engine
 * Clinical decision-support system utilizing commercial broiler diseases & symptoms
 * seeded in Supabase (Cobb 500 & Merck Veterinary Guide).
 */

import { broilerDiseases as fallbackDiseases } from './broilerDiseases.js';

/**
 * Normalise any disease row from Supabase (snake_case) or local code (camelCase).
 */
export function normalizeDisease(d) {
  if (!d) return null;
  return {
    id: d.id,
    name: d.name || 'Unknown Condition',
    category: d.category || 'General',
    severity: d.severity || 'Moderate',
    severityScore: Number(d.severity_score ?? d.severityScore ?? 2),
    commonAge: d.common_age || d.commonAge || 'Any age',
    symptoms: Array.isArray(d.symptoms) ? d.symptoms : [],
    broilerSigns: Array.isArray(d.broiler_signs)
      ? d.broiler_signs
      : Array.isArray(d.broilerSigns)
      ? d.broilerSigns
      : [],
    whatToDoNow: Array.isArray(d.what_to_do_now)
      ? d.what_to_do_now
      : Array.isArray(d.whatToDoNow)
      ? d.whatToDoNow
      : [],
    prevention: Array.isArray(d.prevention) ? d.prevention : [],
    treatment: {
      type: d.treatment_type || d.treatment?.type || 'Veterinary Consultation',
      action: d.treatment_action || d.treatment?.action || 'Isolate affected birds and seek professional veterinary guidance.',
      note: d.treatment_note || d.treatment?.note || '',
    },
    emergency: Boolean(d.emergency),
    reportable: Boolean(d.reportable),
    zoonotic: Boolean(d.zoonotic),
    veterinarian: d.veterinarian !== false,
    keywords: Array.isArray(d.keywords) ? d.keywords : [],
  };
}

export const DEFAULT_DISEASES = fallbackDiseases.map(normalizeDisease);

/**
 * Primary physiological symptom groups mapped to the 22 commercial diseases
 */
export const PRIMARY_SYMPTOM_CATEGORIES = [
  {
    id: 'respiratory',
    title: 'Breathing & Sneezing',
    subtitle: 'Gasping, night rales/snick, eye discharge, coughing, swollen sinuses',
    icon: 'Wind',
    badge: 'Urgent',
    matchingCategories: ['Viral', 'Bacterial', 'Fungal'],
  },
  {
    id: 'droppings',
    title: 'Abnormal Droppings',
    subtitle: 'Bloody droppings, chalky white paste, yellow/mustard, bright green diarrhea',
    icon: 'AlertTriangle',
    badge: 'Critical',
    matchingCategories: ['Protozoal', 'Bacterial', 'Viral'],
  },
  {
    id: 'locomotion',
    title: 'Cannot Walk / Lame',
    subtitle: 'Sitting on hocks, limping, twisted legs, swollen footpads or joints',
    icon: 'Footprints',
    badge: 'High Impact',
    matchingCategories: ['Bacterial', 'Nutritional', 'Viral'],
  },
  {
    id: 'neurological',
    title: 'Twisting Neck & Tremors',
    subtitle: 'Twisted neck (torticollis), ataxia, circling, head/neck tremors, paralysis',
    icon: 'RotateCcw',
    badge: 'Emergency',
    matchingCategories: ['Viral'],
  },
  {
    id: 'mortality',
    title: 'Sudden Mortality Spike',
    subtitle: 'Dead on back, rapid flock loss, dark purple combs, severe prostration',
    icon: 'Skull',
    badge: 'Emergency',
    matchingCategories: ['Environmental', 'Viral', 'Bacterial'],
  },
  {
    id: 'appetite',
    title: 'Not Eating / Dehydrated',
    subtitle: 'Crop empty, listless, hollow shanks, huddling under heat lamps',
    icon: 'UtensilsCrossed',
    badge: 'Early Warning',
    matchingCategories: ['Environmental', 'Bacterial', 'Protozoal'],
  },
  {
    id: 'growth',
    title: 'Not Growing / Uneven',
    subtitle: 'Runts, weight far behind target, poor feathering, pale shanks',
    icon: 'TrendingDown',
    badge: 'Economic Leak',
    matchingCategories: ['Nutritional', 'Bacterial', 'Environmental'],
  },
  {
    id: 'head_skin',
    title: 'Head, Eyes & Scabs',
    subtitle: 'Warty nodules/scabs on comb and wattles, swollen face, closed eyelids',
    icon: 'HelpCircle',
    badge: 'Specialized',
    matchingCategories: ['Viral', 'Bacterial'],
  },
];

/**
 * Quick-select symptom chips directly from the 22 seeded Supabase diseases
 */
export const COMMON_SYMPTOM_CHIPS = [
  'Bloody droppings or blood in litter',
  'Chalky white watery diarrhea',
  'Twisted neck (torticollis) / circling',
  'Difficulty breathing / open-mouth gasping',
  'Snoring or clicking sounds at night (rales)',
  'Sitting on hocks / lameness',
  'Panting with wings held away from body',
  'Dead on back with wings spread',
  'Swollen face / puffy eye discharge',
  'Warty nodules / scabs on comb or wattles',
  'Green or yellowish-green watery diarrhea',
  'Sudden rise in flock mortality rate',
  'Dehydration / hollow shanks / empty crop',
  'Head and neck tremors',
  'Sulfur-yellow watery droppings',
  'Uneven flock size / small runts',
  'Severe depression and huddling tightly',
  'Coughing blood or mucus onto walls',
  'Rubbery pliable bones and beaks',
  'Swollen warm hock joints or footpad scab',
];

export const TRIAGE_QUESTIONS = [
  {
    id: 'ageRange',
    label: 'What is the current flock age?',
    options: [
      { value: 'brooding', label: 'Day 1 – 10 (Brooding phase)' },
      { value: 'grower', label: 'Day 11 – 24 (Grower phase)' },
      { value: 'finisher', label: 'Day 25+ (Finisher / Pre-harvest)' },
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
      { value: 'normal', label: 'Normal firm brownish with white cap' },
      { value: 'bloody', label: 'Bloody or reddish currant-jelly streaks' },
      { value: 'white', label: 'Chalky watery white or creamy paste' },
      { value: 'watery_green', label: 'Bright yellowish-green watery diarrhea' },
      { value: 'yellow', label: 'Bright sulfur-yellow or mustard droppings' },
      { value: 'undigested', label: 'Wet watery with unabsorbed feed grain' },
    ],
  },
  {
    id: 'eatingState',
    label: 'Are they currently eating and drinking?',
    options: [
      { value: 'normal', label: 'Eating and drinking normally' },
      { value: 'reduced_feed', label: 'Feed consumption dropped noticeably' },
      { value: 'reduced_feed_increased_water', label: 'Feed dropped, water consumption surged (panting)' },
      { value: 'reduced_water', label: 'Water consumption dropped' },
      { value: 'refusing_all', label: 'Refusing both feed and water completely' },
    ],
  },
  {
    id: 'recentChange',
    label: 'Any recent changes on the farm in the last 48 hours?',
    options: [
      { value: 'none', label: 'No significant changes' },
      { value: 'wet_litter', label: 'Damp/wet bedding around drinkers' },
      { value: 'weather_heat', label: 'Extreme heatwave or high shed humidity' },
      { value: 'feed_switch', label: 'Changed feed brand or batch recently' },
      { value: 'vaccination', label: 'Recent vaccination within 3–4 days' },
      { value: 'cold_chilling', label: 'Chilling / power cut / brooder cold spike' },
    ],
  },
];

/**
 * Generate clinically safe contraindications ("WHAT NOT TO DO") based on disease profile
 */
function generateWhatNotToDo(disease) {
  const mistakes = [];
  const cat = (disease.category || '').toLowerCase();
  const id = disease.id || '';

  if (cat.includes('viral')) {
    mistakes.push('DO NOT administer random antibiotics hoping to cure the virus — antibiotics do not kill viruses.');
    mistakes.push('DO NOT vaccinate an actively sick flock with live vaccine; it triggers higher mortality.');
  }

  if (id.includes('coccidiosis')) {
    mistakes.push('DO NOT rely on medicated feed alone — sick birds stop eating before they stop drinking; use drinking water.');
    mistakes.push('DO NOT use broad-spectrum tetracyclines; coccidia are protozoa requiring targeted anticoccidials.');
  }

  if (id.includes('heat_stress')) {
    mistakes.push('DO NOT feed heavy pellets during the hottest hours (11 AM – 4 PM) — digestion creates massive internal heat.');
    mistakes.push('DO NOT supply warm or sun-heated pipeline water; flush lines to keep water cool.');
  }

  if (id.includes('nutritional') || id.includes('rickets')) {
    mistakes.push('DO NOT treat with antibiotics; this is metabolic/nutritional and requires mineral + vitamin D3 rebalancing.');
    mistakes.push('DO NOT cull alert birds prematurely; early rickets can reverse with oral minerals in 3–5 days.');
  }

  if (id.includes('mycoplasma') || id.includes('crd') || id.includes('coryza')) {
    mistakes.push('DO NOT close curtains completely to "keep them warm" — trapped ammonia gas is the exact trigger for respiratory flare-ups.');
  }

  if (id.includes('gumboro') || id.includes('pullorum')) {
    mistakes.push('DO NOT administer nephrotoxic drugs (like high-dose sulphas) without vet approval, as kidneys are already inflamed.');
  }

  if (mistakes.length === 0) {
    mistakes.push('DO NOT guess antibiotic dosages without veterinary diagnostic sensitivity testing.');
    mistakes.push('DO NOT leave dead or moribund birds in the pen — they continuously aerosolize pathogens.');
  }

  return mistakes;
}

/**
 * Generate daily monitoring checkpoints ("WATCH FOR TODAY")
 */
function generateWatchFor(disease) {
  const watchList = [];
  const id = disease.id || '';

  if (id.includes('coccidiosis') || id.includes('necrotic')) {
    watchList.push('Check whether droppings transition from red/bloody back to brown within 36–48 hours of water medication.');
    watchList.push('Litter moisture levels near drinkers and wall edges.');
  } else if (id.includes('heat_stress')) {
    watchList.push('Water meter flow rate between 11 AM and 3 PM compared to flock baseline.');
    watchList.push('Any birds crowding under drinkers or in house corners suffocating each other.');
  } else if (id.includes('respiratory') || id.includes('crd') || id.includes('bronchitis') || id.includes('laryngo')) {
    watchList.push('Night rales / snoring clicking sounds 1 hour after shed lights are dimmed.');
    watchList.push('Whether eye discharge turns into hard cheesy facial swellings.');
  } else {
    watchList.push('Flock mortality trend over the next 12 and 24 hours.');
    watchList.push('Spread of symptoms from initial cluster into neighboring pens or drinker lines.');
  }

  watchList.push('Feed conversion and daily water intake compared to Cobb 500 standard.');
  return watchList;
}

/**
 * Generate escalation rules ("WHEN TO CALL A VET")
 */
function generateWhenToCallVet(disease) {
  const rules = [];

  if (disease.emergency || disease.severity === 'Critical') {
    rules.push('CALL A VETERINARIAN IMMEDIATELY: This is a high-severity critical flock condition with risk of catastrophic loss.');
  }

  if (disease.reportable) {
    rules.push('LEGAL OBLIGATION: Report immediately to local animal-health or veterinary authorities.');
  }

  if (disease.zoonotic) {
    rules.push('BIO-HAZARD WARNING: Potential zoonotic transmission to humans. Wear N95 masks, gloves, and strict PPE.');
  }

  rules.push('Flock mortality exceeds 0.5% – 1% in a single 24-hour window.');
  rules.push('No clinical response or improvement within 48 hours of initiating first-line management protocol.');
  rules.push('Need for necropsy (post-mortem examination) to inspect internal organs (caeca, bursa, lungs, liver).');

  return rules;
}

/**
 * Run Diagnostic Triage Algorithm over the live 22 seeded Supabase broiler diseases.
 * Supports both signatures:
 *   - diagnoseFlock(diseasesList, options)
 *   - diagnoseFlock(primarySymptomId, answers) [backward compatibility]
 */
export function diagnoseFlock(arg1, arg2 = {}) {
  let diseases = DEFAULT_DISEASES;
  let options = {};

  if (Array.isArray(arg1)) {
    diseases = arg1.length > 0 ? arg1.map(normalizeDisease) : DEFAULT_DISEASES;
    options = arg2 || {};
  } else if (typeof arg1 === 'string') {
    options = {
      primarySymptomId: arg1,
      answers: arg2 || {},
    };
  }

  const {
    primarySymptomId = null,
    selectedSymptoms = [],
    answers = {},
    freeformText = '',
  } = options;

  const freeform = (freeformText || '').toLowerCase().trim();
  const selectedSymSet = new Set(selectedSymptoms.map((s) => s.toLowerCase()));

  // Score each disease against clinical evidence
  const scored = diseases.map((disease) => {
    let score = 0;
    const evidence = [];

    const dName = (disease.name || '').toLowerCase();
    const dSymptoms = (disease.symptoms || []).map((s) => s.toLowerCase());
    const dSigns = (disease.broilerSigns || []).map((s) => s.toLowerCase());
    const dKeywords = (disease.keywords || []).map((s) => s.toLowerCase());
    const dCommonAge = (disease.commonAge || '').toLowerCase();
    const dCategory = (disease.category || '').toLowerCase();

    // 1. Match selected symptom chips
    selectedSymSet.forEach((sym) => {
      const matchSymptom = dSymptoms.some((ds) => ds.includes(sym) || sym.includes(ds));
      const matchSign = dSigns.some((ds) => ds.includes(sym) || sym.includes(ds));
      const matchKeyword = dKeywords.some((k) => sym.includes(k));

      if (matchSymptom) {
        score += 35;
        evidence.push(sym);
      } else if (matchSign || matchKeyword) {
        score += 20;
        evidence.push(sym);
      }
    });

    // 2. Match freeform text input
    if (freeform) {
      if (dName && freeform.includes(dName)) {
        score += 45;
        evidence.push(`Direct condition mention: "${disease.name}"`);
      }

      dKeywords.forEach((kw) => {
        if (kw.length > 2 && freeform.includes(kw)) {
          score += 15;
          evidence.push(`Clinical keyword: "${kw}"`);
        }
      });

      dSymptoms.forEach((s) => {
        const words = s.split(/\s+/).filter((w) => w.length > 3);
        const hit = words.filter((w) => freeform.includes(w));
        if (hit.length >= 2) {
          score += 25;
          evidence.push(s);
        }
      });
    }

    // 3. Primary Observation Category alignment
    if (primarySymptomId) {
      if (primarySymptomId === 'respiratory') {
        if (
          dCategory === 'bacterial' ||
          dCategory === 'viral' ||
          dCategory === 'fungal' ||
          dKeywords.some((k) => ['crd', 'respiratory', 'cough', 'gasp', 'snick', 'rales', 'sinus', 'trachea'].includes(k)) ||
          dSymptoms.some((s) => s.includes('breath') || s.includes('gasp') || s.includes('cough') || s.includes('rales'))
        ) {
          score += 25;
        }
      } else if (primarySymptomId === 'droppings') {
        if (
          disease.id.includes('coccidiosis') ||
          disease.id.includes('necrotic') ||
          disease.id.includes('bursal') ||
          disease.id.includes('pullorum') ||
          disease.id.includes('histomoniasis') ||
          disease.id.includes('salmonella') ||
          dSymptoms.some((s) => s.includes('diarrhea') || s.includes('dropping'))
        ) {
          score += 30;
        }
      } else if (primarySymptomId === 'locomotion') {
        if (
          disease.id.includes('staphylococcal') ||
          disease.id.includes('nutritional') ||
          disease.id.includes('marek') ||
          disease.id.includes('encephalomyelitis') ||
          dSymptoms.some((s) => s.includes('hock') || s.includes('walk') || s.includes('lame') || s.includes('paralysis'))
        ) {
          score += 30;
        }
      } else if (primarySymptomId === 'neurological') {
        if (
          disease.id.includes('newcastle') ||
          disease.id.includes('encephalomyelitis') ||
          disease.id.includes('marek') ||
          dSymptoms.some((s) => s.includes('neck') || s.includes('torticollis') || s.includes('tremor') || s.includes('circling'))
        ) {
          score += 40;
        }
      } else if (primarySymptomId === 'mortality') {
        if (
          disease.severityScore >= 3 ||
          disease.emergency ||
          disease.id.includes('heat_stress') ||
          disease.id.includes('influenza') ||
          disease.id.includes('cholera') ||
          disease.id.includes('bursal')
        ) {
          score += 25;
        }
      } else if (primarySymptomId === 'appetite') {
        if (
          disease.id.includes('dehydration') ||
          disease.id.includes('bursal') ||
          disease.id.includes('pullorum') ||
          disease.id.includes('coccidiosis') ||
          dSymptoms.some((s) => s.includes('appetite') || s.includes('thirst') || s.includes('feed intake'))
        ) {
          score += 25;
        }
      } else if (primarySymptomId === 'growth') {
        if (
          disease.id.includes('nutritional') ||
          disease.id.includes('ecoli') ||
          disease.id.includes('necrotic') ||
          disease.id.includes('aspergillosis') ||
          dSigns.some((s) => s.includes('uniformity') || s.includes('weight') || s.includes('runt'))
        ) {
          score += 25;
        }
      } else if (primarySymptomId === 'head_skin') {
        if (
          disease.id.includes('pox') ||
          disease.id.includes('coryza') ||
          disease.id.includes('bronchitis') ||
          dSymptoms.some((s) => s.includes('comb') || s.includes('wattle') || s.includes('scab') || s.includes('face'))
        ) {
          score += 35;
        }
      }
    }

    // 4. Age compatibility alignment
    const age = answers.ageRange;
    if (age === 'brooding') {
      if (
        dCommonAge.includes('day 1') ||
        dCommonAge.includes('chick') ||
        dCommonAge.includes('brooding') ||
        dCommonAge.includes('young')
      ) {
        score += 20;
      }
    } else if (age === 'grower') {
      if (
        dCommonAge.includes('grow') ||
        dCommonAge.includes('3–6 weeks') ||
        dCommonAge.includes('14 to 35') ||
        dCommonAge.includes('day 14')
      ) {
        score += 20;
      }
    } else if (age === 'finisher') {
      if (
        dCommonAge.includes('finisher') ||
        dCommonAge.includes('older') ||
        dCommonAge.includes('week 4') ||
        dCommonAge.includes('heavy') ||
        dCommonAge.includes('pre-market')
      ) {
        score += 20;
      }
    }
    if (dCommonAge.includes('any age')) {
      score += 8;
    }

    // 5. Droppings alignment
    const dr = answers.droppingsState;
    if (dr === 'bloody') {
      if (disease.id.includes('coccidiosis')) {
        score += 55;
        evidence.push('Bloody currant-jelly droppings strongly indicate Caecal Coccidiosis.');
      } else if (disease.id.includes('necrotic')) {
        score += 40;
        evidence.push('Dark/bloody diarrhea matches Clostridial Necrotic Enteritis.');
      }
    } else if (dr === 'white') {
      if (disease.id.includes('bursal')) {
        score += 50;
        evidence.push('Chalky white vent feathers pasting is classic Gumboro (IBD).');
      } else if (disease.id.includes('pullorum')) {
        score += 50;
        evidence.push('White diarrhea paste in young chicks indicates Pullorum disease.');
      }
    } else if (dr === 'watery_green') {
      if (disease.id.includes('newcastle')) {
        score += 45;
        evidence.push('Bright green watery diarrhea indicates Newcastle challenge.');
      } else if (disease.id.includes('cholera')) {
        score += 35;
        evidence.push('Greenish diarrhea matches Fowl Cholera.');
      }
    } else if (dr === 'yellow') {
      if (disease.id.includes('histomoniasis')) {
        score += 55;
        evidence.push('Bright sulfur-yellow droppings are pathognomonic for Histomoniasis (Blackhead).');
      }
    } else if (dr === 'undigested') {
      if (disease.id.includes('necrotic') || disease.id.includes('ecoli')) {
        score += 25;
        evidence.push('Undigested feed passage indicates dysbiosis or gut wall enteritis.');
      }
    }

    // 6. Eating & Drinking Behavior
    const eat = answers.eatingState;
    if (eat === 'reduced_feed_increased_water') {
      if (disease.id.includes('heat_stress')) {
        score += 50;
        evidence.push('Rapid panting + feed refusal with surging water consumption confirms acute heat stress.');
      }
    } else if (eat === 'refusing_all') {
      if (disease.severityScore >= 3 || disease.id.includes('dehydration') || disease.id.includes('bursal')) {
        score += 20;
        evidence.push('Total refusal of both feed and water indicates critical systemic toxemia or chilling.');
      }
    } else if (eat === 'normal') {
      if (disease.id.includes('nutritional') || disease.id.includes('staphylococcal')) {
        score += 20;
        evidence.push('Birds remain bright and hungry, eating readily if feed is brought within reach.');
      }
    }

    // 7. Recent Changes
    const change = answers.recentChange;
    if (change === 'weather_heat' && disease.id.includes('heat_stress')) {
      score += 45;
      evidence.push('Recent extreme heatwave directly matches broiler heat exhaustion.');
    } else if (change === 'wet_litter' && (disease.id.includes('coccidiosis') || disease.id.includes('mycoplasma'))) {
      score += 25;
      evidence.push('Damp litter and drinker leaks incubate oocysts and elevate ammonia.');
    } else if (change === 'feed_switch' && (disease.id.includes('necrotic') || disease.id.includes('nutritional'))) {
      score += 25;
      evidence.push('Abrupt feed change triggers dysbiosis or unmasks mineral ratio deficits.');
    } else if (change === 'cold_chilling' && (disease.id.includes('aspergillosis') || disease.id.includes('dehydration') || disease.id.includes('bronchitis'))) {
      score += 25;
      evidence.push('Brooder chilling weakens respiratory cilia and lowers gut mobility.');
    }

    // Default evidence fallback if scored
    const uniqueEvidence = Array.from(new Set(evidence));
    if (uniqueEvidence.length === 0 && score > 0) {
      if (disease.broilerSigns?.length > 0) {
        uniqueEvidence.push(disease.broilerSigns[0]);
      } else if (disease.symptoms?.length > 0) {
        uniqueEvidence.push(disease.symptoms[0]);
      }
    }

    // Calculate normalized confidence percentage (between 30% and 96%)
    const confidence = Math.min(96, Math.max(30, Math.round(score * 0.75 + disease.severityScore * 3)));

    return {
      ...disease,
      score,
      confidence,
      evidence: uniqueEvidence,
      summary:
        disease.broilerSigns?.[0] ||
        disease.symptoms?.[0] ||
        'Commercial broiler clinical condition requiring close biosecurity and immediate management.',
      doThisNow: disease.whatToDoNow?.length > 0 ? disease.whatToDoNow : [
        'Isolate any affected birds immediately from healthy flock.',
        'Review ventilation, litter dryness, and clean water availability.',
        'Contact poultry veterinarian for confirmation.',
      ],
      whatNotToDo: generateWhatNotToDo(disease),
      watchFor: generateWatchFor(disease),
      whenToCallVet: generateWhenToCallVet(disease),
    };
  });

  // Sort descending by score
  const ranked = scored.sort((a, b) => b.score - a.score);

  // If no conditions scored, provide a safe top match
  const topMatch = ranked[0]?.score > 0 ? ranked[0] : {
    ...ranked[0],
    confidence: 45,
    evidence: ['General flock observation required. Complete triage questions to narrow down.'],
  };

  const secondaryMatches = ranked
    .slice(1, 4)
    .filter((m) => m.score > 20 && m.id !== topMatch.id);

  return {
    primarySymptom: PRIMARY_SYMPTOM_CATEGORIES.find((c) => c.id === primarySymptomId) || null,
    answers,
    topMatch,
    secondaryMatches,
    allRanked: ranked.slice(0, 8),
    timestamp: new Date().toISOString(),
    totalDiseasesEvaluated: diseases.length,
  };
}
