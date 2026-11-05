import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import {
  LayoutDashboard,
  Stethoscope,
  Scale,
  Coins,
  MoreHorizontal,
  ClipboardList,
  Settings2,
  FileText,
  User,
  X,
  Sun,
  Moon,
  Plus,
} from 'lucide-react';

const MAIN_NAV = [
  { id: 'dashboard', label: 'Home',     icon: LayoutDashboard },
  { id: 'diagnose',  label: 'Diagnose', icon: Stethoscope, isSpecial: true },
  { id: 'flock',     label: 'Flock',    icon: Scale },
  { id: 'finance',   label: 'Finance',  icon: Coins },
];

const MORE_NAV = [
  { id: 'records',   label: 'Protocol & Vaccines', icon: ClipboardList },
  { id: 'batch',     label: 'Flock Settings',      icon: Settings2 },
  { id: 'login',     label: 'Account Profile',     icon: User },
];

const BottomNav = ({ onOpenReport, onOpenQuickLog }) => {
  const { activeTab, setActiveTab, theme, toggleTheme, currency, setCurrency } = useFarm();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const handleTabClick = (id) => {
    setActiveTab(id);
    setMoreMenuOpen(false);
  };

  const isMoreActive = MORE_NAV.some((item) => item.id === activeTab);

  return (
    <>
      {/* Backdrop */}
      {moreMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            zIndex: 60,
          }}
          onClick={() => setMoreMenuOpen(false)}
        />
      )}

      {/* More Sheet */}
      {moreMenuOpen && (
        <div className="more-sheet">
          <div className="more-sheet-handle" />

          {/* Quick actions row */}
          <div className="more-sheet-quick">
            <button
              className="more-sheet-quick-btn"
              onClick={() => {
                setMoreMenuOpen(false);
                onOpenQuickLog?.();
              }}
            >
              <Plus size={16} />
              <span>Log Entry</span>
            </button>
            <button
              className="more-sheet-quick-btn"
              onClick={() => {
                setMoreMenuOpen(false);
                onOpenReport?.();
              }}
            >
              <FileText size={16} />
              <span>Flock Report</span>
            </button>
            <button className="more-sheet-quick-btn" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>

          {/* Nav items */}
          <div className="more-sheet-nav">
            {MORE_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`more-sheet-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleTabClick(item.id)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Currency Switcher */}
          <div className="more-sheet-footer">
            <span className="more-sheet-footer-label">Farm Currency</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="more-sheet-currency"
            >
              <option value="KSh">KSh (Kenya)</option>
              <option value="$">USD ($)</option>
              <option value="€">EUR (€)</option>
              <option value="£">GBP (£)</option>
              <option value="₦">NGN (Nigeria)</option>
              <option value="R">ZAR (South Africa)</option>
            </select>
          </div>

          <button className="more-sheet-close" onClick={() => setMoreMenuOpen(false)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Fixed Bottom Tab Bar */}
      <nav className="bottom-bar">
        {MAIN_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`bottom-bar-item ${isActive ? 'active' : ''} ${item.isSpecial ? 'diag-pill-tab' : ''}`}
              onClick={() => handleTabClick(item.id)}
            >
              <Icon size={20} strokeWidth={isActive ? 2.2 : 1.7} />
              <span className="bottom-bar-label">{item.label}</span>
            </button>
          );
        })}

        <button
          className={`bottom-bar-item ${isMoreActive || moreMenuOpen ? 'active' : ''}`}
          onClick={() => setMoreMenuOpen(!moreMenuOpen)}
        >
          <MoreHorizontal size={20} strokeWidth={isMoreActive || moreMenuOpen ? 2.2 : 1.7} />
          <span className="bottom-bar-label">More</span>
        </button>
      </nav>
    </>
  );
};

export default BottomNav;
