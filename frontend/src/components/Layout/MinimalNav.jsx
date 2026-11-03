import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { useAuth } from '../../context/AuthContext';
import { Sun, Moon, Plus, LogIn, User } from 'lucide-react';
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
      <nav className="min-nav">
        {/* Top Row: Brand on left, Controls on right */}
        <div className="min-nav-top">
          <div className="min-brand" onClick={() => setActiveTab('landing')}>
            <img
              src={theme === 'dark' ? '/logo-white.png' : '/logo.png'}
              alt="Rosestar Logo"
            />
            <span>Rosestar</span>
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

            {/* User Profile or Sign In Button */}
            {user ? (
              <button
                className="min-btn-icon"
                onClick={() => setProfileOpen(true)}
                title={`Signed in as ${userName} (${user.email})`}
                style={{
                  position: 'relative',
                  padding: '2px',
                  borderRadius: '50%',
                  border: '1.5px solid var(--border-hairline)',
                }}
              >
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <span
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: 'var(--accent-subtle)',
                      color: 'var(--accent)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {userName[0].toUpperCase()}
                  </span>
                )}
                {/* Active status indicator dot */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    border: '1.5px solid var(--bg-surface)',
                  }}
                />
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('login')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-hairline)',
                  background: 'var(--bg-subtle)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <LogIn size={13} />
                <span>Sign In</span>
              </button>
            )}

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
