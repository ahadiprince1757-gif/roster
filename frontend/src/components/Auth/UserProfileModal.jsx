import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFarm } from '../../context/FarmContext';
import {
  X,
  LogOut,
  Mail,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const GoogleIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.55 10.78l7.98-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

const UserProfileModal = ({ isOpen, onClose, onOpenLogin }) => {
  const { user, signOut } = useAuth();
  const { farmData } = useFarm();

  if (!isOpen) return null;

  const isGoogle = user?.app_metadata?.provider === 'google' || user?.identities?.[0]?.provider === 'google';
  const name = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Farm Manager';
  const avatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  return (
    <div className="min-modal-overlay" onClick={onClose} style={{ zIndex: 110 }}>
      <div
        className="min-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '400px' }}
      >
        {/* Header */}
        <div className="min-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 600, fontSize: '0.98rem' }}>Farmer Account</span>
          </div>
          <button className="min-btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {user ? (
            <>
              {/* Profile Card */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-hairline)',
                }}
              >
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: 'var(--accent-subtle)',
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  {avatar ? (
                    <img src={avatar} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    name[0].toUpperCase()
                  )}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <strong style={{ fontSize: '1rem', color: 'var(--text-primary)', truncate: true }}>
                      {name}
                    </strong>
                    {isGoogle && <GoogleIcon size={14} />}
                  </div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user.email}
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        background: user.isGuest ? 'rgba(234, 179, 8, 0.15)' : 'var(--accent-subtle)',
                        color: user.isGuest ? '#ca8a04' : 'var(--accent-text)',
                      }}
                    >
                      {user.isGuest ? 'Guest Demo Mode' : isGoogle ? 'Google Authenticated' : 'Verified Member'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Flock context info */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  fontSize: '0.8rem',
                }}
              >
                <div
                  style={{
                    padding: '12px',
                    background: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-hairline)',
                  }}
                >
                  <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '0.72rem' }}>
                    Active Batch
                  </span>
                  <strong style={{ color: 'var(--text-primary)' }}>
                    {farmData?.batch?.name || 'My Broiler Batch'}
                  </strong>
                </div>
                <div
                  style={{
                    padding: '12px',
                    background: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-hairline)',
                  }}
                >
                  <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '0.72rem' }}>
                    Flock Count
                  </span>
                  <strong style={{ color: 'var(--text-primary)' }}>
                    {farmData?.batch?.birds ? `${farmData.batch.birds.toLocaleString()} birds` : '0 birds'}
                  </strong>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                <button
                  onClick={handleSignOut}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '11px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'transparent',
                    border: '1px solid var(--border-hairline)',
                    color: '#ef4444',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                You are currently in anonymous offline mode. Sign in to synchronize your flock data across devices.
              </p>
              <button
                className="apple-btn-main"
                style={{ width: '100%', padding: '12px' }}
                onClick={() => {
                  onClose();
                  if (onOpenLogin) onOpenLogin();
                }}
              >
                Sign In with Google →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
