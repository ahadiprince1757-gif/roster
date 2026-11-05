import React, { useState } from 'react';
import {
  PRIMARY_SYMPTOM_CATEGORIES,
  TRIAGE_QUESTIONS,
  diagnoseFlock,
} from '../../data/diagnosticEngine';
import { useFarm } from '../../context/FarmContext';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Footprints,
  HeartCrack,
  HelpCircle,
  PhoneCall,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Skull,
  Stethoscope,
  TrendingDown,
  UtensilsCrossed,
  Wind,
  XCircle,
} from 'lucide-react';

const ICON_MAP = {
  Footprints,
  Wind,
  AlertTriangle,
  Skull,
  TrendingDown,
  UtensilsCrossed,
};

const DiagnoseView = ({ onSaveToRecords, onNavigate }) => {
  const { farmData, addHealthActivity } = useFarm();
  const [step, setStep] = useState(1); // 1: Select symptom, 2: Triage questions, 3: Diagnosis Result
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [answers, setAnswers] = useState({
    ageRange: 'grower',
    scope: 'cluster',
    droppingsState: 'normal',
    eatingState: 'normal',
    recentChange: 'none',
  });
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [freeformText, setFreeformText] = useState('');

  // Handle Symptom Select
  const handleSelectSymptom = (catId) => {
    setSelectedSymptom(catId);
    setStep(2);
  };

  // Quick auto-match from freeform text
  const handleFreeformSubmit = (e) => {
    e.preventDefault();
    const text = freeformText.toLowerCase();
    let matchedId = 'locomotion';
    if (text.includes('walk') || text.includes('leg') || text.includes('hock') || text.includes('limp') || text.includes('paraly')) {
      matchedId = 'locomotion';
    } else if (text.includes('breath') || text.includes('sneez') || text.includes('cough') || text.includes('snoring') || text.includes('gasp') || text.includes('eye')) {
      matchedId = 'respiratory';
    } else if (text.includes('blood') || text.includes('drop') || text.includes('poop') || text.includes('diarrhea') || text.includes('white') || text.includes('orange')) {
      matchedId = 'droppings';
    } else if (text.includes('die') || text.includes('dead') || text.includes('death') || text.includes('mortality') || text.includes('kill')) {
      matchedId = 'mortality';
    } else if (text.includes('grow') || text.includes('weight') || text.includes('small') || text.includes('runt') || text.includes('behind')) {
      matchedId = 'growth';
    } else if (text.includes('eat') || text.includes('drink') || text.includes('water') || text.includes('feed') || text.includes('crop')) {
      matchedId = 'appetite';
    }
    setSelectedSymptom(matchedId);
    setStep(2);
  };

  // Run Diagnosis
  const handleRunDiagnosis = () => {
    const result = diagnoseFlock(selectedSymptom, answers);
    setDiagnosisResult(result);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset
  const handleReset = () => {
    setStep(1);
    setSelectedSymptom(null);
    setDiagnosisResult(null);
    setSavedSuccess(false);
    setFreeformText('');
  };

  // Save to Farm Health Records
  const handleSaveToFlock = () => {
    if (!diagnosisResult?.topMatch) return;
    const title = `Triage: ${diagnosisResult.topMatch.name}`;
    const desc = `Symptoms: ${diagnosisResult.primarySymptom?.title}. Protocol: ${diagnosisResult.topMatch.doThisNow[0]}`;
    addHealthActivity({
      type: 'Triage Diagnosis',
      title,
      description: desc,
      status: 'In Progress',
      cost: 0,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  // Copy clinical summary to clipboard
  const handleCopySummary = () => {
    if (!diagnosisResult) return;
    const { topMatch, primarySymptom } = diagnosisResult;
    const text = `[ROSESTAR POULTRY DOCTOR REPORT]\nFlock Symptom: ${primarySymptom?.title}\nSuspected Diagnosis: ${topMatch.name} (${topMatch.confidence}% match)\n\nDO THIS NOW:\n${topMatch.doThisNow.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n\nWHAT NOT TO DO:\n${topMatch.whatNotToDo.map((a) => `• ${a}`).join('\n')}\n\nWHEN TO CALL VET:\n${topMatch.whenToCallVet.map((a) => `! ${a}`).join('\n')}`;
    navigator.clipboard?.writeText(text);
    alert('Clinical diagnosis summary copied to clipboard!');
  };

  return (
    <div className="diag-container">
      {/* ── Header ── */}
      <div className="diag-header">
        <div className="diag-tag">
          <Stethoscope size={13} />
          <span>POULTRY DOCTOR &amp; TRIAGE ENGINE</span>
        </div>
        <h1 className="diag-title">
          {step === 1 && "What's wrong with your birds?"}
          {step === 2 && 'Narrow down the issue'}
          {step === 3 && 'Clinical Decision & Protocol'}
        </h1>
        <p className="diag-sub">
          {step === 1 && 'Select what you are observing in the flock or describe the symptoms below.'}
          {step === 2 && 'Answer 5 critical triage questions to rule out lookalike conditions.'}
          {step === 3 && 'Evidence-based immediate protocol, mistakes to avoid, and escalation limits.'}
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          STEP 1: SELECT PRIMARY OBSERVATION
         ══════════════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div className="diag-step-content">
          {/* Freeform input box */}
          <form onSubmit={handleFreeformSubmit} className="diag-search-card">
            <label className="diag-search-label">Or tell us in your own words:</label>
            <div className="diag-search-row">
              <input
                type="text"
                value={freeformText}
                onChange={(e) => setFreeformText(e.target.value)}
                placeholder="e.g. My 14-day chicks can't walk and sit on their hocks..."
                className="diag-search-input"
              />
              <button type="submit" className="diag-search-btn" disabled={!freeformText.trim()}>
                <span>Analyze</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </form>

          <div className="diag-category-grid">
            {PRIMARY_SYMPTOM_CATEGORIES.map((cat) => {
              const IconComp = ICON_MAP[cat.icon] || AlertTriangle;
              return (
                <div
                  key={cat.id}
                  className="diag-cat-card"
                  onClick={() => handleSelectSymptom(cat.id)}
                >
                  <div className="diag-cat-top">
                    <div className="diag-cat-icon-wrap">
                      <IconComp size={22} />
                    </div>
                    <span className="diag-cat-badge">{cat.badge}</span>
                  </div>
                  <h3 className="diag-cat-title">{cat.title}</h3>
                  <p className="diag-cat-desc">{cat.subtitle}</p>
                  <div className="diag-cat-action">
                    <span>Investigate</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="diag-disclaimer">
            <ShieldCheck size={16} />
            <span>
              Designed as a clinical decision-support and immediate triage system for commercial poultry producers.
              Always consult your registered veterinarian for prescription antimicrobials.
            </span>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 2: TRIAGE QUESTIONNAIRE
         ══════════════════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div className="diag-step-content">
          <div className="diag-triage-back">
            <button className="diag-back-btn" onClick={() => setStep(1)}>
              <ChevronLeft size={16} />
              <span>Back to symptoms</span>
            </button>
            <span className="diag-active-symptom-pill">
              Investigating: {PRIMARY_SYMPTOM_CATEGORIES.find((c) => c.id === selectedSymptom)?.title}
            </span>
          </div>

          <div className="diag-questions-list">
            {TRIAGE_QUESTIONS.map((q, idx) => (
              <div key={q.id} className="diag-question-block">
                <div className="diag-q-header">
                  <span className="diag-q-num">0{idx + 1}</span>
                  <span className="diag-q-label">{q.label}</span>
                </div>
                <div className="diag-options-grid">
                  {q.options.map((opt) => {
                    const isSelected = answers[q.id] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        className={`diag-option-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => setAnswers({ ...answers, [q.id]: opt.value })}
                      >
                        <span className="diag-option-radio">
                          {isSelected && <span className="diag-radio-dot" />}
                        </span>
                        <span className="diag-option-text">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="diag-triage-footer">
            <button className="diag-submit-btn" onClick={handleRunDiagnosis}>
              <span>Generate Clinical Diagnosis &amp; Protocol</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          STEP 3: CLINICAL DECISION & PROTOCOL BRIEF
         ══════════════════════════════════════════════════════════════════ */}
      {step === 3 && diagnosisResult && (
        <div className="diag-step-content">
          <div className="diag-triage-back">
            <button className="diag-back-btn" onClick={() => setStep(2)}>
              <ChevronLeft size={16} />
              <span>Adjust triage answers</span>
            </button>
            <button className="diag-reset-btn" onClick={handleReset}>
              <RotateCcw size={14} />
              <span>New Problem</span>
            </button>
          </div>

          {/* Primary Top Ranked Cause Card */}
          <div className="diag-hero-result-card">
            <div className="diag-result-badge-row">
              <span className="diag-badge-severity">
                Severity: {diagnosisResult.topMatch.severity}
              </span>
              <span className="diag-badge-confidence">
                {diagnosisResult.topMatch.confidence}% Probability Match
              </span>
            </div>

            <h2 className="diag-result-name">{diagnosisResult.topMatch.name}</h2>
            <p className="diag-result-summary">{diagnosisResult.topMatch.summary}</p>

            {/* Evidence points */}
            <div className="diag-evidence-box">
              <span className="diag-box-label">MATCHING FLOCK EVIDENCE:</span>
              <ul className="diag-evidence-list">
                {diagnosisResult.topMatch.evidence.map((ev, i) => (
                  <li key={i}>
                    <CheckCircle2 size={15} />
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* DO THIS NOW (Immediate Safe Action Protocol) */}
          <div className="diag-protocol-card action-now">
            <div className="diag-card-title-row">
              <ShieldAlert size={20} className="icon-action" />
              <h3>DO THIS RIGHT NOW</h3>
            </div>
            <p className="diag-protocol-sub">Immediate first-line safe intervention to contain losses:</p>
            <ol className="diag-action-steps">
              {diagnosisResult.topMatch.doThisNow.map((act, i) => (
                <li key={i}>
                  <span className="diag-step-circle">{i + 1}</span>
                  <span className="diag-step-text">{act}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* WHAT NOT TO DO (Dangerous common mistakes) */}
          <div className="diag-protocol-card danger-mistakes">
            <div className="diag-card-title-row">
              <XCircle size={20} className="icon-danger" />
              <h3>WHAT NOT TO DO</h3>
            </div>
            <p className="diag-protocol-sub">Critical mistakes that worsen mortality or waste money:</p>
            <ul className="diag-mistakes-list">
              {diagnosisResult.topMatch.whatNotToDo.map((mistake, i) => (
                <li key={i}>
                  <AlertCircle size={16} />
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* WATCH FOR & VET ESCALATION */}
          <div className="diag-two-col-grid">
            <div className="diag-protocol-card watch-col">
              <div className="diag-card-title-row">
                <AlertTriangle size={18} />
                <h4>WATCH FOR TODAY</h4>
              </div>
              <ul className="diag-sub-list">
                {diagnosisResult.topMatch.watchFor.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>

            <div className="diag-protocol-card vet-col">
              <div className="diag-card-title-row">
                <PhoneCall size={18} />
                <h4>WHEN TO CALL A VET</h4>
              </div>
              <ul className="diag-sub-list">
                {diagnosisResult.topMatch.whenToCallVet.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Secondary differential diagnoses */}
          {diagnosisResult.secondaryMatches?.length > 0 && (
            <div className="diag-differentials-card">
              <h4>Secondary Possibilities (Differential Diagnoses)</h4>
              <div className="diag-diff-list">
                {diagnosisResult.secondaryMatches.map((sec) => (
                  <div key={sec.id} className="diag-diff-item">
                    <div className="diag-diff-header">
                      <span className="diag-diff-name">{sec.name}</span>
                      <span className="diag-diff-pct">{sec.confidence}% match</span>
                    </div>
                    <p className="diag-diff-desc">{sec.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Action Strip */}
          <div className="diag-action-strip">
            <button className="diag-btn-secondary" onClick={handleCopySummary}>
              <Copy size={15} />
              <span>Copy Clinical Brief</span>
            </button>

            <button
              className="diag-btn-primary"
              onClick={handleSaveToFlock}
              disabled={savedSuccess}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Saved to Flock Log</span>
                </>
              ) : (
                <>
                  <HeartCrack size={16} />
                  <span>Save to Health Records</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnoseView;
