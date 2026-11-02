import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { formatNumber, formatCurrency } from '../../utils/calculations';
import { Plus, Trash2 } from 'lucide-react';

const FeedView = ({ onOpenAddModal }) => {
  const { farmData, metrics, currency, deleteFeed } = useFarm();
  const [filterType, setFilterType] = useState('all');

  const sortedFeeds = [...farmData.feeds].sort((a, b) => b.date.localeCompare(a.date));

  const filteredFeeds = sortedFeeds.filter((f) => {
    if (filterType === 'all') return true;
    return f.type === filterType;
  });

  const handleDelete = (id) => {
    if (window.confirm('Delete this feed entry?')) {
      deleteFeed(id);
    }
  };

  const avgDailyConsumption = metrics.feedConsumedKg / Math.max(1, metrics.currentFlockAge);
  const daysOfFeedLeft = avgDailyConsumption > 0 ? Math.floor(metrics.feedStockRemainingKg / avgDailyConsumption) : 0;

  return (
    <div>
      <div className="min-flock-header">
        <div>
          <h1 className="min-flock-title">Feed Management</h1>
          <div className="min-flock-sub">Inventory, intake, and warehouse burn rate</div>
        </div>

        <button className="min-pill-btn" onClick={onOpenAddModal}>
          <Plus size={14} />
          <span>Log Feed</span>
        </button>
      </div>

      {/* 3 Metrics */}
      <div className="min-metrics-row">
        <div className="min-metric-box">
          <div className="min-metric-label">Feed In Stock</div>
          <div className="min-metric-num">{formatNumber(metrics.feedStockRemainingKg)}kg</div>
          <div className="min-metric-desc">~{daysOfFeedLeft} days supply remaining</div>
        </div>

        <div className="min-metric-box">
          <div className="min-metric-label">Total Consumed</div>
          <div className="min-metric-num">{formatNumber(metrics.feedConsumedKg)}kg</div>
          <div className="min-metric-desc">Fed to flock to date</div>
        </div>

        <div className="min-metric-box">
          <div className="min-metric-label">Total Feed Spend</div>
          <div className="min-metric-num">{formatCurrency(metrics.feedExpenses, currency)}</div>
          <div className="min-metric-desc">{formatNumber(metrics.feedPurchasedKg)}kg purchased</div>
        </div>
      </div>

      {/* Table */}
      <div className="min-card">
        <div className="min-card-head">
          <div>
            <h3>Feed Logs</h3>
            <small>Combined record of feedings and bag purchases</small>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'consumption', 'purchase'].map((type) => (
              <button
                key={type}
                className="min-btn-sub"
                style={{
                  fontSize: '0.78rem',
                  padding: '4px 10px',
                  background: filterType === type ? 'var(--text-primary)' : 'transparent',
                  color: filterType === type ? 'var(--bg-surface)' : 'inherit',
                }}
                onClick={() => setFilterType(type)}
              >
                {type === 'all' ? 'All' : type === 'consumption' ? 'Intake' : 'Purchases'}
              </button>
            ))}
          </div>
        </div>

        <div className="min-table-wrap">
          <table className="min-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Cost</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredFeeds.length > 0 ? (
                filteredFeeds.map((f) => (
                  <tr key={f.id}>
                    <td style={{ fontWeight: 600 }}>{f.date}</td>
                    <td style={{ color: f.type === 'purchase' ? 'var(--accent)' : 'var(--text-secondary)' }}>
                      {f.type === 'purchase' ? 'Purchase' : 'Consumption'}
                    </td>
                    <td>{f.category}</td>
                    <td><strong>{formatNumber(f.qty)} kg</strong></td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {f.cost > 0 ? formatCurrency(f.cost, currency) : '—'}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{f.notes || '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(f.id)}
                        style={{ color: 'var(--text-tertiary)', padding: '4px' }}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-tertiary)' }}>
                    No feed transactions logged yet.
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

export default FeedView;
