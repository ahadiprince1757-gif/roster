import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { useAuth } from '../../context/AuthContext';
import { Sun, Moon, Plus, LogIn } from 'lucide-react';
import UserProfileModal from '../Auth/UserProfileModal';

const TABS = [
  { id: 'dashboard',  label: 'Overview' },
  { id: 'weights',    label: 'Weights' },
  { id: 'feed',       label: 'Feed' },
  { id: 'health',     label: 'Health' },
  { id: 'mortality',  label: 'Mortality' },
  { id: 'finance',    label: 'Finances' },
  { id: 'standards',  label: 'Standards' },
  { id: 'batch',      label: 'Settings' },
];

const MinimalNav = ({ onOpenQuickLog, onOpenReport }) => {
  const { activeTab, setActiveTab, theme, toggleTheme, currency, setCurrency } = useFarm();
  const { user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  return (
    <>
      <header className="min-nav">
        <div className="min-nav-inner">
          {/* Brand */}
          <div className="min-brand" onClick={() => setActiveTab('landing')} title="Go to home">
          <img
            src={theme === 'dark' ? '/logo-white.png' : '/logo.png'}
            alt="Rosestar Logo"
          />
          <span className="min-brand-title">Rosestar</span>
        </div>

        {/* Center: Apple-style Segmented Navigation (Desktop) */}
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

        {/* Right Controls */}
        <div className="min-controls">
          {/* Desktop-only secondary controls (Theme & Currency) */}
          <div className="min-desktop-controls">
            <div className="min-currency-pill">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="min-currency-select"
                title="Currency"
              >
                <option value="KSh">KSh</option>
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
                <option value="₦">NGN (₦)</option>
                <option value="R">ZAR (R)</option>
              </select>
            </div>

            <button
              className="min-btn-icon"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>

          {/* Quick Action: Log Button */}
          <button className="min-pill-btn" onClick={onOpenQuickLog} title="Quick log entry">
            <Plus size={14} />
            <span>Log</span>
          </button>

          {/* User Profile or Sign In */}
          {user ? (
            <button
              className="min-avatar-btn"
              onClick={() => setProfileOpen(true)}
              title={`Farmer: ${userName} (${user.email || 'active'})`}
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="min-avatar-img"
                />
              ) : (
                <span className="min-avatar-initial">
                  {userName[0].toUpperCase()}
                </span>
              )}
              <span className="min-status-dot" />
            </button>
          ) : (
            <button
              className="min-signin-btn"
              onClick={() => setActiveTab('login')}
              title="Sign in with Google"
            >
              <LogIn size={13} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>

      {/* User Profile Popover Modal */}
      <UserProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        onOpenLogin={() => setActiveTab('login')}
      />
    </>
  );
};

export default MinimalNav;
