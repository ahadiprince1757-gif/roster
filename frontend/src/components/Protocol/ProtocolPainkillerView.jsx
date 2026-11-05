import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { RECOMMENDED_PROTOCOLS } from '../../data/standardVaccines';
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Droplet,
  FileText,
  Plus,
  ShieldCheck,
  Sparkles,
  Sun,
  Thermometer,
  Trash2,
  Wheat,
} from 'lucide-react';

const AGE_PROTOCOLS = [
  {
    dayRange: 'Day 1 – 3',
    phase: 'Chick Arrival & Brooding',
    temp: '32°C – 33°C (Litter temp)',
    feed: 'Pre-Starter / Starter Crumble on paper',
    tasks: [
      'Pre-heat brooder 12 hours before chick placement.',
      'Provide warm water with glucose / anti-stress electrolytes 2 hours before offering feed.',
      'Inspect crop fill at 8 hours (target > 80% soft, pliable crops).',
    ],
  },
  {
    dayRange: 'Day 7',
    phase: 'First Critical Milestone',
    temp: '30°C',
    feed: 'Starter Crumble',
    tasks: [
      'Administer Gumboro (IBD) 1st dose via chlorine-free drinking water with skimmed milk stabilizer.',
      'Sample weigh 20 chicks: 7-day weight should be 4x–5x placement weight (~180g).',
      'Expand brooder ring to give growing chicks double the space.',
    ],
  },
  {
    dayRange: 'Day 10 – 14',
    phase: 'Immune Defense & Feed Transition',
    temp: '27°C – 28°C',
    feed: '50% Starter + 50% Grower for 2 days, then 100% Grower',
    tasks: [
      'Day 10: Newcastle Disease (LaSota) + Infectious Bronchitis (IB) booster.',
      'Day 14: Gumboro 2nd booster (crucial for field strain protection).',
      'Check drinker lines height: nipples should be at bird eye level with bird stretching neck slightly.',
    ],
  },
  {
    dayRange: 'Day 21 – 28',
    phase: 'Rapid Skeletal & Muscle Growth',
    temp: '24°C – 25°C',
    feed: 'Grower Pellets',
    tasks: [
      'Inspect litter under waterers for dampness to prevent coccidial oocyst sporulation.',
      'Check FCR velocity: birds should be gaining 70g–85g daily.',
      'Ensure side ventilation is open: ammonia must be undetectable by human nose (< 15 ppm).',
    ],
  },
  {
    dayRange: 'Day 29 – 35',
    phase: 'Finisher Phase',
    temp: '21°C – 22°C',
    feed: 'Finisher Pellets (High energy, low protein)',
    tasks: [
      'Day 29: Transition to Finisher feed.',
      'Observe drug withdrawal periods: stop all medicated feeds or antibiotics 7–10 days before harvest.',
      'Avoid heat stress: during hot afternoons, withdraw feed 2 hours before peak temperature.',
    ],
  },
  {
    dayRange: 'Day 35 – 42',
    phase: 'Market Harvest & Sale',
    temp: '20°C',
    feed: 'Finisher Pellets',
    tasks: [
      'Target slaughter weight: 2.0 kg – 2.4 kg.',
      'Withdraw feed 6–8 hours prior to catching (clears gut to prevent intestinal rupture during processing).',
      'Provide clean fresh water continuously until the moment of catching.',
    ],
  },
];

const ProtocolPainkillerView = ({ onOpenAddModal }) => {
  const { farmData, toggleHealthStatus, deleteHealth, loadStandardVaccinationSchedule } = useFarm();
  const { health, batch } = farmData;
  const [activeTab, setActiveTab] = useState('daily_protocol'); // 'daily_protocol' | 'medical_log'

  const currentAge = batch?.targetAge ? Math.min(42, Math.max(1, batch.targetAge)) : 14;

  return (
    <div className="proto-pain-wrap">
      {/* ── Header ── */}
      <div className="proto-pain-header">
        <div className="proto-pain-tag">
          <Calendar size={13} />
          <span>MANAGEMENT PROTOCOL &amp; MEDICAL LOG</span>
        </div>
        <h1 className="proto-pain-title">Day-by-Day Protocol</h1>
        <p className="proto-pain-sub">
          The non-negotiable management sequence from day-old chick placement to market harvest.
        </p>

        {/* View Switcher */}
        <div className="proto-switch-row">
          <button
            className={`proto-switch-btn ${activeTab === 'daily_protocol' ? 'active' : ''}`}
            onClick={() => setActiveTab('daily_protocol')}
          >
            <ClipboardList size={15} />
            <span>Age-Based Management</span>
          </button>
          <button
            className={`proto-switch-btn ${activeTab === 'medical_log' ? 'active' : ''}`}
            onClick={() => setActiveTab('medical_log')}
          >
            <ShieldCheck size={15} />
            <span>Vaccines &amp; Treatments ({health.length})</span>
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          VIEW 1: AGE-BASED DECISION SEQUENCE
         ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'daily_protocol' && (
        <div className="proto-content">
          <div className="proto-phases-list">
            {AGE_PROTOCOLS.map((phase, idx) => (
              <div key={idx} className="proto-phase-card">
                <div className="proto-phase-header">
                  <div className="proto-phase-left">
                    <span className="proto-phase-range">{phase.dayRange}</span>
                    <h3 className="proto-phase-name">{phase.phase}</h3>
                  </div>
                  <div className="proto-phase-specs">
                    <span className="proto-spec-pill">
                      <Thermometer size={13} />
                      {phase.temp}
                    </span>
                    <span className="proto-spec-pill feed">
                      <Wheat size={13} />
                      {phase.feed}
                    </span>
                  </div>
                </div>

                <div className="proto-tasks-box">
                  <span className="proto-box-label">CRITICAL ACTIONS:</span>
                  <ul className="proto-tasks-list">
                    {phase.tasks.map((task, tIdx) => (
                      <li key={tIdx}>
                        <CheckCircle2 size={15} />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          VIEW 2: VACCINATION & MEDICAL LOG
         ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'medical_log' && (
        <div className="proto-content">
          <div className="proto-med-top">
            <button className="proto-btn-sub" onClick={loadStandardVaccinationSchedule}>
              <Sparkles size={14} />
              <span>Auto-Populate Cobb/Ross Schedule</span>
            </button>
            <button className="proto-btn-primary" onClick={onOpenAddModal}>
              <Plus size={14} />
              <span>Log Treatment</span>
            </button>
          </div>

          {health.length === 0 ? (
            <div className="proto-empty-card">
              <ShieldCheck size={36} />
              <h4>No Vaccination Records Yet</h4>
              <p>Auto-populate the standard commercial schedule or add treatments as given.</p>
              <button className="proto-btn-primary" onClick={loadStandardVaccinationSchedule}>
                Auto-Schedule Protocols
              </button>
            </div>
          ) : (
            <div className="proto-log-list">
              {health.map((item) => {
                const isCompleted = item.status === 'Completed';
                return (
                  <div key={item.id} className={`proto-log-item ${isCompleted ? 'done' : ''}`}>
                    <div
                      className="proto-log-check"
                      onClick={() => toggleHealthStatus(item.id)}
                      title="Toggle completion"
                    >
                      {isCompleted && <CheckCircle2 size={18} />}
                    </div>
                    <div className="proto-log-info">
                      <div className="proto-log-title-row">
                        <span className="proto-log-title">{item.title}</span>
                        <span className="proto-log-date">{item.date}</span>
                      </div>
                      <p className="proto-log-desc">{item.description}</p>
                    </div>
                    <button
                      className="proto-log-del"
                      onClick={() => deleteHealth(item.id)}
                      title="Delete record"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProtocolPainkillerView;
