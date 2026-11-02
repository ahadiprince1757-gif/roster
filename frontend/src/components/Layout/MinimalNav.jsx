import React from 'react';
import { useFarm } from '../../context/FarmContext';
import { Sun, Moon, Plus } from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Overview' },
  { id: 'weights', label: 'Weights' },
  { id: 'feed', label: 'Feed' },
  { id: 'health', label: 'Health' },
  { id: 'mortality', label: 'Mortality' },
  { id: 'finance', label: 'Finances' },
  { id: 'batch', label: 'Settings' },
];

const MinimalNav = ({ onOpenQuickLog, onOpenReport }) => {
  const { activeTab, setActiveTab, theme, toggleTheme, currency, setCurrency } = useFarm();

  return (
    <nav className="min-nav">
      {/* Top Row: Brand on left, Controls on right */}
      <div className="min-nav-top">
        <div className="min-brand" onClick={() => setActiveTab('landing')}>
          <img
            src={theme === 'dark' ? '/logo-white.png' : '/logo.png'}
            alt="BroilerOS Logo"
          />
          <span>BroilerOS</span>
        </div>

        <div className="min-controls">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '4px 6px',
              outline: 'none',
              background: 'transparent',
            }}
            title="Currency"
          >
            <option value="KSh">KSh</option>
            <option value="$">USD ($)</option>
            <option value="€">EUR (€)</option>
            <option value="£">GBP (£)</option>
            <option value="₦">NGN (₦)</option>
            <option value="R">ZAR (R)</option>
          </select>

          <button
            className="min-btn-icon"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button className="min-pill-btn" onClick={onOpenQuickLog}>
            <Plus size={13} />
            <span>Log</span>
          </button>
        </div>
      </div>

      {/* Horizontally scrollable segmented bar on mobile */}
      <div className="min-segmented-scroll">
        <div className="min-segmented">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`min-seg-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default MinimalNav;
