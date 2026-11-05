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
  Plus,
  Scale,
  Wheat,
  X,
} from 'lucide-react';

const FinancePainkillerView = ({ onOpenExpenseModal, onOpenSaleModal }) => {
  const { farmData, currency } = useFarm();
  const { batch, weights, feeds, deaths, finances } = farmData;
  const metrics = calculateFlockMetrics(batch, weights, feeds, deaths, finances);

  const [activeLeakModal, setActiveLeakModal] = useState(null);

  const sellingPricePerKg = currency === 'KSh' ? 380 : currency === '$' ? 3.5 : 3.0;
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

  return (
    <div className="fin-clean-wrap">
      {/* ── Top Hero: Huge Net Profit, Pure Air ── */}
      <section className="fin-hero-minimal">
        <span className="fin-meta-tag">ESTIMATED NET PROFIT</span>
        <div className={`fin-hero-number ${projectedNetProfit >= 0 ? 'profit' : 'loss'}`}>
          {formatCurrency(projectedNetProfit, currency)}
        </div>
        <div className="fin-hero-sub-pills">
          <span className="fin-pill">
            <strong>{formatCurrency(profitPerLiveBird, currency)}</strong> / bird
          </span>
          <span className="fin-pill">
            Break-even: <strong>{formatCurrency(breakEvenPricePerKg, currency)}</strong>/kg
          </span>
        </div>
      </section>

      {/* ── 3 Core Numbers (No boxes in boxes, just pure clean typography) ── */}
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

      {/* ── Actions: Minimal, Elegant ── */}
      <section className="fin-actions-row">
        <button className="fin-action-pill dark" onClick={onOpenSaleModal}>
          <DollarSign size={15} />
          <span>Record Sale</span>
        </button>
        <button className="fin-action-pill outline" onClick={onOpenExpenseModal}>
          <Plus size={15} />
          <span>Log Expense</span>
        </button>
      </section>

      {/* ── CAPITAL LEAKS: Clean Minimalist Line Items ── */}
      <section className="fin-leaks-section">
        <div className="fin-section-title-row">
          <span className="fin-section-title">PREVENTABLE LEAKS</span>
          {totalLeakedCapital > 0 && (
            <span className="fin-leak-total-badge">
              -{formatCurrency(totalLeakedCapital, currency)} total
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
                subtitle: `${metrics.totalDeaths} birds lost so far`,
                explanation: `Each dead chick represents the upfront purchase cost plus the starter/grower feed and vaccines consumed before dying.`,
                remedy: `To reduce Week 3+ losses, verify brooding ventilation (ammonia destroys bird lungs) and maintain strict Gumboro (IBD) booster timing.`,
              })
            }
          >
            <div className="fin-leak-left">
              <div className="fin-leak-icon-wrap red">
                <HeartCrack size={16} />
              </div>
              <div>
                <div className="fin-leak-name">Mortality Loss</div>
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
                title: 'Feed Conversion (FCR) Penalty',
                amount: fcrFinancialLeak,
                subtitle: `Current FCR: ${formatNumber(metrics.fcr, 2)} (Target: 1.55)`,
                explanation: `If your FCR exceeds 1.55, birds are eating more feed per kilo of meat produced. An extra ${formatNumber(wastedFeedKg, 1)} kg of feed was consumed.`,
                remedy: `Raise feeder lips to the height of the bird's back. When feeders sit too low, broilers rake pellets onto the floor with their beaks.`,
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

      {/* ── Harvest Window: 1 Clean Line ── */}
      <section className="fin-harvest-strip">
        <div className="fin-harvest-left">
          <Scale size={16} className="fin-harvest-icon" />
          <span className="fin-harvest-label">Recommended Harvest Window</span>
        </div>
        <span className="fin-harvest-badge">Day 35 – 40</span>
      </section>

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
              <span className="fin-remedy-label">WHAT TO FIX NOW:</span>
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
