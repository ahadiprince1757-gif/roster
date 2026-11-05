import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { calculateFlockMetrics, formatNumber, formatCurrency } from '../../utils/calculations';
import {
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Coins,
  DollarSign,
  HeartCrack,
  Info,
  Layers,
  PieChart,
  Plus,
  Scale,
  Sliders,
  TrendingUp,
  Wheat,
  X,
} from 'lucide-react';

const FinancePainkillerView = ({ onOpenExpenseModal, onOpenSaleModal }) => {
  const { farmData, currency } = useFarm();
  const { batch, weights, feeds, deaths, finances } = farmData;
  const metrics = calculateFlockMetrics(batch, weights, feeds, deaths, finances);

  const [activeLeakModal, setActiveLeakModal] = useState(null);

  // Default market price per kg based on currency
  const defaultPrice = currency === 'KSh' ? 380 : currency === '$' ? 3.5 : currency === '₦' ? 2400 : 3.0;
  const [sellingPricePerKg, setSellingPricePerKg] = useState(defaultPrice);

  const totalBiomassKg = metrics.liveBirds * (metrics.latestAvgWeightKg || 1.4);
  const projectedRevenue = totalBiomassKg * sellingPricePerKg;
  const projectedNetProfit = projectedRevenue - metrics.totalExpenses;
  const profitPerLiveBird = metrics.liveBirds > 0 ? projectedNetProfit / metrics.liveBirds : 0;

  // ── PROFIT LEAK CALCULATIONS ──
  const chickUnitCost = batch?.birds > 0 ? (batch?.chickCost || 0) / batch.birds : 100;
  const estimatedFeedWastedPerDeadBirdKg = 0.6;
  const feedCostPerKg = metrics.feedPurchasedKg > 0 ? metrics.feedExpenses / metrics.feedPurchasedKg : 60;
  const deadBirdLoss = metrics.totalDeaths * (chickUnitCost + (estimatedFeedWastedPerDeadBirdKg * feedCostPerKg));

  const targetFcr = 1.55;
  const fcrDifference = Math.max(0, metrics.fcr - targetFcr);
  const wastedFeedKg = fcrDifference * totalBiomassKg;
  const fcrFinancialLeak = wastedFeedKg * feedCostPerKg;
  const totalLeakedCapital = deadBirdLoss + fcrFinancialLeak;

  const breakEvenPricePerKg = totalBiomassKg > 0 ? metrics.totalExpenses / totalBiomassKg : 0;

  // ── CAPITAL ALLOCATION BREAKDOWN ──
  const chickTotalCost = Number(batch?.chickCost || 0);
  const feedTotalCost = Number(metrics.feedExpenses || 0);
  const otherTotalCost = Math.max(0, metrics.totalExpenses - chickTotalCost - feedTotalCost);
  const totalExpenses = Math.max(1, metrics.totalExpenses);

  const feedPct = Math.round((feedTotalCost / totalExpenses) * 100);
  const chickPct = Math.round((chickTotalCost / totalExpenses) * 100);
  const otherPct = Math.max(0, 100 - feedPct - chickPct);

  return (
    <div className="fin-executive-wrap">
      {/* ── TWO-COLUMN DESKTOP / SINGLE-COLUMN MOBILE GRID ── */}
      <div className="fin-grid">
        {/* ══════════════════════════════════════════════════════════════════
            COLUMN 1: THE CORE PROFIT POSITION & SIMULATOR
           ══════════════════════════════════════════════════════════════════ */}
        <div className="fin-col-primary">
          {/* Hero Profit Card */}
          <section className="fin-hero-box">
            <div className="fin-hero-top-row">
              <span className="fin-meta-tag">ESTIMATED NET PROFIT</span>
              <span className={`fin-badge ${projectedNetProfit >= 0 ? 'profit' : 'loss'}`}>
                {projectedNetProfit >= 0 ? '+ In The Black' : '! Deficit'}
              </span>
            </div>

            <div className={`fin-hero-number ${projectedNetProfit >= 0 ? 'profit' : 'loss'}`}>
              {formatCurrency(projectedNetProfit, currency)}
            </div>

            <div className="fin-hero-sub-pills">
              <span className="fin-pill">
                <strong>{formatCurrency(profitPerLiveBird, currency)}</strong> / bird
              </span>
              <span className="fin-pill">
                Break-even: <strong>{formatCurrency(breakEvenPricePerKg, currency, true)}</strong>/kg
              </span>
            </div>
          </section>

          {/* Interactive Market Price Negotiation Tool */}
          <section className="fin-sim-box">
            <div className="fin-sim-header">
              <div className="fin-sim-title-group">
                <Sliders size={14} className="fin-sim-icon" />
                <span className="fin-sim-title">OFFERED BUYER PRICE</span>
              </div>
              <span className="fin-sim-price-tag">
                {formatCurrency(sellingPricePerKg, currency)} / kg
              </span>
            </div>

            <div className="fin-sim-slider-row">
              <input
                type="range"
                min={Math.round(breakEvenPricePerKg * 0.7)}
                max={Math.round(defaultPrice * 1.5)}
                step={currency === 'KSh' ? 5 : 0.1}
                value={sellingPricePerKg}
                onChange={(e) => setSellingPricePerKg(Number(e.target.value))}
                className="fin-price-range"
              />
            </div>

            <div className="fin-sim-presets">
              <span className="fin-sim-hint">Quick test:</span>
              {[defaultPrice - 30, defaultPrice, defaultPrice + 30, defaultPrice + 60].map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`fin-preset-btn ${sellingPricePerKg === p ? 'active' : ''}`}
                  onClick={() => setSellingPricePerKg(p)}
                >
                  {formatCurrency(p, currency)}
                </button>
              ))}
            </div>
          </section>

          {/* 3 Core Numbers Strip */}
          <section className="fin-stats-row">
            <div className="fin-stat-item">
              <span className="fin-stat-label">INVESTED</span>
              <span className="fin-stat-val">{formatCurrency(metrics.totalExpenses, currency)}</span>
            </div>
            <div className="fin-stat-item">
              <span className="fin-stat-label">EXP. SALES</span>
              <span className="fin-stat-val">{formatCurrency(projectedRevenue, currency)}</span>
            </div>
            <div className="fin-stat-item">
              <span className="fin-stat-label">LIVE BIOMASS</span>
              <span className="fin-stat-val">{formatNumber(totalBiomassKg, 0)} kg</span>
            </div>
          </section>

          {/* Actions */}
          <section className="fin-actions-row">
            <button className="fin-action-pill dark" onClick={onOpenSaleModal}>
              <DollarSign size={16} />
              <span>Record Sale</span>
            </button>
            <button className="fin-action-pill outline" onClick={onOpenExpenseModal}>
              <Plus size={16} />
              <span>Log Expense</span>
            </button>
          </section>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            COLUMN 2: CAPITAL ALLOCATION & PREVENTABLE LEAKS
           ══════════════════════════════════════════════════════════════════ */}
        <div className="fin-col-secondary">
          {/* Capital Distribution Breakdown */}
          <section className="fin-card">
            <div className="fin-card-header">
              <span className="fin-section-title">CAPITAL ALLOCATION</span>
              <span className="fin-card-total">{formatCurrency(metrics.totalExpenses, currency)}</span>
            </div>

            <div className="fin-alloc-bar">
              <div className="fin-alloc-segment feed" style={{ width: `${feedPct}%` }} title={`Feed: ${feedPct}%`} />
              <div className="fin-alloc-segment chicks" style={{ width: `${chickPct}%` }} title={`Chicks: ${chickPct}%`} />
              <div className="fin-alloc-segment other" style={{ width: `${otherPct}%` }} title={`Other: ${otherPct}%`} />
            </div>

            <div className="fin-alloc-legend">
              <div className="fin-legend-item">
                <span className="fin-dot feed" />
                <span className="fin-legend-name">Feed ({feedPct}%)</span>
                <span className="fin-legend-val">{formatCurrency(feedTotalCost, currency)}</span>
              </div>
              <div className="fin-legend-item">
                <span className="fin-dot chicks" />
                <span className="fin-legend-name">Chicks ({chickPct}%)</span>
                <span className="fin-legend-val">{formatCurrency(chickTotalCost, currency)}</span>
              </div>
              <div className="fin-legend-item">
                <span className="fin-dot other" />
                <span className="fin-legend-name">Meds &amp; Bedding ({otherPct}%)</span>
                <span className="fin-legend-val">{formatCurrency(otherTotalCost, currency)}</span>
              </div>
            </div>
          </section>

          {/* Preventable Leaks Section */}
          <section className="fin-card">
            <div className="fin-card-header">
              <span className="fin-section-title">PREVENTABLE LEAKS</span>
              {totalLeakedCapital > 0 && (
                <span className="fin-leak-total-badge">
                  -{formatCurrency(totalLeakedCapital, currency)} lost
                </span>
              )}
            </div>

            <div className="fin-clean-list">
              {/* Leak 1: Mortality */}
              <div
                className="fin-leak-row"
                onClick={() =>
                  setActiveLeakModal({
                    title: 'Mortality Loss',
                    amount: deadBirdLoss,
                    subtitle: `${metrics.totalDeaths} birds dead so far`,
                    explanation: `Each dead bird represents the initial purchase cost plus all feed, vaccines, and brooding heat consumed prior to death.`,
                    remedy: `To reduce Week 3+ mortality, inspect house ventilation (ammonia fumes paralyze airway cilia) and verify timely Gumboro vaccination.`,
                  })
                }
              >
                <div className="fin-leak-left">
                  <div className="fin-leak-icon-wrap red">
                    <HeartCrack size={16} />
                  </div>
                  <div>
                    <div className="fin-leak-name">Mortality Drain</div>
                    <div className="fin-leak-hint">{metrics.totalDeaths} birds dead</div>
                  </div>
                </div>
                <div className="fin-leak-right">
                  <span className="fin-leak-amount neg">
                    -{formatCurrency(deadBirdLoss, currency)}
                  </span>
                  <ChevronRight size={16} className="fin-chevron" />
                </div>
              </div>

              {/* Leak 2: FCR Waste */}
              <div
                className="fin-leak-row"
                onClick={() =>
                  setActiveLeakModal({
                    title: 'Feed Inefficiency (FCR)',
                    amount: fcrFinancialLeak,
                    subtitle: `Current FCR: ${formatNumber(metrics.fcr, 2)} (Target: 1.55)`,
                    explanation: `When FCR exceeds 1.55, your birds consume extra feed to deposit each kilo of meat. An estimated ${formatNumber(wastedFeedKg, 1)} kg of feed was wasted.`,
                    remedy: `Raise feeder lips to bird back height to prevent feed spillage into shavings, and check for feed fines/dust separation.`,
                  })
                }
              >
                <div className="fin-leak-left">
                  <div className="fin-leak-icon-wrap amber">
                    <Wheat size={16} />
                  </div>
                  <div>
                    <div className="fin-leak-name">Feed Inefficiency</div>
                    <div className="fin-leak-hint">
                      {metrics.fcr > 1.55 ? `${formatNumber(metrics.fcr, 2)} FCR vs 1.55` : 'Optimal FCR'}
                    </div>
                  </div>
                </div>
                <div className="fin-leak-right">
                  <span className={`fin-leak-amount ${fcrFinancialLeak > 0 ? 'neg' : 'ok'}`}>
                    {fcrFinancialLeak > 0 ? `-${formatCurrency(fcrFinancialLeak, currency)}` : 'KSh 0'}
                  </span>
                  <ChevronRight size={16} className="fin-chevron" />
                </div>
              </div>
            </div>
          </section>

          {/* Harvest Window */}
          <section className="fin-harvest-strip">
            <div className="fin-harvest-left">
              <Scale size={16} className="fin-harvest-icon" />
              <div>
                <span className="fin-harvest-label">Optimal Harvest Window</span>
                <span className="fin-harvest-sub">Past Day 38, daily feed cost exceeds meat gain</span>
              </div>
            </div>
            <span className="fin-harvest-badge">Day 35 – 40</span>
          </section>
        </div>
      </div>

      {/* ── Leak Detail Bottom Drawer / Modal ── */}
      {activeLeakModal && (
        <div className="fin-drawer-backdrop" onClick={() => setActiveLeakModal(null)}>
          <div className="fin-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="fin-drawer-handle" />
            <div className="fin-drawer-header">
              <div>
                <span className="fin-drawer-tag">LEAK DIAGNOSIS</span>
                <h3 className="fin-drawer-title">{activeLeakModal.title}</h3>
                <span className="fin-drawer-amount">
                  -{formatCurrency(activeLeakModal.amount, currency)}
                </span>
              </div>
              <button className="fin-drawer-close" onClick={() => setActiveLeakModal(null)}>
                <X size={18} />
              </button>
            </div>

            <p className="fin-drawer-sub">{activeLeakModal.subtitle}</p>
            <p className="fin-drawer-desc">{activeLeakModal.explanation}</p>

            <div className="fin-drawer-remedy-card">
              <span className="fin-remedy-label">WHAT TO FIX:</span>
              <p>{activeLeakModal.remedy}</p>
            </div>

            <button className="fin-drawer-done-btn" onClick={() => setActiveLeakModal(null)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancePainkillerView;
