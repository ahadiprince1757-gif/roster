import React from 'react';
import { useFarm } from '../../context/FarmContext';
import { formatNumber, ageAtDate } from '../../utils/calculations';
import { Plus, Trash2 } from 'lucide-react';

const MortalityView = ({ onOpenAddModal }) => {
  const { farmData, metrics, deleteDeath } = useFarm();

  const sortedDeaths = [...farmData.deaths].sort((a, b) => b.date.localeCompare(a.date));

  const handleDelete = (id) => {
    if (window.confirm('Delete this record?')) {
      deleteDeath(id);
    }
  };

  return (
    <div>
      <div className="min-flock-header">
        <div>
          <h1 className="min-flock-title">Mortality & Survivability</h1>
          <div className="min-flock-sub">Flock losses and post-mortem observations</div>
        </div>

        <button className="min-pill-btn" onClick={onOpenAddModal}>
          <Plus size={14} />
          <span>Record Loss</span>
        </button>
      </div>

      {/* 3 Metrics */}
      <div className="min-metrics-row">
        <div className="min-metric-box">
          <div className="min-metric-label">Survivability Rate</div>
          <div className="min-metric-num" style={{ color: 'var(--accent)' }}>
            {formatNumber(metrics.survivalRate, 1)}%
          </div>
          <div className="min-metric-desc">{formatNumber(metrics.liveBirds)} birds currently alive</div>
        </div>

        <div className="min-metric-box">
          <div className="min-metric-label">Cumulative Deaths</div>
          <div className="min-metric-num">{formatNumber(metrics.totalDeaths)}</div>
          <div className="min-metric-desc">of {formatNumber(metrics.initialChicks)} chicks placed</div>
        </div>

        <div className="min-metric-box">
          <div className="min-metric-label">Mortality Percentage</div>
          <div className="min-metric-num">
            {formatNumber(metrics.mortalityRate, 1)}%
          </div>
          <div className="min-metric-desc">Standard benchmark is &lt;5%</div>
        </div>
      </div>

      {/* Table */}
      <div className="min-card">
        <div className="min-card-head">
          <div>
            <h3>Mortality Ledger</h3>
            <small>Daily losses recorded</small>
          </div>
        </div>

        <div className="min-table-wrap">
          <table className="min-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Flock Age</th>
                <th>Quantity Lost</th>
                <th>Cause / Observation</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sortedDeaths.length > 0 ? (
                sortedDeaths.map((d) => {
                  const day = farmData.batch.date ? ageAtDate(d.date, farmData.batch.date) : '—';
                  return (
                    <tr key={d.id}>
                      <td style={{ fontWeight: 600 }}>{d.date}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>Day {day}</td>
                      <td>
                        <strong>{d.qty} {d.qty === 1 ? 'bird' : 'birds'}</strong>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{d.cause || 'Unspecified'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleDelete(d.id)}
                          style={{ color: 'var(--text-tertiary)', padding: '4px' }}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-tertiary)' }}>
                    No mortality records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MortalityView;
