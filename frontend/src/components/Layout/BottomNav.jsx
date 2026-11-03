import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import {
  LayoutDashboard,
  Scale,
  Wheat,
  Activity,
  MoreHorizontal,
  Coins,
  Settings2,
  HeartCrack,
  FileText,
  Home,
  User,
  X
} from 'lucide-react';

const MAIN_NAV = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'weights', label: 'Weights', icon: Scale },
  { id: 'feed', label: 'Feed', icon: Wheat },
  { id: 'health', label: 'Health', icon: Activity },
];

const MORE_NAV = [
  { id: 'mortality', label: 'Mortality Records', desc: 'Flock survivability & death logs', icon: HeartCrack },
  { id: 'finance', label: 'Expenses & Sales', desc: 'Cashflow ledger & profit margins', icon: Coins },
  { id: 'batch', label: 'Flock Settings', desc: 'Batch configuration & targets', icon: Settings2 },
  { id: 'login', label: 'Farmer Account', desc: 'Google auth & farmer profile', icon: User },
  { id: 'landing', label: 'Landing Page', desc: 'Product introduction showcase', icon: Home },
];

const BottomNav = ({ onOpenReport }) => {
  const { activeTab, setActiveTab } = useFarm();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const handleTabClick = (id) => {
    setActiveTab(id);
    setMoreMenuOpen(false);
  };

  const isMoreActive = MORE_NAV.some((item) => item.id === activeTab);

  return (
    <>
      {/* "More" Slide-up Sheet Backdrop */}
      {moreMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(8px)',
            zIndex: 60,
          }}
          onClick={() => setMoreMenuOpen(false)}
        />
      )}

      {/* "More" Slide-up Sheet */}
      {moreMenuOpen && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: '64px',
            background: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-hairline)',
            borderTopLeftRadius: '22px',
            borderTopRightRadius: '22px',
            padding: '20px 18px 12px',
            zIndex: 70,
            boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.15)',
            animation: 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              paddingBottom: '10px',
              borderBottom: '1px solid var(--border-hairline)',
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              More Operations
            </span>
            <button
              onClick={() => setMoreMenuOpen(false)}
              style={{ padding: '4px', color: 'var(--text-tertiary)' }}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {MORE_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: isActive ? 'var(--bg-subtle)' : 'transparent',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: isActive ? 'var(--text-primary)' : 'var(--bg-subtle)',
                      color: isActive ? 'var(--bg-surface)' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.9rem', display: 'block', color: 'var(--text-primary)' }}>
                      {item.label}
                    </strong>
                    <small style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>
                      {item.desc}
                    </small>
                  </div>
                </button>
              );
            })}

            {/* Flock Report Option */}
            <button
              onClick={() => {
                setMoreMenuOpen(false);
                onOpenReport();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'transparent',
                textAlign: 'left',
                borderTop: '1px solid var(--border-hairline)',
                marginTop: '4px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--accent-subtle)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <FileText size={18} />
              </div>
              <div>
                <strong style={{ fontSize: '0.9rem', display: 'block', color: 'var(--text-primary)' }}>
                  Print Performance Report
                </strong>
                <small style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>
                  Audit certificate & summary
                </small>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Fixed Bottom Tab Bar */}
      <nav className="min-bottom-nav">
        {MAIN_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`min-bottom-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleTabClick(item.id)}
            >
              <Icon size={20} strokeWidth={isActive ? 2.3 : 1.8} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* More Tab */}
        <button
          className={`min-bottom-nav-item ${isMoreActive || moreMenuOpen ? 'active' : ''}`}
          onClick={() => setMoreMenuOpen(!moreMenuOpen)}
        >
          <MoreHorizontal size={20} strokeWidth={isMoreActive || moreMenuOpen ? 2.3 : 1.8} />
          <span>More</span>
        </button>
      </nav>
    </>
  );
};

export default BottomNav;
