import React from 'react';
import { useFarm } from '../../context/FarmContext';
import { formatNumber, formatCurrency } from '../../utils/calculations';
import GrowthChart from './GrowthChart';
import { AlertCircle, Check, Plus } from 'lucide-react';

const DashboardView = ({ onOpenModal, onNavigate }) => {
  const { farmData, metrics, currency, toggleHealthStatus } = useFarm();
  const b = farmData.batch;

  // The single most urgent action item
  const nextHealth = farmData.health
    .filter((h) => h.status !== 'Completed')
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const isLowFeed = metrics.feedStockRemainingKg < 50;
  const isHighMortality = metrics.survivalRate < 95;

  return (
    <div className="dash-wrap">

      {/* ── FLOCK CONTEXT LINE ─────────────────────────── */}
      <div className="dash-context">
        <span className="dash-context-name">{b.name || 'Current Batch'}</span>
        <span className="dash-context-dot">·</span>
        <span className="dash-context-meta">{b.breed || 'Cobb 500'}</span>
      </div>

      {/* ── 3 HERO NUMBERS ─────────────────────────────── */}
      <div className="dash-hero">
        <div className="dash-hero-stat">
          <span className="dash-hero-num">{metrics.currentFlockAge ?? 1}</span>
          <span className="dash-hero-unit">day</span>
          <span className="dash-hero-label">Age</span>
        </div>

        <div className="dash-hero-divider" />

        <div className="dash-hero-stat">
          <span className="dash-hero-num">{formatNumber(metrics.liveBirds)}</span>
          <span className="dash-hero-unit">birds</span>
          <span className="dash-hero-label">Live</span>
        </div>

        <div className="dash-hero-divider" />

        <div className="dash-hero-stat">
          <span className="dash-hero-num dash-hero-accent">
            {metrics.fcr > 0 ? formatNumber(metrics.fcr, 2) : '—'}
          </span>
          <span className="dash-hero-unit">FCR</span>
          <span className="dash-hero-label">Conversion</span>
        </div>
      </div>

      {/* ── ALERTS / NEXT ACTIONS (only shown when relevant) ── */}
      {(nextHealth || isLowFeed || isHighMortality) && (
        <div className="dash-alerts">
          {nextHealth && (
            <div className="dash-alert">
              <AlertCircle size={13} className="dash-alert-icon" />
              <span className="dash-alert-text">
                <strong>{nextHealth.name}</strong> due {nextHealth.date}
              </span>
              <button
                className="dash-alert-action"
                onClick={() => toggleHealthStatus(nextHealth.id)}
              >
                <Check size={12} />
                Done
              </button>
            </div>
          )}

          {isLowFeed && (
            <div className="dash-alert dash-alert--warn">
              <AlertCircle size={13} className="dash-alert-icon" />
              <span className="dash-alert-text">
                Feed low — <strong>{formatNumber(metrics.feedStockRemainingKg)} kg</strong> remaining
              </span>
              <button
                className="dash-alert-action"
                onClick={() => onOpenModal('feed')}
              >
                <Plus size={12} />
                Log
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── SECONDARY ROW: weight + profit ─────────────── */}
      <div className="dash-secondary">
        <div className="dash-secondary-item">
          <span className="dash-secondary-val">
            {metrics.latestAvgWeightGrams > 0
              ? `${formatNumber(metrics.latestAvgWeightGrams)} g`
              : '—'}
          </span>
          <span className="dash-secondary-label">Avg Weight</span>
        </div>
        <div className="dash-secondary-sep" />
        <div className="dash-secondary-item">
          <span className="dash-secondary-val">
            {formatNumber(metrics.adg, 1)} g/d
          </span>
          <span className="dash-secondary-label">Daily Gain</span>
        </div>
        <div className="dash-secondary-sep" />
        <div className="dash-secondary-item">
          <span
            className="dash-secondary-val"
            style={{ color: metrics.netProfit >= 0 ? 'var(--accent)' : 'var(--accent-red)' }}
          >
            {currency}{formatNumber(Math.abs(metrics.netProfit ?? 0))}
          </span>
          <span className="dash-secondary-label">
            {metrics.netProfit >= 0 ? 'Profit' : 'Loss'}
          </span>
        </div>
      </div>

      {/* ── GROWTH CHART ───────────────────────────────── */}
      <div className="dash-chart-wrap">
        <div className="dash-chart-head">
          <span className="dash-chart-title">Growth</span>
          <button
            className="dash-chart-action"
            onClick={() => onOpenModal('weight')}
          >
            + Weight
          </button>
        </div>
        <GrowthChart height={200} />
      </div>

    </div>
  );
};

export default DashboardView;
