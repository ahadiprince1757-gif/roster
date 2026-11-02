import React from 'react';
import { Menu, Calendar, Globe, Plus } from 'lucide-react';
import { useFarm } from '../../context/FarmContext';

const TITLES = {
  dashboard: {
    title: 'Flock Performance Overview',
    subtitle: 'Real-time telemetry, growth curves, feed efficiency, and bio-security calendar.',
  },
  weights: {
    title: 'Weight Sampling & Growth',
    subtitle: 'Track sample body weights, uniformity, and average daily gain (ADG).',
  },
  feed: {
    title: 'Feed Inventory & Intake',
    subtitle: 'Monitor starter, grower, and finisher purchases and daily consumption logs.',
  },
  health: {
    title: 'Veterinary Calendar & Bio-Security',
    subtitle: 'Vaccination schedules, medication logs, and automated hatchery protocols.',
  },
  mortality: {
    title: 'Mortality & Flock Survivability',
    subtitle: 'Log bird losses, detect health anomaly spikes, and track survivability rates.',
  },
  finance: {
    title: 'Farm Ledger & Financial Economics',
    subtitle: 'Track input costs (chicks, feeds, vaccines, labor) versus bird sales revenue.',
  },
  batch: {
    title: 'Flock Configuration & Parameters',
    subtitle: 'Configure flock arrival date, breed benchmarks, supplier, and cycle targets.',
  },
};

const Topbar = ({ onToggleMobileMenu, onOpenQuickAction }) => {
  const { activeTab, currency, setCurrency, farmData, metrics } = useFarm();
  const meta = TITLES[activeTab] || TITLES.dashboard;

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          className="mobile-menu-btn"
          onClick={onToggleMobileMenu}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
        <div className="topbar-title-group">
          <h2>{meta.title}</h2>
          <p>{meta.subtitle}</p>
        </div>
      </div>

      <div className="topbar-actions">
        {/* Flock Age Badge */}
        {farmData.batch.date && (
          <div
            className="metric-pill pill-green"
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', fontSize: '0.78rem' }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }}></span>
            Flock Day {metrics.currentFlockAge}
          </div>
        )}

        {/* Currency Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-tertiary)', padding: '4px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <Globe size={14} style={{ color: 'var(--text-muted)' }} />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              outline: 'none',
              padding: '2px 0',
            }}
            title="Change farm currency"
          >
            <option value="KSh">KSh (Kenya)</option>
            <option value="$">$ (USD)</option>
            <option value="€">€ (EUR)</option>
            <option value="£">£ (GBP)</option>
            <option value="₦">₦ (NGN)</option>
            <option value="R">R (ZAR)</option>
            <option value="UGX">UGX (Uganda)</option>
            <option value="TZS">TZS (Tanzania)</option>
          </select>
        </div>

        {/* Today date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600 }}>
          <Calendar size={14} />
          <span>{todayFormatted}</span>
        </div>

        {/* Quick Log Action */}
        <button className="btn btn-primary btn-sm" onClick={onOpenQuickAction}>
          <Plus size={15} />
          <span>Quick Log</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
