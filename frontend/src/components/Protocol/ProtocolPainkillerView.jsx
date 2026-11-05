import React, { useState, useEffect, useMemo } from 'react';
import { useFarm } from '../../context/FarmContext';
import { COBB_STANDARDS, getCobbStandard, flockDailyFeedKg } from '../../data/cobbStandards';
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
  AlertTriangle,
  TrendingUp,
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
      'Administer Gumboro (IBD 1st dose) via chlorine-free drinking water with skimmed milk stabilizer.',
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

/** Determine feed phase/type from day */
function getFeedPhase(day) {
  if (day <= 7)  return { type: 'Pre-Starter / Starter Crumble', cp: '22–24% CP', color: '#C9A45C' };
  if (day <= 21) return { type: 'Starter Crumble', cp: '22–23% CP', color: '#8A877F' };
  if (day <= 28) return { type: 'Grower Pellets', cp: '19–21% CP', color: '#30352B' };
  return { type: 'Finisher Pellets', cp: '17–19% CP', color: '#252522' };
}

/** Build week summary rows */
const WEEK_SUMMARY = [
  { label: 'Week 1', days: [1, 7],   feedType: 'Pre-Starter / Starter Crumble', cp: '22–24% CP', note: 'Crumble. Paper floor feeding for Day 1–3.' },
  { label: 'Week 2', days: [8, 14],  feedType: 'Starter Crumble',               cp: '22–23% CP', note: 'Transition to 50% Grower on Day 13–14.' },
  { label: 'Week 3', days: [15, 21], feedType: 'Grower Pellets',                 cp: '19–21% CP', note: 'Full Grower by Day 15. Ad libitum feeding.' },
  { label: 'Week 4', days: [22, 28], feedType: 'Grower Pellets',                 cp: '19–21% CP', note: 'Peak growth phase — never restrict feed.' },
  { label: 'Week 5', days: [29, 35], feedType: 'Finisher Pellets',               cp: '17–19% CP', note: 'Start drug withdrawal by Day 29.' },
  { label: 'Week 6', days: [36, 42], feedType: 'Finisher Pellets',               cp: '17–19% CP', note: 'Withdraw feed 6–8 hrs before slaughter.' },
];

function getDailyFeedForWeek(startDay, endDay) {
  const slice = COBB_STANDARDS.filter(r => r.day >= startDay && r.day <= endDay);
  if (!slice.length) return { perBirdMin: 0, perBirdMax: 0 };
  const vals = slice.map(r => r.feedPerBird);
  return { perBirdMin: Math.min(...vals), perBirdMax: Math.max(...vals) };
}

const ProtocolPainkillerView = ({ onOpenAddModal }) => {
  const { farmData, toggleHealthStatus, deleteHealth, loadStandardVaccinationSchedule, cleanHealthDuplicates } = useFarm();
  const { health, batch } = farmData;
  const [activeTab, setActiveTab] = useState('daily_protocol'); // 'daily_protocol' | 'feed_schedule' | 'medical_log'

  // ── Current flock age ──
  const flockDayAge = useMemo(() => {
    if (!batch?.placementDate) return null;
    const placed = new Date(batch.placementDate);
    const today = new Date();
    const diff = Math.floor((today - placed) / (1000 * 60 * 60 * 24)) + 1;
    return diff >= 1 && diff <= 42 ? diff : null;
  }, [batch?.placementDate]);

  const liveBirds = useMemo(() => {
    return batch?.birds
      ? batch.birds - (farmData.deaths?.reduce((s, d) => s + (Number(d.count) || 0), 0) || 0)
      : null;
  }, [batch, farmData.deaths]);

  // Today's Cobb standard
  const todayStd = flockDayAge ? getCobbStandard(flockDayAge) : null;
  const todayFlockFeedKg = todayStd && liveBirds
    ? flockDailyFeedKg(todayStd.feedPerBird, liveBirds)
    : null;

  // Deduplicate health items
  const uniqueHealth = useMemo(() => {
    const seen = new Set();
    const clean = [];
    for (const item of health) {
      const titleKey = (item.name || item.title || '').trim().toLowerCase();
      const dateKey = item.date || '';
      const key = `${titleKey}_${dateKey}`;
      if (!seen.has(key)) { seen.add(key); clean.push(item); }
    }
    return clean;
  }, [health]);

  useEffect(() => {
    if (health.length > uniqueHealth.length && cleanHealthDuplicates) {
      cleanHealthDuplicates();
    }
  }, [health.length, uniqueHealth.length, cleanHealthDuplicates]);

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
            <span>Management</span>
          </button>
          <button
            className={`proto-switch-btn ${activeTab === 'feed_schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('feed_schedule')}
          >
            <Wheat size={15} />
            <span>Feed Schedule</span>
          </button>
          <button
            className={`proto-switch-btn ${activeTab === 'medical_log' ? 'active' : ''}`}
            onClick={() => setActiveTab('medical_log')}
          >
            <ShieldCheck size={15} />
            <span>Vaccines ({uniqueHealth.length})</span>
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
          VIEW 2: FEED SCHEDULE (Cobb 500 Standards)
         ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'feed_schedule' && (
        <div className="proto-content">

          {/* ── WEEKLY FEED GUIDE — top of page ── */}
          <div className="feed-section-label">COBB 500 WEEKLY FEED GUIDE</div>
          <div className="feed-week-list">
            {WEEK_SUMMARY.map((week, idx) => {
              const { perBirdMin, perBirdMax } = getDailyFeedForWeek(week.days[0], week.days[1]);
              const isCurrentWeek = flockDayAge >= week.days[0] && flockDayAge <= week.days[1];
              return (
                <div key={idx} className={`feed-week-card ${isCurrentWeek ? 'active' : ''}`}>
                  <div className="feed-week-header">
                    <div className="feed-week-left">
                      {isCurrentWeek && <span className="feed-current-dot" />}
                      <span className="feed-week-label">{week.label}</span>
                      <span className="feed-week-days">Day {week.days[0]}–{week.days[1]}</span>
                    </div>
                    <span className="feed-week-range">{perBirdMin}–{perBirdMax} g/bird/day</span>
                  </div>
                  <div className="feed-week-type-row">
                    <span className="feed-type-badge">{week.feedType}</span>
                    <span className="feed-cp-badge">{week.cp}</span>
                  </div>
                  <p className="feed-week-note">{week.note}</p>
                </div>
              );
            })}
          </div>

          {/* ── TODAY'S COMPACT TARGET STRIP ── */}
          {todayStd && todayFlockFeedKg !== null && (
            <div className="feed-today-strip">
              <div className="feed-today-strip-left">
                <Wheat size={13} style={{ color: 'var(--gold-text)', flexShrink: 0 }} />
                <span className="feed-today-strip-label">Today · Day {flockDayAge}</span>
                <span className="feed-today-strip-type">{getFeedPhase(flockDayAge).type}</span>
              </div>
              <div className="feed-today-strip-right">
                <span className="feed-today-strip-val">{todayStd.feedPerBird} g/bird</span>
                <span className="feed-today-strip-sep">·</span>
                <span className="feed-today-strip-val">{todayFlockFeedKg.toFixed(1)} kg flock</span>
              </div>
            </div>
          )}

          {/* ── DAY-BY-DAY TABLE ── */}
          <div className="feed-section-label" style={{ marginTop: 24 }}>DAY-BY-DAY COBB 500 TARGETS</div>
          <div className="feed-table-wrap">
            <table className="feed-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Feed Type</th>
                  <th>g / bird</th>
                  {liveBirds && <th>Flock (kg)</th>}
                  <th>Target Wt</th>
                </tr>
              </thead>
              <tbody>
                {COBB_STANDARDS.map((row) => {
                  const phase = getFeedPhase(row.day);
                  const isToday = flockDayAge === row.day;
                  const flockKg = liveBirds ? (row.feedPerBird * liveBirds / 1000).toFixed(1) : null;
                  return (
                    <tr key={row.day} className={isToday ? 'feed-row-today' : ''}>
                      <td className="feed-td-day">
                        {isToday && <span className="feed-today-marker">▶</span>}
                        {row.day}
                      </td>
                      <td className="feed-td-type" style={{ color: phase.color }}>{phase.type.split(' / ')[0]}</td>
                      <td className="feed-td-num">{row.feedPerBird}</td>
                      {liveBirds && <td className="feed-td-num">{flockKg}</td>}
                      <td className="feed-td-wt">{row.targetWeight.toLocaleString()} g</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Water note ── */}
          <div className="feed-water-box">
            <Droplet size={15} style={{ color: '#3B82F6', flexShrink: 0 }} />
            <div>
              <span className="feed-water-title">Water-to-Feed Ratio</span>
              <p className="feed-water-body">
                Birds drink <strong>1.6–2× more water than feed</strong>. If feed intake drops, check water first — nipple pressure, cleanliness, and line height are the top culprits.
              </p>
            </div>
          </div>

        </div>
      )}


      {/* ══════════════════════════════════════════════════════════════════

          VIEW 3: VACCINATION & MEDICAL LOG
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

          {uniqueHealth.length === 0 ? (
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
              {uniqueHealth.map((item) => {
                const isCompleted = item.status === 'Completed';
                const itemTitle = item.name || item.title || 'Vaccine / Health Protocol';
                const itemNotes = item.notes || item.description || '';
                const itemMethod = item.method || item.type || '';

                return (
                  <div key={item.id} className={`proto-log-item ${isCompleted ? 'done' : ''}`}>
                    <div
                      className="proto-log-check"
                      onClick={() => toggleHealthStatus(item.id)}
                      title="Toggle completion"
                    >
                      {isCompleted ? <CheckCircle2 size={20} /> : <div className="proto-empty-circle" />}
                    </div>

                    <div className="proto-log-info">
                      <div className="proto-log-title-row">
                        <span className="proto-log-title">{itemTitle}</span>
                        <span className="proto-log-date">{item.date}</span>
                      </div>

                      <div className="proto-log-meta-row">
                        {itemMethod && (
                          <span className="proto-log-badge">{itemMethod}</span>
                        )}
                        {itemNotes && (
                          <span className="proto-log-desc">{itemNotes}</span>
                        )}
                      </div>
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
