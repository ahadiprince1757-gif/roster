import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { formatCurrency } from '../../utils/calculations';
import { Plus, Trash2 } from 'lucide-react';

const FinanceView = ({ onOpenExpenseModal, onOpenSaleModal }) => {
  const { farmData, metrics, currency, deleteFinance } = useFarm();
  const [filterType, setFilterType] = useState('all');

  const sortedFinances = [...farmData.finances].sort((a, b) => b.date.localeCompare(a.date));

  const filteredFinances = sortedFinances.filter((f) => {
    if (filterType === 'all') return true;
    return f.type === filterType;
  });

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction?')) {
      deleteFinance(id);
    }
  };

  const isProfitable = metrics.netProfit >= 0;

  return (
    <div>
      <div className="min-flock-header">
        <div>
          <h1 className="min-flock-title">Farm Economics</h1>
          <div className="min-flock-sub">Input expenses, bird sales, and breakeven margins</div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="min-btn-sub" onClick={onOpenExpenseModal}>
            + Expense
          </button>
          <button className="min-pill-btn" onClick={onOpenSaleModal}>
            <Plus size={14} />
            <span>Record Sale</span>
          </button>
        </div>
      </div>

      {/* 4 Clean Metrics */}
      <div className="min-metrics-row">
        <div className="min-metric-box">
          <div className="min-metric-label">Total Expenses</div>
          <div className="min-metric-num">{formatCurrency(metrics.totalExpenses, currency)}</div>
          <div className="min-metric-desc">Chicks, feed, labor, meds</div>
        </div>

        <div className="min-metric-box">
          <div className="min-metric-label">Sales Revenue</div>
          <div className="min-metric-num">{formatCurrency(metrics.totalRevenue, currency)}</div>
          <div className="min-metric-desc">Harvested bird sales</div>
        </div>

        <div className="min-metric-box">
          <div className="min-metric-label">Net Position</div>
          <div className="min-metric-num" style={{ color: isProfitable ? 'var(--accent)' : 'inherit' }}>
            {formatCurrency(metrics.netProfit, currency)}
          </div>
          <div className="min-metric-desc">{isProfitable ? 'Profitable margin' : 'Pre-harvest investment'}</div>
        </div>

        <div className="min-metric-box">
          <div className="min-metric-label">Cost / Live Bird</div>
          <div className="min-metric-num">{formatCurrency(metrics.costPerLiveBird, currency)}</div>
          <div className="min-metric-desc">Breakeven sale threshold</div>
        </div>
      </div>

      {/* Table */}
      <div className="min-card">
        <div className="min-card-head">
          <div>
            <h3>Cashflow Ledger</h3>
            <small>Direct expenses and sales</small>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'Expense', 'Sale'].map((t) => (
              <button
                key={t}
                className="min-btn-sub"
                style={{
                  fontSize: '0.78rem',
                  padding: '4px 10px',
                  background: filterType === t ? 'var(--text-primary)' : 'transparent',
                  color: filterType === t ? 'var(--bg-surface)' : 'inherit',
                }}
                onClick={() => setFilterType(t)}
              >
                {t === 'all' ? 'All' : t === 'Expense' ? 'Expenses' : 'Sales'}
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
                <th>Description</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredFinances.length > 0 ? (
                filteredFinances.map((f) => {
                  const isSale = f.type === 'Sale';
                  return (
                    <tr key={f.id}>
                      <td style={{ fontWeight: 600 }}>{f.date}</td>
                      <td style={{ color: isSale ? 'var(--accent)' : 'var(--text-secondary)' }}>
                        {f.type}
                      </td>
                      <td>{f.description}</td>
                      <td>
                        <strong>{isSale ? '+' : '-'} {formatCurrency(f.amount, currency)}</strong>
                      </td>
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
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-tertiary)' }}>
                    No financial entries logged yet.
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

export default FinanceView;
