import React from 'react';
import { useFarm } from '../../context/FarmContext';
import { Sun, Moon, ArrowRight, ShieldCheck, Scale, Wheat, Activity } from 'lucide-react';
import { formatNumber } from '../../utils/calculations';

const LandingPage = ({ onEnterApp }) => {
  const { farmData, metrics, theme, toggleTheme } = useFarm();

  return (
    <div className="apple-landing">
      {/* Quiet Topbar */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 36px',
          borderBottom: '1px solid var(--border-hairline)',
          background: 'var(--bg-app)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={theme === 'dark' ? '/logo-white.png' : '/logo.png'}
            alt="Logo"
            style={{ width: '26px', height: '26px', objectFit: 'contain' }}
          />
          <span style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            BroilerOS
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="min-btn-icon"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button className="apple-btn-main" onClick={() => onEnterApp('dashboard')}>
            Open Console →
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="apple-hero">
        <div className="apple-logo-badge">
          <img
            src={theme === 'dark' ? '/logo-white.png' : '/logo.png'}
            alt="BroilerOS Rooster Logo"
          />
        </div>

        <h1 className="apple-headline">
          Poultry farming.<br />
          Simply mastered.
        </h1>

        <p className="apple-sub">
          The quiet, intelligent operating system for commercial broiler production.
          Growth curves, feed efficiency, and veterinary bio-security in pure clarity.
        </p>

        <div className="apple-cta-group">
          <button className="apple-btn-main" onClick={() => onEnterApp('dashboard')}>
            Launch Farm Operations →
          </button>
          <button className="apple-btn-sub" onClick={() => onEnterApp('weights')}>
            Weight Benchmarks
          </button>
        </div>
      </section>

      {/* 3 Pillars */}
      <div className="apple-pillars">
        <div className="apple-pillar-card">
          <div style={{ color: 'var(--text-secondary)', marginBottom: '14px' }}>
            <Scale size={24} />
          </div>
          <h3>Growth Intelligence</h3>
          <p>
            Real-time flock body weight progression charted against Cobb 500 standards. Know exactly when your flock is on target.
          </p>
        </div>

        <div className="apple-pillar-card">
          <div style={{ color: 'var(--text-secondary)', marginBottom: '14px' }}>
            <Wheat size={24} />
          </div>
          <h3>Feed Efficiency (FCR)</h3>
          <p>
            Automated Feed Conversion Ratio calculation and remaining warehouse stock burn rate tracking without spreadsheet complexity.
          </p>
        </div>

        <div className="apple-pillar-card">
          <div style={{ color: 'var(--text-secondary)', marginBottom: '14px' }}>
            <Activity size={24} />
          </div>
          <h3>Bio-Security Calendar</h3>
          <p>
            Automated vaccination timelines for Gumboro, Newcastle, and vitamins mapped to your chick arrival dates.
          </p>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-hairline)',
          padding: '24px',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-tertiary)',
          marginTop: 'auto',
        }}
      >
        BroilerOS · Your farm. Your data. Your decisions.
      </footer>
    </div>
  );
};

export default LandingPage;
