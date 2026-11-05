import React, { useState, useEffect, useMemo } from 'react';
import {
  PRIMARY_SYMPTOM_CATEGORIES,
  COMMON_SYMPTOM_CHIPS,
  TRIAGE_QUESTIONS,
  diagnoseFlock,
  normalizeDisease,
  DEFAULT_DISEASES,
} from '../../data/diagnosticEngine';
import { fetchBroilerDiseases } from '../../api/farmApi';
import { useFarm } from '../../context/FarmContext';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  Database,
  Footprints,
  HeartCrack,
  HelpCircle,
  Info,
  PhoneCall,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Skull,
  Sparkles,
  Stethoscope,
  TrendingDown,
  UtensilsCrossed,
  Wind,
  X,
  XCircle,
} from 'lucide-react';

const ICON_MAP = {
  Footprints,
  Wind,
  AlertTriangle,
  RotateCcw,
  Skull,
  TrendingDown,
  UtensilsCrossed,
  HelpCircle,
};

const CATEGORY_CHIPS = [
  'All',
  'Viral',
  'Bacterial',
  'Protozoal',
  'Fungal',
  'Nutritional',
  'Environmental',
];

const DiagnoseView = ({ onSaveToRecords, onNavigate }) => {
  const { farmData, addHealth } = useFarm();

  // Mode: 'triage' (3-step wizard) or 'library' (encyclopedia of all 22 diseases)
  const [activeMode, setActiveMode] = useState('triage');

  // Supabase Seeded Diseases State
  const [diseases, setDiseases] = useState(DEFAULT_DISEASES);
  const [isLoadingDiseases, setIsLoadingDiseases] = useState(false);
  const [dataSource, setDataSource] = useState('local'); // 'supabase' | 'local'

  // Triage Wizard Step: 1 = Symptom selection, 2 = Triage questions, 3 = Result
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [freeformText, setFreeformText] = useState('');
  const [showAllChips, setShowAllChips] = useState(false);

  // Triage Answers
  const [answers, setAnswers] = useState({
    ageRange: 'grower',
    scope: 'cluster',
    droppingsState: 'normal',
    eatingState: 'normal',
    recentChange: 'none',
  });

  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedLibraryDisease, setSelectedLibraryDisease] = useState(null);

  // Library Filters
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryCategory, setLibraryCategory] = useState('All');

  // ── Fetch Seeded Diseases from Supabase on Mount ──────────────────────────────
  const loadDiseasesFromSupabase = async () => {
    setIsLoadingDiseases(true);
    try {
      const data = await fetchBroilerDiseases();
      if (Array.isArray(data) && data.length > 0) {
        setDiseases(data.map(normalizeDisease));
        setDataSource('supabase');
      } else {
        setDiseases(DEFAULT_DISEASES);
        setDataSource('local');
      }
    } catch (err) {
      console.warn('[DiagnoseView] Error loading diseases from Supabase:', err);
      setDiseases(DEFAULT_DISEASES);
      setDataSource('local');
    } finally {
      setIsLoadingDiseases(false);
    }
  };

  useEffect(() => {
    loadDiseasesFromSupabase();
  }, []);

  // ── Curated Top Symptoms ──────────────────────────────────────────────────
  const visibleChips = useMemo(() => {
    return showAllChips ? COMMON_SYMPTOM_CHIPS : COMMON_SYMPTOM_CHIPS.slice(0, 8);
  }, [showAllChips]);

  // ── Toggle Symptom Selection ──────────────────────────────────────────────
  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  // ── Category Select ───────────────────────────────────────────────────────
  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    setStep(2);
  };

  // ── Freeform Symptom Submission ───────────────────────────────────────────
  const handleFreeformSubmit = (e) => {
    e.preventDefault();
    if (!freeformText.trim()) return;

    const lower = freeformText.toLowerCase();
    let bestCat = selectedCategory || 'respiratory';

    if (lower.includes('walk') || lower.includes('leg') || lower.includes('hock') || lower.includes('limp') || lower.includes('paraly')) {
      bestCat = 'locomotion';
    } else if (lower.includes('neck') || lower.includes('twist') || lower.includes('tremor') || lower.includes('circl')) {
      bestCat = 'neurological';
    } else if (lower.includes('blood') || lower.includes('drop') || lower.includes('diarrhea') || lower.includes('poop') || lower.includes('white')) {
      bestCat = 'droppings';
    } else if (lower.includes('breath') || lower.includes('sneez') || lower.includes('cough') || lower.includes('gasp') || lower.includes('rales') || lower.includes('snick')) {
      bestCat = 'respiratory';
    } else if (lower.includes('dead') || lower.includes('die') || lower.includes('mortality') || lower.includes('spike')) {
      bestCat = 'mortality';
    } else if (lower.includes('eat') || lower.includes('water') || lower.includes('drink') || lower.includes('dehydrat') || lower.includes('crop')) {
      bestCat = 'appetite';
    } else if (lower.includes('comb') || lower.includes('wattle') || lower.includes('scab') || lower.includes('pox') || lower.includes('swollen head')) {
      bestCat = 'head_skin';
    } else if (lower.includes('grow') || lower.includes('weight') || lower.includes('runt') || lower.includes('small')) {
      bestCat = 'growth';
    }

    setSelectedCategory(bestCat);
    setStep(2);
  };

  // ── Run Diagnosis Algorithm ───────────────────────────────────────────────
  const handleRunDiagnosis = () => {
    const result = diagnoseFlock(diseases, {
      primarySymptomId: selectedCategory,
      selectedSymptoms,
      answers,
      freeformText,
    });
    setDiagnosisResult(result);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Reset Triage ──────────────────────────────────────────────────────────
  const handleReset = () => {
    setStep(1);
    setSelectedCategory(null);
    setSelectedSymptoms([]);
    setFreeformText('');
    setDiagnosisResult(null);
    setSavedSuccess(false);
  };

  // ── Save Result to Farm Health Records ────────────────────────────────────
  const handleSaveToFlock = () => {
    if (!diagnosisResult?.topMatch) return;
    const { topMatch, primarySymptom } = diagnosisResult;

    const eventName = `Triage: ${topMatch.name}`;
    const notes = [
      `Category: ${topMatch.category} (${topMatch.severity} Severity, ${topMatch.confidence}% match)`,
      primarySymptom ? `Initial sign: ${primarySymptom.title}` : null,
      topMatch.evidence?.length > 0 ? `Evidence: ${topMatch.evidence.join('; ')}` : null,
      `Action: ${topMatch.doThisNow?.[0] || 'Isolate and monitor flock.'}`,
    ].filter(Boolean).join('\n');

    if (typeof addHealth === 'function') {
      addHealth({
        name: eventName,
        date: new Date().toISOString().split('T')[0],
        type: 'Treatment',
        method: 'Drinking water / Management',
        status: 'Completed',
        notes,
      });
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  // ── Copy Clinical Summary ─────────────────────────────────────────────────
  const handleCopySummary = () => {
    if (!diagnosisResult) return;
    const { topMatch, primarySymptom, answers: a } = diagnosisResult;

    const text = [
      `[ROSESTAR POULTRY CLINICAL TRIAGE REPORT]`,
      `Database: Supabase Broiler Disease Catalog (22 Commercial Diseases)`,
      `Flock Age Phase: ${a.ageRange} | Scope: ${a.scope}`,
      `Primary Presentation: ${primarySymptom?.title || 'General Symptoms'}`,
      `Suspected Diagnosis: ${topMatch.name} (${topMatch.confidence}% match)`,
      `Severity: ${topMatch.severity} | Category: ${topMatch.category}`,
      `Common Age: ${topMatch.commonAge}`,
      ``,
      `MATCHING EVIDENCE:`,
      ...(topMatch.evidence || []).map((e) => `• ${e}`),
      ``,
      `DO THIS RIGHT NOW:`,
      ...(topMatch.doThisNow || []).map((step, i) => `${i + 1}. ${step}`),
      ``,
      `WHAT NOT TO DO:`,
      ...(topMatch.whatNotToDo || []).map((m) => `! ${m}`),
      ``,
      `TREATMENT GUIDANCE:`,
      `• Type: ${topMatch.treatment?.type || 'Veterinary Directed'}`,
      `• Action: ${topMatch.treatment?.action || 'Supportive care'}`,
      topMatch.treatment?.note ? `• Note: ${topMatch.treatment.note}` : null,
      ``,
      `WHEN TO CALL VET:`,
      ...(topMatch.whenToCallVet || []).map((v) => `* ${v}`),
    ].filter(Boolean).join('\n');

    navigator.clipboard?.writeText(text);
    alert('Clinical summary copied to clipboard!');
  };

  // ── Filtered Diseases in Library View ─────────────────────────────────────
  const filteredLibraryDiseases = useMemo(() => {
    return diseases.filter((d) => {
      if (libraryCategory !== 'All' && d.category !== libraryCategory) return false;
      if (librarySearch.trim()) {
        const needle = librarySearch.toLowerCase().trim();
        const haystack = [
          d.name,
          d.category,
          d.commonAge,
          ...(d.symptoms || []),
          ...(d.broilerSigns || []),
          ...(d.keywords || []),
        ].join(' ').toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });
  }, [diseases, libraryCategory, librarySearch]);

  return (
    <div className="diag-clean-wrap">
      {/* ── Minimalist Top Identity ── */}
      <header className="diag-min-head">
        <div className="diag-min-meta-row">
          <span className="diag-min-eyebrow">Poultry Triage</span>
          <span className={`diag-min-db-badge ${dataSource === 'supabase' ? 'live' : 'local'}`}>
            <span className="diag-min-dot" />
            {dataSource === 'supabase' ? '22 Diseases (Supabase)' : '22 Diseases (Active)'}
          </span>
        </div>

        <h1 className="diag-min-title">
          {activeMode === 'library'
            ? 'Disease Catalog'
            : step === 1
            ? 'Flock Symptom Check'
            : step === 2
            ? 'Triage Questions'
            : 'Diagnosis & Protocol'}
        </h1>

        {/* Minimalist Segmented Pill */}
        <div className="diag-min-seg">
          <button
            className={`diag-min-seg-item ${activeMode === 'triage' ? 'active' : ''}`}
            onClick={() => setActiveMode('triage')}
          >
            <Activity size={13} />
            <span>Triage Doctor</span>
          </button>
          <button
            className={`diag-min-seg-item ${activeMode === 'library' ? 'active' : ''}`}
            onClick={() => setActiveMode('library')}
          >
            <BookOpen size={13} />
            <span>Catalog ({diseases.length})</span>
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          MODE A: TRIAGE WIZARD
         ══════════════════════════════════════════════════════════════════ */}
      {activeMode === 'triage' && (
        <>
          {/* ────────────────────────────────────────────────────────────
              STEP 1: MINIMALIST SYMPTOM SELECTION
             ──────────────────────────────────────────────────────────── */}
          {step === 1 && (
            <div className="diag-min-step">
              {/* Minimal Search & Describe input */}
              <form onSubmit={handleFreeformSubmit} className="diag-min-search">
                <Search size={15} className="diag-min-search-icon" />
                <input
                  type="text"
                  value={freeformText}
                  onChange={(e) => setFreeformText(e.target.value)}
                  placeholder="Describe symptoms e.g. bloody droppings, twisted neck..."
                  className="diag-min-input"
                />
                {freeformText.trim() && (
                  <button type="submit" className="diag-min-search-submit">
                    <ArrowRight size={14} />
                  </button>
                )}
              </form>

              {/* Quick Symptom Chips */}
              <div className="diag-min-chips-section">
                <div className="diag-min-chips-head">
                  <span>Common Signs</span>
                  {selectedSymptoms.length > 0 && (
                    <button
                      type="button"
                      className="diag-min-clear-btn"
                      onClick={() => setSelectedSymptoms([])}
                    >
                      Clear ({selectedSymptoms.length})
                    </button>
                  )}
                </div>

                <div className="diag-min-chips-row">
                  {visibleChips.map((symptom) => {
                    const isSelected = selectedSymptoms.includes(symptom);
                    return (
                      <button
                        key={symptom}
                        type="button"
                        className={`diag-min-chip ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleSymptom(symptom)}
                      >
                        {isSelected && <Check size={12} />}
                        <span>{symptom}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="diag-min-more-chips-btn"
                  onClick={() => setShowAllChips(!showAllChips)}
                >
                  <span>{showAllChips ? 'Show fewer signs' : `+ Show more symptoms (${COMMON_SYMPTOM_CHIPS.length - 8})`}</span>
                  {showAllChips ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
              </div>

              {/* Active Selected Banner */}
              {selectedSymptoms.length > 0 && (
                <div className="diag-min-selected-bar">
                  <div className="diag-min-selected-text">
                    <strong>{selectedSymptoms.length} selected:</strong>{' '}
                    <span>{selectedSymptoms.join(', ')}</span>
                  </div>
                  <button
                    type="button"
                    className="diag-min-next-btn"
                    onClick={() => {
                      setSelectedCategory(selectedCategory || 'respiratory');
                      setStep(2);
                    }}
                  >
                    <span>Proceed</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}

              {/* Minimal 2-Column Category Grid */}
              <div className="diag-min-cat-head">
                <span>Or select primary body system:</span>
              </div>

              <div className="diag-min-cat-grid">
                {PRIMARY_SYMPTOM_CATEGORIES.map((cat) => {
                  const IconComp = ICON_MAP[cat.icon] || AlertTriangle;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className="diag-min-cat-card"
                      onClick={() => handleSelectCategory(cat.id)}
                    >
                      <div className="diag-min-cat-icon">
                        <IconComp size={18} />
                      </div>
                      <div className="diag-min-cat-info">
                        <h3 className="diag-min-cat-name">{cat.title}</h3>
                        <span className="diag-min-cat-sub">{cat.subtitle}</span>
                      </div>
                      <ChevronRight size={14} className="diag-min-cat-arrow" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────────
              STEP 2: CLEAN MINIMALIST TRIAGE QUESTIONS
             ──────────────────────────────────────────────────────────── */}
          {step === 2 && (
            <div className="diag-min-step">
              <div className="diag-min-subnav">
                <button className="diag-min-back" onClick={() => setStep(1)}>
                  <ChevronLeft size={15} />
                  <span>Back</span>
                </button>
                <span className="diag-min-active-pill">
                  {PRIMARY_SYMPTOM_CATEGORIES.find((c) => c.id === selectedCategory)?.title || 'Observations'}
                  {selectedSymptoms.length > 0 && ` (${selectedSymptoms.length} signs)`}
                </span>
              </div>

              <div className="diag-min-questions">
                {TRIAGE_QUESTIONS.map((q, idx) => (
                  <div key={q.id} className="diag-min-q-item">
                    <span className="diag-min-q-num">0{idx + 1}. {q.label}</span>
                    <div className="diag-min-options">
                      {q.options.map((opt) => {
                        const isSelected = answers[q.id] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            className={`diag-min-opt-btn ${isSelected ? 'selected' : ''}`}
                            onClick={() => setAnswers({ ...answers, [q.id]: opt.value })}
                          >
                            <span className="diag-min-opt-radio">
                              {isSelected && <span className="diag-min-radio-dot" />}
                            </span>
                            <span className="diag-min-opt-text">{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="diag-min-footer-action">
                <button className="diag-min-action-btn" onClick={handleRunDiagnosis}>
                  <span>Analyze Flock ({diseases.length} Diseases)</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────────
              STEP 3: CLEAN CLINICAL DECISION & PROTOCOL
             ──────────────────────────────────────────────────────────── */}
          {step === 3 && diagnosisResult && (
            <div className="diag-min-step">
              <div className="diag-min-subnav">
                <button className="diag-min-back" onClick={() => setStep(2)}>
                  <ChevronLeft size={15} />
                  <span>Adjust answers</span>
                </button>
                <button className="diag-min-reset" onClick={handleReset}>
                  <RotateCcw size={13} />
                  <span>New Check</span>
                </button>
              </div>

              {/* Hero Result */}
              <div className="diag-min-hero-card">
                <div className="diag-min-hero-tags">
                  <span className={`diag-min-sev-pill ${diagnosisResult.topMatch.severity?.toLowerCase()}`}>
                    {diagnosisResult.topMatch.severity}
                  </span>
                  <span className="diag-min-cat-pill">
                    {diagnosisResult.topMatch.category}
                  </span>
                  <span className="diag-min-pct-pill">
                    {diagnosisResult.topMatch.confidence}% Probability
                  </span>
                  {diagnosisResult.topMatch.emergency && (
                    <span className="diag-min-emg-pill">Emergency</span>
                  )}
                  {diagnosisResult.topMatch.reportable && (
                    <span className="diag-min-rep-pill">Reportable</span>
                  )}
                </div>

                <h2 className="diag-min-hero-name">{diagnosisResult.topMatch.name}</h2>
                <div className="diag-min-hero-age">
                  <strong>Susceptible Age:</strong> {diagnosisResult.topMatch.commonAge}
                </div>
                <p className="diag-min-hero-desc">{diagnosisResult.topMatch.summary}</p>

                {diagnosisResult.topMatch.evidence?.length > 0 && (
                  <div className="diag-min-evidence">
                    <span className="diag-min-ev-label">MATCHING EVIDENCE:</span>
                    <ul className="diag-min-ev-list">
                      {diagnosisResult.topMatch.evidence.map((ev, i) => (
                        <li key={i}>
                          <CheckCircle2 size={13} />
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* DO THIS RIGHT NOW */}
              <div className="diag-min-card action">
                <div className="diag-min-card-head">
                  <ShieldAlert size={16} />
                  <h3>DO THIS RIGHT NOW</h3>
                </div>
                <ol className="diag-min-steps">
                  {diagnosisResult.topMatch.doThisNow.map((act, i) => (
                    <li key={i}>
                      <span className="diag-min-step-idx">{i + 1}</span>
                      <span className="diag-min-step-txt">{act}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* TREATMENT & GUIDANCE */}
              {diagnosisResult.topMatch.treatment && (
                <div className="diag-min-card treatment">
                  <div className="diag-min-card-head">
                    <Activity size={16} />
                    <h3>TREATMENT &amp; VET GUIDANCE</h3>
                  </div>
                  <div className="diag-min-treatment-body">
                    <div className="diag-min-t-row">
                      <span className="t-lbl">Type:</span>
                      <span className="t-val">{diagnosisResult.topMatch.treatment.type}</span>
                    </div>
                    <p className="diag-min-t-action">{diagnosisResult.topMatch.treatment.action}</p>
                    {diagnosisResult.topMatch.treatment.note && (
                      <p className="diag-min-t-note">{diagnosisResult.topMatch.treatment.note}</p>
                    )}
                  </div>
                </div>
              )}

              {/* PREVENTION */}
              {diagnosisResult.topMatch.prevention?.length > 0 && (
                <div className="diag-min-card prevention">
                  <div className="diag-min-card-head">
                    <ShieldCheck size={16} />
                    <h3>PREVENTION PROTOCOL</h3>
                  </div>
                  <ul className="diag-min-bullet-list">
                    {diagnosisResult.topMatch.prevention.map((prev, i) => (
                      <li key={i}>
                        <Check size={13} />
                        <span>{prev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* WHAT NOT TO DO */}
              <div className="diag-min-card mistakes">
                <div className="diag-min-card-head">
                  <XCircle size={16} />
                  <h3>WHAT NOT TO DO</h3>
                </div>
                <ul className="diag-min-mistakes-list">
                  {diagnosisResult.topMatch.whatNotToDo.map((m, i) => (
                    <li key={i}>
                      <AlertCircle size={14} />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Secondary Differential Diagnoses */}
              {diagnosisResult.secondaryMatches?.length > 0 && (
                <div className="diag-min-diff-card">
                  <h4>Differential Diagnoses</h4>
                  <div className="diag-min-diff-items">
                    {diagnosisResult.secondaryMatches.map((sec) => (
                      <div
                        key={sec.id}
                        className="diag-min-diff-row"
                        onClick={() => setSelectedLibraryDisease(sec)}
                      >
                        <div className="diag-min-diff-top">
                          <span className="diff-name">{sec.name}</span>
                          <span className="diff-pct">{sec.confidence}% match</span>
                        </div>
                        <p className="diff-desc">{sec.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Sticky Action Bar */}
              <div className="diag-min-action-bar">
                <button className="diag-min-btn-sec" onClick={handleCopySummary}>
                  <Copy size={14} />
                  <span>Copy Report</span>
                </button>
                <button
                  className="diag-min-btn-pri"
                  onClick={handleSaveToFlock}
                  disabled={savedSuccess}
                >
                  {savedSuccess ? (
                    <>
                      <CheckCircle2 size={15} />
                      <span>Logged to Records</span>
                    </>
                  ) : (
                    <>
                      <HeartCrack size={15} />
                      <span>Save to Records</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODE B: MINIMALIST DISEASE CATALOG
         ══════════════════════════════════════════════════════════════════ */}
      {activeMode === 'library' && (
        <div className="diag-min-library">
          {/* Search bar */}
          <div className="diag-min-lib-search">
            <Search size={15} />
            <input
              type="text"
              value={librarySearch}
              onChange={(e) => setLibrarySearch(e.target.value)}
              placeholder="Search diseases or symptoms (e.g. coccidia, rales)..."
            />
            {librarySearch && (
              <button onClick={() => setLibrarySearch('')} className="lib-min-clear">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Category horizontal scrolling pills */}
          <div className="diag-min-cat-pills">
            {CATEGORY_CHIPS.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`diag-min-cat-pill-btn ${libraryCategory === cat ? 'active' : ''}`}
                onClick={() => setLibraryCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Minimal disease list cards */}
          <div className="diag-min-lib-list">
            {filteredLibraryDiseases.map((d) => (
              <div
                key={d.id}
                className="diag-min-lib-item"
                onClick={() => setSelectedLibraryDisease(d)}
              >
                <div className="diag-min-lib-item-head">
                  <div className="diag-min-lib-tags">
                    <span className={`lib-min-sev ${d.severity?.toLowerCase()}`}>
                      {d.severity}
                    </span>
                    <span className="lib-min-cat">{d.category}</span>
                  </div>
                  <ChevronRight size={14} className="lib-min-arrow" />
                </div>
                <h3 className="diag-min-lib-name">{d.name}</h3>
                <span className="diag-min-lib-age">{d.commonAge}</span>
                <p className="diag-min-lib-symptom-preview">
                  {(d.symptoms || []).slice(0, 3).join(' • ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          DETAIL MODAL
         ══════════════════════════════════════════════════════════════════ */}
      {selectedLibraryDisease && (
        <div className="diag-modal-backdrop" onClick={() => setSelectedLibraryDisease(null)}>
          <div className="diag-min-modal" onClick={(e) => e.stopPropagation()}>
            <div className="diag-min-modal-head">
              <div>
                <div className="diag-min-modal-tags">
                  <span className={`lib-min-sev ${selectedLibraryDisease.severity?.toLowerCase()}`}>
                    {selectedLibraryDisease.severity}
                  </span>
                  <span className="lib-min-cat">{selectedLibraryDisease.category}</span>
                </div>
                <h2 className="diag-min-modal-title">{selectedLibraryDisease.name}</h2>
                <span className="diag-min-modal-age">{selectedLibraryDisease.commonAge}</span>
              </div>
              <button
                type="button"
                className="diag-min-modal-close"
                onClick={() => setSelectedLibraryDisease(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="diag-min-modal-body">
              <div className="diag-min-modal-block">
                <h4>Symptoms</h4>
                <ul>
                  {(selectedLibraryDisease.symptoms || []).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              {selectedLibraryDisease.whatToDoNow?.length > 0 && (
                <div className="diag-min-modal-block action">
                  <h4>Immediate Action Protocol</h4>
                  <ol>
                    {selectedLibraryDisease.whatToDoNow.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {selectedLibraryDisease.treatment && (
                <div className="diag-min-modal-block treatment">
                  <h4>Treatment</h4>
                  <p><strong>{selectedLibraryDisease.treatment.type}:</strong> {selectedLibraryDisease.treatment.action}</p>
                </div>
              )}
            </div>

            <div className="diag-min-modal-foot">
              <button
                type="button"
                className="diag-min-action-btn"
                onClick={() => {
                  const disease = selectedLibraryDisease;
                  setSelectedLibraryDisease(null);
                  setActiveMode('triage');
                  setSelectedSymptoms(disease.symptoms?.slice(0, 2) || []);
                  setFreeformText(disease.name);
                  setStep(2);
                }}
              >
                <span>Triage This Disease</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnoseView;
