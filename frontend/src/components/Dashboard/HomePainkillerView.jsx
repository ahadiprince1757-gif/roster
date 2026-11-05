import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { calculateFlockMetrics, formatNumber, formatCurrency } from '../../utils/calculations';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  HeartCrack,
  Plus,
  Scale,
  Stethoscope,
  Wheat,
} from 'lucide-react';

const HomePainkillerView = ({ onOpenModal, onNavigate }) => {
  const { farmData, currency } = useFarm();
  const { batch, weights, feeds, deaths, finances } = farmData;

  const metrics = calculateFlockMetrics(batch, weights, feeds, deaths, finances);

  const todayKey = `rosestar_tasks_${new Date().toISOString().slice(0, 10)}`;
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(todayKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      water: true,
      weight: false,
      droppings: false,
      mortality: false,
    };
  });

  const toggleTask = (key) => {
    const updated = { ...tasks, [key]: !tasks[key] };
    setTasks(updated);
    try {
      localStorage.setItem(todayKey, JSON.stringify(updated));
    } catch (e) {}
  };

  const recentDeaths = deaths.slice(-3).reduce((sum, d) => sum + (Number(d.qty) || 0), 0);
  const isHighMortality = metrics.mortalityRate > 4 || recentDeaths >= 3;
  const isHighFCR = metrics.fcr > 1.75;
  const hasWarning = isHighMortality || isHighFCR;

  const sellingPricePerKg = currency === 'KSh' ? 380 : currency === '$' ? 3.5 : 3.0;
  const projectedRevenue = metrics.liveBirds * (metrics.latestAvgWeightKg || 1.2) * sellingPricePerKg;
  const projectedProfit = projectedRevenue - metrics.totalExpenses;

  return (
    <div className="home-clean-wrap">
      {/* ── Top Hero: Pure Typography ── */}
      <section className="home-top-identity">
        <div className="home-top-meta">
          <span className="home-breed-tag">{batch?.breed || 'Cobb 500'}</span>
          <span className="home-birds-count">{metrics.liveBirds} birds alive</span>
        </div>

        <div className="home-hero-pair">
          <div className="home-hero-stat">
            <span className="home-stat-label">FLOCK AGE</span>
            <div className="home-stat-number">Day {metrics.currentFlockAge || 1}</div>
          </div>
          <div className="home-hero-stat">
            <span className="home-stat-label">AVG WEIGHT</span>
            <div className="home-stat-number">
              {metrics.latestAvgWeightKg > 0
                ? `${formatNumber(metrics.latestAvgWeightKg, 2)} kg`
                : `${metrics.latestAvgWeightGrams || 0} g`}
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PAINKILLER TRIGGER: 1 Single Clean Luxury Banner ── */}
      <div className="home-diag-strip" onClick={() => onNavigate('diagnose')}>
        <div className="home-diag-strip-left">
          <Stethoscope size={18} className="home-diag-icon" />
          <div>
            <div className="home-diag-title">Something wrong with your birds?</div>
            <div className="home-diag-caption">Lame, coughing, droppings changed, or deaths</div>
          </div>
        </div>
        <div className="home-diag-pill">
          <span>Diagnose</span>
          <ArrowRight size={14} />
        </div>
      </div>

      {/* ── EARLY WARNING RADAR: 1 Single Sharp Line ── */}
      {hasWarning ? (
        <div className="home-radar-pill alert" onClick={() => onNavigate('diagnose')}>
          <div className="home-radar-pill-left">
            <AlertTriangle size={15} />
            <span>
              {isHighMortality
                ? `Mortality warning: ${recentDeaths} recent deaths`
                : `Feed conversion widening: FCR ${formatNumber(metrics.fcr, 2)}`}
            </span>
          </div>
          <span className="home-radar-arrow">Investigate →</span>
        </div>
      ) : (
        <div className="home-radar-pill calm">
          <div className="home-radar-pill-left">
            <CheckCircle2 size={15} />
            <span>All flock parameters tracking optimal curve</span>
          </div>
        </div>
      )}

      {/* ── TODAY'S 4 CHECKS: No Walls of Text ── */}
      <section className="home-routine-section">
        <div className="home-routine-header">
          <span className="home-routine-title">TODAY'S PROTOCOL</span>
          <span className="home-routine-counter">
            {Object.values(tasks).filter(Boolean).length}/4 Done
          </span>
        </div>

        <div className="home-checklist-clean">
          <div
            className={`home-check-row ${tasks.water ? 'checked' : ''}`}
            onClick={() => toggleTask('water')}
          >
            <div className="home-box-check">{tasks.water && <Check size={13} />}</div>
            <span className="home-check-text">Check drinker pressure &amp; water cleanliness</span>
          </div>

          <div
            className={`home-check-row ${tasks.weight ? 'checked' : ''}`}
            onClick={() => toggleTask('weight')}
          >
            <div className="home-box-check">{tasks.weight && <Check size={13} />}</div>
            <span className="home-check-text">Sample weigh 10 birds</span>
          </div>

          <div
            className={`home-check-row ${tasks.droppings ? 'checked' : ''}`}
            onClick={() => toggleTask('droppings')}
          >
            <div className="home-box-check">{tasks.droppings && <Check size={13} />}</div>
            <span className="home-check-text">Inspect droppings &amp; bedding moisture</span>
          </div>

          <div
            className={`home-check-row ${tasks.mortality ? 'checked' : ''}`}
            onClick={() => toggleTask('mortality')}
          >
            <div className="home-box-check">{tasks.mortality && <Check size={13} />}</div>
            <span className="home-check-text">Check corners &amp; log mortality</span>
          </div>
        </div>
      </section>

      {/* ── QUICK FINANCIAL POSITION: 1 Clean Line ── */}
      <div className="home-finance-glance" onClick={() => onNavigate('finance')}>
        <div className="home-fin-left">
          <span className="home-fin-caption">EST. NET PROFIT</span>
          <span className={`home-fin-profit ${projectedProfit >= 0 ? 'pos' : 'neg'}`}>
            {formatCurrency(projectedProfit, currency)}
          </span>
        </div>
        <div className="home-fin-right">
          <span className="home-fin-invested">Invested: {formatCurrency(metrics.totalExpenses, currency)}</span>
          <ChevronRight size={16} className="home-fin-chevron" />
        </div>
      </div>

      {/* ── 3 MINIMAL LOG BUTTONS ── */}
      <div className="home-log-row">
        <button className="home-log-btn" onClick={() => onOpenModal('weight')}>
          <Scale size={15} />
          <span>Weight</span>
        </button>
        <button className="home-log-btn" onClick={() => onOpenModal('feed')}>
          <Wheat size={15} />
          <span>Feed</span>
        </button>
        <button className="home-log-btn" onClick={() => onOpenModal('mortality')}>
          <HeartCrack size={15} />
          <span>Death</span>
        </button>
      </div>
    </div>
  );
};

export default HomePainkillerView;
