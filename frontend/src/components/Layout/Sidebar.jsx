import React from 'react';
import {
  LayoutDashboard,
  Scale,
  Wheat,
  Activity,
  HeartCrack,
  Coins,
  Settings2,
  Moon,
  Sun,
  Database,
  RefreshCw,
  FileText,
  Home
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, section: 'WORKSPACE' },
  { id: 'weights', label: 'Weight Tracking', icon: Scale, section: 'WORKSPACE' },
  { id: 'feed', label: 'Feed Management', icon: Wheat, section: 'WORKSPACE' },
  { id: 'health', label: 'Health & Vaccines', icon: Activity, section: 'WORKSPACE' },
  { id: 'mortality', label: 'Mortality Records', icon: HeartCrack, section: 'WORKSPACE' },
  { id: 'finance', label: 'Expenses & Sales', icon: Coins, section: 'BUSINESS' },
  { id: 'batch', label: 'Batch Settings', icon: Settings2, section: 'BUSINESS' },
];

const Sidebar = ({ isOpen, onClose, onOpenReport }) => {
  const { activeTab, setActiveTab, farmData, metrics, theme, toggleTheme, loadDemoData, resetAllData } = useFarm();

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  const pendingHealthCount = farmData.health.filter((h) => h.status !== 'Completed').length;

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} id="sidebar">
      {/* Brand with Rooster Logo */}
      <div className="brand-section" style={{ cursor: 'pointer' }} onClick={() => handleNavClick('landing')}>
        <div
          className="brand-icon"
          style={{
            background: 'var(--primary-light)',
            border: '1px solid var(--border-subtle)',
            padding: '4px',
            overflow: 'hidden',
          }}
        >
          <img
            src={theme === 'dark' ? '/logo-white.png' : '/logo.png'}
            alt="Rooster Logo"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
        <div>
          <div className="brand-title">
            Rosestar <span className="brand-badge">PRO</span>
          </div>
          <div className="brand-sub">Poultry Intelligence</div>
        </div>
      </div>

      {/* Landing Page Link */}
      <button
        className={`nav-item ${activeTab === 'landing' ? 'active' : ''}`}
        onClick={() => handleNavClick('landing')}
        style={{ marginBottom: '8px' }}
      >
        <Home size={18} />
        <span>Landing Page</span>
      </button>

      {/* Nav items */}
      <div className="nav-group-label">WORKSPACE</div>
      {NAV_ITEMS.filter((item) => item.section === 'WORKSPACE').map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => handleNavClick(item.id)}
          >
            <Icon size={18} />
            <span>{item.label}</span>
            {item.id === 'health' && pendingHealthCount > 0 && (
              <span className="badge">{pendingHealthCount}</span>
            )}
          </button>
        );
      })}

      <div className="nav-group-label">BUSINESS</div>
      {NAV_ITEMS.filter((item) => item.section === 'BUSINESS').map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => handleNavClick(item.id)}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </button>
        );
      })}

      {/* Active Flock Card */}
      <div className="sidebar-flock-badge">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <h5>Active Flock</h5>
          <img
            src="/logo.png"
            alt="Logo"
            style={{ width: '18px', height: '18px', objectFit: 'contain', opacity: 0.6, filter: theme === 'dark' ? 'invert(1)' : 'none' }}
          />
        </div>
        <div className="sidebar-flock-name">
          <span>{farmData.batch.name || 'Unnamed Batch'}</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 800 }}>
            {farmData.batch.breed || 'Cobb 500'}
          </span>
        </div>
        <div className="sidebar-flock-meta">
          Day {metrics.currentFlockAge || 1} · {metrics.liveBirds.toLocaleString()} live birds
        </div>
        <div style={{ marginTop: '10px', display: 'flex', gap: '6px' }}>
          <button
            className="btn btn-light btn-sm"
            style={{ width: '100%', fontSize: '0.72rem', padding: '6px' }}
            onClick={onOpenReport}
            title="Generate printable performance report"
          >
            <FileText size={13} style={{ marginRight: '4px' }} />
            Flock Report
          </button>
        </div>
      </div>

      {/* Footer Utility Controls */}
      <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
        <button
          className="btn btn-light btn-sm btn-icon-only"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className="btn btn-light btn-sm btn-icon-only"
            onClick={loadDemoData}
            title="Load sample demo data"
          >
            <Database size={15} />
          </button>
          <button
            className="btn btn-light btn-sm btn-icon-only"
            onClick={resetAllData}
            title="Start fresh flock"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
