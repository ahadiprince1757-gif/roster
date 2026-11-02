import React from 'react';
import { useFarm } from '../../context/FarmContext';
import { formatNumber, formatCurrency } from '../../utils/calculations';
import GrowthChart from './GrowthChart';
import { Plus, Check, ChevronRight } from 'lucide-react';

const DashboardView = ({ onOpenModal, onNavigate }) => {
  const { farmData, metrics, currency, toggleHealthStatus } = useFarm();
  const b = farmData.batch;

  const pendingHealth = farmData.health
    .filter((h) => h.status !== 'Completed')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  const recentWeights = [...farmData.weights]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <div>
      {/* Flock Header */}
      <div className="min-flock-header">
        <div>
          <h1 className="min-flock-title">{b.name || 'Current Broiler Batch'}</h1>
          <div className="min-flock-sub">
            {b.breed || 'Cobb 500'} · Day {metrics.currentFlockAge || 1} · {formatNumber(metrics.survivalRate, 1)}% Survivability
          </div>
        </div>

        <button
          className="min-btn-sub"
          onClick={() => onNavigate('batch')}
          style={{ fontSize: '0.82rem', padding: '6px 14px' }}
        >
          Flock Details →
        </button>
      </div>

      {/* 4 Quiet Bold Numbers */}
      <div className="min-metrics-row">
        <div className="min-metric-box">
          <div className="min-metric-label">Live Birds</div>
          <div className="min-metric-num">{formatNumber(metrics.liveBirds)}</div>
          <div className="min-metric-desc">of {formatNumber(metrics.initialChicks)} placed</div>
        </div>

        <div className="min-metric-box">
          <div className="min-metric-label">Average Weight</div>
          <div className="min-metric-num">
            {metrics.latestAvgWeightGrams > 0 ? `${formatNumber(metrics.latestAvgWeightGrams)}g` : '0g'}
          </div>
          <div className="min-metric-desc">ADG: {formatNumber(metrics.adg, 1)}g/day</div>
        </div>

        <div className="min-metric-box">
          <div className="min-metric-label">Feed Conversion</div>
          <div className="min-metric-num" style={{ color: 'var(--accent)' }}>
            {metrics.fcr > 0 ? formatNumber(metrics.fcr, 2) : '1.54'}
          </div>
          <div className="min-metric-desc">kg feed / kg meat</div>
        </div>

        <div className="min-metric-box">
          <div className="min-metric-label">Feed In Stock</div>
          <div className="min-metric-num">{formatNumber(metrics.feedStockRemainingKg)}kg</div>
          <div className="min-metric-desc">{formatNumber(metrics.feedConsumedKg)}kg consumed</div>
        </div>
      </div>

      {/* Growth Chart Card */}
      <div className="min-card">
        <div className="min-card-head">
          <div>
            <h3>Flock Growth Trajectory</h3>
            <small>Actual weight gain vs Cobb 500 benchmark target</small>
          </div>
          <button
            className="min-btn-sub"
            style={{ fontSize: '0.78rem', padding: '4px 10px' }}
            onClick={() => onOpenModal('weight')}
          >
            + Add Weight
          </button>
        </div>

        <GrowthChart height={240} />
      </div>

      {/* Two Minimal Columns: Upcoming Vaccines & Recent Samplings */}
      <div className="min-dashboard-split">
        {/* Scheduled Bio-Security */}
        <div className="min-card" style={{ marginBottom: 0 }}>
          <div className="min-card-head">
            <div>
              <h3>Upcoming Health Protocol</h3>
              <small>Bio-security & vaccines</small>
            </div>
            <button
              onClick={() => onNavigate('health')}
              style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}
            >
              All →
            </button>
          </div>

          {pendingHealth.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingHealth.map((h) => (
                <div
                  key={h.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--border-hairline)',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.88rem', display: 'block' }}>{h.name}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                      {h.date} · {h.method || 'Drinking water'}
                    </span>
                  </div>
                  <button
                    className="min-btn-sub"
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    onClick={() => toggleHealthStatus(h.id)}
                  >
                    Done
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', padding: '16px 0' }}>
              All scheduled vaccinations are completed.
            </div>
          )}
        </div>

        {/* Recent Weight Measurements */}
        <div className="min-card" style={{ marginBottom: 0 }}>
          <div className="min-card-head">
            <div>
              <h3>Recent Weighings</h3>
              <small>Flock samplings</small>
            </div>
            <button
              onClick={() => onNavigate('weights')}
              style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}
            >
              All →
            </button>
          </div>

          {recentWeights.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentWeights.map((w) => (
                <div
                  key={w.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--border-hairline)',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.95rem' }}>{formatNumber(w.avg)} g</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginLeft: '10px' }}>
                      {w.sample} birds sampled
                    </span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {w.date}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', padding: '16px 0' }}>
              No measurements recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
