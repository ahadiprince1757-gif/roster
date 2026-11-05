import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { useAuth } from '../../context/AuthContext';
import { Sun, Moon, Plus, LogIn, Stethoscope, Settings2 } from 'lucide-react';
import UserProfileModal from '../Auth/UserProfileModal';

const TABS = [
  { id: 'dashboard', label: 'Home' },
  { id: 'diagnose',  label: 'Diagnose', isSpecial: true },
  { id: 'flock',     label: 'Flock' },
  { id: 'finance',   label: 'Finance' },
  { id: 'records',   label: 'Protocol' },
];

const MinimalNav = ({ onOpenQuickLog }) => {
  const { activeTab, setActiveTab, theme, toggleTheme, currency, setCurrency } = useFarm();
  const { user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  return (
    <>
      <header className="min-nav">
        <div className="min-nav-inner">
          {/* Brand — always visible */}
          <div className="min-brand" onClick={() => setActiveTab('dashboard')} title="Rosestar Home">
            <img
              src={theme === 'dark' ? '/logo-white.png' : '/logo.png'}
              alt="Rosestar"
            />
            <span className="min-brand-title">Rosestar</span>
          </div>

          {/* Desktop-only segmented tab bar */}
          <div className="min-segmented-scroll min-desktop-only">
            <div className="min-segmented">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`min-seg-item ${activeTab === tab.id ? 'active' : ''} ${tab.isSpecial ? 'special-tab' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.isSpecial && <Stethoscope size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right controls */}
          <div className="min-controls">
            {/* Desktop extras */}
            <div className="min-desktop-controls">
              <div className="min-currency-pill">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="min-currency-select"
                >
                  <option value="KSh">KSh</option>
                  <option value="$">USD ($)</option>
                  <option value="€">EUR (€)</option>
                  <option value="£">GBP (£)</option>
                  <option value="₦">NGN (₦)</option>
                  <option value="R">ZAR (R)</option>
                </select>
              </div>
              <button className="min-btn-icon" onClick={toggleTheme} title="Toggle Dark/Light Mode">
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>

            {/* Quick Log button */}
            <button className="min-pill-btn" onClick={onOpenQuickLog} title="Quick Log">
              <Plus size={14} />
              <span>Log</span>
            </button>

            {/* Avatar / Sign in */}
            {user ? (
              <button
                className="min-avatar-btn"
                onClick={() => setProfileOpen(true)}
                title="Account Profile"
              >
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="min-avatar-img" />
                ) : (
                  <span className="min-avatar-initial">{userName[0].toUpperCase()}</span>
                )}
                <span className="min-status-dot" />
              </button>
            ) : (
              <button className="min-signin-btn" onClick={() => setActiveTab('login')}>
                <LogIn size={13} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <UserProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        onOpenLogin={() => setActiveTab('login')}
      />
    </>
  );
};

export default MinimalNav;
