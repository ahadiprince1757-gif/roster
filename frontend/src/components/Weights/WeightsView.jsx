import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { formatNumber, ageAtDate } from '../../utils/calculations';
import GrowthChart from '../Dashboard/GrowthChart';
import { Trash2, Plus } from 'lucide-react';

const WeightsView = ({ onOpenAddModal }) => {
  const { farmData, metrics, deleteWeight } = useFarm();
  const [searchTerm, setSearchTerm] = useState('');

  const sortedWeights = [...farmData.weights].sort((a, b) => b.date.localeCompare(a.date));

  const filteredWeights = sortedWeights.filter((w) =>
    w.date.includes(searchTerm) || (w.notes && w.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = (id) => {
    if (window.confirm('Delete this sample weight record?')) {
      deleteWeight(id);
    }
  };

  return (
    <div>
      <div className="min-flock-header">
        <div>
          <h1 className="min-flock-title">Flock Growth & Weights</h1>
          <div className="min-flock-sub">Sampling logs and average daily gain progression</div>
        </div>

        <button className="min-pill-btn" onClick={onOpenAddModal}>
          <Plus size={14} />
          <span>Add Weight</span>
        </button>
      </div>

      {/* 3 Clean Metrics */}
      <div className="min-metrics-row">
        <div className="min-metric-box">
          <div className="min-metric-label">Latest Average</div>
          <div className="min-metric-num">
            {metrics.latestAvgWeightGrams > 0 ? `${formatNumber(metrics.latestAvgWeightGrams)}g` : '0g'}
          </div>
          <div className="min-metric-desc">Day {metrics.currentFlockAge} recorded</div>
        </div>

        <div className="min-metric-box">
          <div className="min-metric-label">Daily Gain (ADG)</div>
          <div className="min-metric-num">{formatNumber(metrics.adg, 1)}g</div>
          <div className="min-metric-desc">Grams per bird per day</div>
        </div>

        <div className="min-metric-box">
          <div className="min-metric-label">Target Harvest</div>
          <div className="min-metric-num">{formatNumber(farmData.batch.targetWeight || 2600)}g</div>
          <div className="min-metric-desc">At Day {farmData.batch.targetAge || 42}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="min-card">
        <div className="min-card-head">
          <div>
            <h3>Weight Progression Curve</h3>
            <small>Compared against Cobb 500 standard</small>
          </div>
        </div>
        <GrowthChart height={250} />
      </div>

      {/* Table */}
      <div className="min-card">
        <div className="min-card-head">
          <div>
            <h3>Sampling Records</h3>
            <small>{farmData.weights.length} sessions logged</small>
          </div>

          <input
            type="text"
            placeholder="Search date or note..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-hairline)',
              fontSize: '0.8rem',
              background: 'var(--bg-subtle)',
            }}
          />
        </div>

        <div className="min-table-wrap">
          <table className="min-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Age</th>
                <th>Sample</th>
                <th>Average</th>
                <th>Min - Max</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredWeights.length > 0 ? (
                filteredWeights.map((w) => {
                  const day = farmData.batch.date ? ageAtDate(w.date, farmData.batch.date) : '—';
                  return (
                    <tr key={w.id}>
                      <td style={{ fontWeight: 600 }}>{w.date}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>Day {day}</td>
                      <td>{w.sample}</td>
                      <td>
                        <strong>{formatNumber(w.avg)} g</strong>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {formatNumber(w.min || w.avg)} - {formatNumber(w.max || w.avg)} g
                      </td>
                      <td style={{ color: 'var(--text-secondary)', maxWidth: '240px' }}>{w.notes || '—'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleDelete(w.id)}
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
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-tertiary)' }}>
                    No measurements recorded. Tap "Add Weight" to log your first sample.
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

export default WeightsView;
