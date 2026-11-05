import React, { useState, useMemo } from 'react';
import { useFarm } from '../../context/FarmContext';
import { currentAge } from '../../utils/calculations';
import {
  COBB_STANDARDS,
  getCobbStandard,
  flockDailyFeedKg,
  cumulativeFeedPerBirdG,
  weightStatus,
  feedStatus,
} from '../../data/cobbStandards';
import { Calculator, TrendingUp, Target, Info, ChevronDown, ChevronUp } from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_LABELS = {
  excellent: { label: 'On Target',    cls: 'ps-status--excellent' },
  good:      { label: 'Acceptable',   cls: 'ps-status--good' },
  warning:   { label: 'Watch',       cls: 'ps-status--warning' },
  poor:      { label: 'Below Target',cls: 'ps-status--poor' },
  unknown:   { label: '—',           cls: 'ps-status--unknown' },
};

const FEED_TYPES = {
  1:  'Starter',  
  11: 'Starter',
  15: 'Grower',   
  29: 'Finisher', 
};

function getFeedType(day) {
  if (day <= 14) return 'Starter';
  if (day <= 28) return 'Grower';
  return 'Finisher';
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, statusCls }) {
  return (
    <div className={`ps-stat-card ${statusCls || ''}`}>
      <div className="ps-stat-value">{value}</div>
      <div className="ps-stat-label">{label}</div>
      {sub && <div className="ps-stat-sub">{sub}</div>}
    </div>
  );
}

function StatusBadge({ status }) {
  const info = STATUS_LABELS[status] || STATUS_LABELS.unknown;
  return <span className={`ps-status-badge ${info.cls}`}>{info.label}</span>;
}

// ── Today's Benchmark Panel ───────────────────────────────────────────────────

function TodayBenchmark({ flockAge, liveBirds, latestWeight }) {
  const std = getCobbStandard(flockAge);
  if (!std) return null;

  const dailyFlockKg = flockDailyFeedKg(std.feedPerBird, liveBirds);
  const cumPerBird   = cumulativeFeedPerBirdG(flockAge);
  const cumFlock     = (cumPerBird * liveBirds) / 1000;
  const wStatus      = weightStatus(latestWeight, std.targetWeight);
  const feedType     = getFeedType(flockAge);

  return (
    <div className="ps-today-panel">
      <div className="ps-today-header">
        <div className="ps-today-day-badge">Day {flockAge}</div>
        <div className="ps-today-meta">
          {liveBirds.toLocaleString()} live birds · Feed type: <strong>{feedType}</strong>
        </div>
      </div>

      <div className="ps-today-grid">
        <StatCard
          label="Target Weight / Bird"
          value={`${std.targetWeight.toLocaleString()} g`}
          sub={latestWeight ? `Actual: ${latestWeight.toLocaleString()} g` : 'No weigh-in yet'}
          statusCls={latestWeight ? `ps-card--${wStatus}` : ''}
        />
        <StatCard
          label="Daily Feed / Bird"
          value={`${std.feedPerBird} g`}
          sub={`${feedType} pellets`}
        />
        <StatCard
          label="Flock Feed Today"
          value={`${dailyFlockKg.toFixed(2)} kg`}
          sub={`For ${liveBirds.toLocaleString()} birds`}
        />
        <StatCard
          label="Cumulative Feed / Bird"
          value={`${(cumPerBird / 1000).toFixed(3)} kg`}
          sub={`Flock total: ${cumFlock.toFixed(1)} kg`}
        />
      </div>

      {latestWeight && (
        <div className="ps-weight-compare">
          <span className="ps-weight-compare-label">Weight performance:</span>
          <StatusBadge status={wStatus} />
          <span className="ps-weight-compare-pct">
            ({((latestWeight / std.targetWeight) * 100).toFixed(1)}% of target)
          </span>
        </div>
      )}

      <p className="ps-source-note">
        Source: Cobb 500 Broiler Performance & Nutrition Supplement, as-hatched metric objectives (Cobb Africa, rev. July 2015).
        Values are reference targets, not guaranteed outcomes.
      </p>
    </div>
  );
}

// ── Feed Calculator ───────────────────────────────────────────────────────────

function FeedCalculator({ defaultBirds }) {
  const [birds, setBirds] = useState(defaultBirds || 500);
  const [calcDay, setCalcDay] = useState(1);

  const std = getCobbStandard(calcDay);
  const dailyKg  = std ? flockDailyFeedKg(std.feedPerBird, birds) : 0;
  const weeklyKg = useMemo(() => {
    const start = Math.max(1, calcDay);
    const end   = Math.min(42, calcDay + 6);
    return COBB_STANDARDS.filter((r) => r.day >= start && r.day <= end)
      .reduce((sum, r) => sum + flockDailyFeedKg(r.feedPerBird, birds), 0);
  }, [calcDay, birds]);

  const cumKg = std ? (cumulativeFeedPerBirdG(calcDay) * birds) / 1000 : 0;

  return (
    <div className="ps-calc-panel">
      <div className="ps-calc-header">
        <Calculator size={18} />
        <h3>Feed Calculator</h3>
      </div>
      <p className="ps-calc-desc">
        Enter your flock size and age to get the exact amount of feed to provide today, this week, or cumulatively.
      </p>

      <div className="ps-calc-inputs">
        <div className="ps-calc-field">
          <label>Number of live birds</label>
          <input
            type="number"
            min={1}
            value={birds}
            onChange={(e) => setBirds(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>
        <div className="ps-calc-field">
          <label>Flock age (day)</label>
          <input
            type="number"
            min={1}
            max={42}
            value={calcDay}
            onChange={(e) => setCalcDay(Math.min(42, Math.max(1, parseInt(e.target.value) || 1)))}
          />
        </div>
      </div>

      {std && (
        <div className="ps-calc-results">
          <div className="ps-calc-result-item ps-calc-result--primary">
            <div className="ps-calc-result-label">Feed today</div>
            <div className="ps-calc-result-value">{dailyKg.toFixed(2)} kg</div>
            <div className="ps-calc-result-sub">{std.feedPerBird} g × {birds.toLocaleString()} birds</div>
          </div>
          <div className="ps-calc-result-item">
            <div className="ps-calc-result-label">This week (days {calcDay}–{Math.min(42, calcDay + 6)})</div>
            <div className="ps-calc-result-value">{weeklyKg.toFixed(1)} kg</div>
          </div>
          <div className="ps-calc-result-item">
            <div className="ps-calc-result-label">Cumulative to day {calcDay}</div>
            <div className="ps-calc-result-value">{cumKg.toFixed(1)} kg</div>
            <div className="ps-calc-result-sub">{(cumulativeFeedPerBirdG(calcDay) / 1000).toFixed(3)} kg/bird</div>
          </div>
          <div className="ps-calc-result-item">
            <div className="ps-calc-result-label">Feed type</div>
            <div className="ps-calc-result-value">{getFeedType(calcDay)}</div>
          </div>
        </div>
      )}

      <div className="ps-calc-formula">
        <Info size={13} />
        <span>Flock feed (kg) = Feed per bird (g) × Live birds ÷ 1,000</span>
      </div>
    </div>
  );
}

// ── Full 42-Day Reference Table ───────────────────────────────────────────────

function ReferenceTable({ liveBirds, latestWeight, flockAge }) {
  const [showAll, setShowAll] = useState(false);
  const displayRows = showAll ? COBB_STANDARDS : COBB_STANDARDS.filter((r) => r.day % 7 === 0 || r.day === 1 || r.day === flockAge);

  return (
    <div className="ps-table-panel">
      <div className="ps-table-header">
        <TrendingUp size={18} />
        <h3>Cobb 500 — 42-Day Performance Table</h3>
      </div>
      <p className="ps-table-desc">Per bird. Flock feed column auto-adjusts to your live bird count ({liveBirds.toLocaleString()} birds).</p>

      <div className="ps-table-wrap">
        <table className="ps-ref-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Feed Type</th>
              <th>Target Weight (g)</th>
              <th>Feed / Bird (g)</th>
              <th>Flock Feed (kg)</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row) => (
              <tr
                key={row.day}
                className={`
                  ${row.day === flockAge ? 'ps-row--today' : ''}
                  ${row.day % 7 === 0 ? 'ps-row--week-end' : ''}
                `}
              >
                <td>
                  <span className="ps-day-num">Day {row.day}</span>
                  {row.day === flockAge && <span className="ps-today-dot">Today</span>}
                </td>
                <td className="ps-feed-type">{getFeedType(row.day)}</td>
                <td className="ps-weight-col">
                  {row.targetWeight.toLocaleString()} g
                  {row.day === flockAge && latestWeight && (
                    <StatusBadge status={weightStatus(latestWeight, row.targetWeight)} />
                  )}
                </td>
                <td>{row.feedPerBird} g</td>
                <td className="ps-flock-feed">
                  {flockDailyFeedKg(row.feedPerBird, liveBirds).toFixed(2)} kg
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="ps-toggle-btn" onClick={() => setShowAll((v) => !v)}>
        {showAll ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {showAll ? 'Show summary view' : 'Show all 42 days'}
      </button>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

const PerformanceStandards = () => {
  const { farmData } = useFarm();
  const { batch, weights, deaths } = farmData;

  // Live birds
  const totalDeaths = deaths.reduce((s, d) => s + (Number(d.qty) || 0), 0);
  const liveBirds   = Math.max(0, (Number(batch.birds) || 0) - totalDeaths);

  // Flock age
  const flockAge = batch.date ? currentAge(batch.date) : null;

  // Latest actual weight
  const sortedWeights = [...weights].sort((a, b) => new Date(b.date) - new Date(a.date));
  const latestWeight  = sortedWeights[0]?.avg ?? null;

  return (
    <div className="ps-container">
      {/* Header */}
      <div className="ps-page-header">
        <div>
          <h2 className="ps-page-title">
            <Target size={22} />
            Performance Standards
          </h2>
          <p className="ps-page-subtitle">
            Cobb 500 daily weight targets &amp; feed requirements — compared to your flock.
          </p>
        </div>
      </div>

      {!batch.date ? (
        <div className="ps-no-batch">
          <Target size={40} />
          <h3>No arrival date set</h3>
          <p>Go to <strong>Settings</strong> and enter your chick arrival date to activate performance tracking.</p>
        </div>
      ) : flockAge > 42 ? (
        <div className="ps-no-batch">
          <Target size={40} />
          <h3>Batch beyond Day 42</h3>
          <p>This flock is past the standard Cobb 500 reference period. Ready for harvest!</p>
        </div>
      ) : (
        <>
          <TodayBenchmark
            flockAge={flockAge}
            liveBirds={liveBirds}
            latestWeight={latestWeight}
          />
          <FeedCalculator defaultBirds={liveBirds} />
          <ReferenceTable
            liveBirds={liveBirds}
            latestWeight={latestWeight}
            flockAge={flockAge}
          />
        </>
      )}
    </div>
  );
};

export default PerformanceStandards;
