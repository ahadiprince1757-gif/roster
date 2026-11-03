import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { ageAtDate } from '../../utils/calculations';
import { Plus, Trash2, Sparkles, BookOpen, ClipboardList } from 'lucide-react';
import VaccineGuidePanel from './VaccineGuidePanel';

const HealthView = ({ onOpenAddModal }) => {
  const { farmData, toggleHealthStatus, deleteHealth, loadStandardVaccinationSchedule } = useFarm();
  const [filter, setFilter]     = useState('all');
  const [view, setView]         = useState('schedule'); // 'schedule' | 'guide'

  const sortedHealth = [...farmData.health].sort((a, b) => a.date.localeCompare(b.date));

  const filteredHealth = sortedHealth.filter((h) => {
    if (filter === 'completed') return h.status === 'Completed';
    if (filter === 'pending')   return h.status !== 'Completed';
    return true;
  });

  const completedCount = farmData.health.filter((h) => h.status === 'Completed').length;
  const pendingCount   = farmData.health.filter((h) => h.status !== 'Completed').length;

  const handleDelete = (id) => {
    if (window.confirm('Delete this health activity?')) deleteHealth(id);
  };

  return (
    <div>
      {/* ── Page Header ── */}
      <div className="min-flock-header">
        <div>
          <h1 className="min-flock-title">Health &amp; Bio-Security</h1>
          <div className="min-flock-sub">Vaccination schedule, veterinary records and reference guide</div>
        </div>

        {/* View toggle */}
        <div className="health-view-toggle">
          <button
            className={`health-toggle-btn ${view === 'schedule' ? 'active' : ''}`}
            onClick={() => setView('schedule')}
          >
            <ClipboardList size={14} />
            This Batch
          </button>
          <button
            className={`health-toggle-btn ${view === 'guide' ? 'active' : ''}`}
            onClick={() => setView('guide')}
          >
            <BookOpen size={14} />
            Vaccine Guide
          </button>
        </div>
      </div>

      {/* ── VACCINE GUIDE VIEW ── */}
      {view === 'guide' && <VaccineGuidePanel />}

      {/* ── BATCH SCHEDULE VIEW ── */}
      {view === 'schedule' && (
        <>
          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <button
              className="min-btn-sub"
              style={{ fontSize: '0.82rem' }}
              onClick={loadStandardVaccinationSchedule}
              title="Auto-load standard Cobb/Ross vaccination protocol"
            >
              <Sparkles size={14} style={{ marginRight: '4px' }} />
              Auto-Schedule Protocols
            </button>
            <button className="min-pill-btn" onClick={onOpenAddModal}>
              <Plus size={14} />
              <span>Add Task</span>
            </button>
          </div>

          {/* 2 summary numbers */}
          <div className="min-metrics-row">
            <div className="min-metric-box">
              <div className="min-metric-label">Completed Tasks</div>
              <div className="min-metric-num">{completedCount}</div>
              <div className="min-metric-desc">Vaccines &amp; checks administered</div>
            </div>
            <div className="min-metric-box">
              <div className="min-metric-label">Scheduled / Pending</div>
              <div
                className="min-metric-num"
                style={{ color: pendingCount > 0 ? 'var(--text-primary)' : 'var(--accent)' }}
              >
                {pendingCount}
              </div>
              <div className="min-metric-desc">Upcoming bio-security tasks</div>
            </div>
          </div>

          {/* Ledger table */}
          <div className="min-card">
            <div className="min-card-head">
              <div>
                <h3>Vaccination Ledger</h3>
                <small>Chronological health procedures for this batch</small>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['all', 'pending', 'completed'].map((f) => (
                  <button
                    key={f}
                    className="min-btn-sub"
                    style={{
                      fontSize: '0.78rem',
                      padding: '4px 10px',
                      background: filter === f ? 'var(--text-primary)' : 'transparent',
                      color: filter === f ? 'var(--bg-surface)' : 'inherit',
                    }}
                    onClick={() => setFilter(f)}
                  >
                    {f === 'all' ? 'All' : f === 'pending' ? 'Pending' : 'Completed'}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-table-wrap">
              <table className="min-table">
                <thead>
                  <tr>
                    <th>Activity / Vaccine</th>
                    <th>Date</th>
                    <th>Age</th>
                    <th>Type</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHealth.length > 0 ? (
                    filteredHealth.map((h) => {
                      const day = farmData.batch.date ? ageAtDate(h.date, farmData.batch.date) : '—';
                      const isCompleted = h.status === 'Completed';
                      return (
                        <tr key={h.id}>
                          <td>
                            <strong>{h.name}</strong>
                            {h.notes && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                                {h.notes}
                              </div>
                            )}
                          </td>
                          <td style={{ fontWeight: 600 }}>{h.date}</td>
                          <td style={{ color: 'var(--text-secondary)' }}>Day {day}</td>
                          <td style={{ color: 'var(--text-secondary)' }}>{h.type}</td>
                          <td style={{ color: 'var(--text-secondary)' }}>{h.method || 'Drinking water'}</td>
                          <td>
                            <button
                              className="min-btn-sub"
                              style={{
                                fontSize: '0.75rem',
                                padding: '3px 8px',
                                background: isCompleted ? 'var(--bg-subtle)' : 'var(--text-primary)',
                                color: isCompleted ? 'var(--text-secondary)' : 'var(--bg-surface)',
                              }}
                              onClick={() => toggleHealthStatus(h.id)}
                            >
                              {isCompleted ? 'Done' : 'Mark Done'}
                            </button>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              onClick={() => handleDelete(h.id)}
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
                        No health records match current filter.
                        <br />
                        <button
                          className="min-btn-sub"
                          style={{ marginTop: '12px', fontSize: '0.8rem' }}
                          onClick={() => setView('guide')}
                        >
                          <BookOpen size={13} style={{ marginRight: '4px' }} />
                          View Vaccine Guide
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HealthView;
