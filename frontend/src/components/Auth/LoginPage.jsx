import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFarm } from '../../context/FarmContext';
import {
  ArrowLeft,
  Sun,
  Moon,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  User,
  LogIn,
} from 'lucide-react';

// Official Google 'G' multi-color SVG icon
const GoogleIcon = ({ size = 18 }) => (
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

const LoginPage = ({ onNavigate, onBack }) => {
  const {
    user,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    signInAsGuest,
    isConfigured,
    authError,
    clearError,
  } = useAuth();
  const { theme, toggleTheme } = useFarm();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfigGuide, setShowConfigGuide] = useState(!isConfigured);

  const handleGoogleSignIn = async () => {
    clearError();
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      // Browser will redirect to Google login consent screen
    } catch (err) {
      console.error('Google sign-in error:', err);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setSuccessMessage('');

    if (!email || !password) return;

    setSubmitting(true);
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
        if (onNavigate) onNavigate('dashboard');
      } else {
        await signUpWithEmail(email, password, fullName);
        setSuccessMessage(
          'Account created! If email confirmation is enabled in your Supabase project, check your inbox.'
        );
      }
    } catch (err) {
      console.error('Email auth error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuestSignIn = () => {
    clearError();
    signInAsGuest();
    if (onNavigate) onNavigate('dashboard');
  };

  const handleSignOut = async () => {
    await signOut();
    setSuccessMessage('Successfully signed out.');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-app)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Top Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-hairline)',
        }}
      >
        <button
          onClick={() => (onBack ? onBack() : onNavigate ? onNavigate('dashboard') : null)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            cursor: 'pointer',
            padding: '6px 10px',
            borderRadius: 'var(--radius-sm)',
            transition: 'color 0.15s ease',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={theme === 'dark' ? '/logo-white.png' : '/logo.png'}
            alt="Rosestar Logo"
            style={{ width: '22px', height: '22px', objectFit: 'contain' }}
          />
          <span style={{ fontWeight: 600, fontSize: '0.95rem', letterSpacing: '-0.02em' }}>
            Rosestar
          </span>
        </div>

        <button
          className="min-btn-icon"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          style={{ width: '34px', height: '34px' }}
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </header>

      {/* Main Login Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px 48px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-hairline)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-float)',
            padding: '36px 32px',
          }}
        >
          {/* If already signed in */}
          {user ? (
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--accent-subtle)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '1.4rem',
                  fontWeight: 600,
                  overflow: 'hidden',
                }}
              >
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.email}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  (user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()
                )}
              </div>

              <h2 style={{ fontSize: '1.35rem', marginBottom: '6px' }}>
                Welcome back{user.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '24px' }}>
                Signed in as <strong style={{ color: 'var(--text-primary)' }}>{user.email}</strong>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  className="apple-btn-main"
                  style={{ width: '100%', padding: '12px' }}
                  onClick={() => onNavigate && onNavigate('dashboard')}
                >
                  Enter Farm Operations →
                </button>
                <button
                  className="apple-btn-sub"
                  style={{ width: '100%', padding: '12px' }}
                  onClick={handleSignOut}
                >
                  Sign Out of Rosestar
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Brand Header */}
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'var(--bg-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 14px',
                    border: '1px solid var(--border-hairline)',
                  }}
                >
                  <img
                    src={theme === 'dark' ? '/logo-white.png' : '/logo.png'}
                    alt="Rosestar"
                    style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                  />
                </div>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '6px' }}>
                  {mode === 'signin' ? 'Sign in to Rosestar' : 'Create your account'}
                </h1>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Poultry farming intelligence & flock operations
                </p>
              </div>

              {/* Error Alert */}
              {authError && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#ef4444',
                    fontSize: '0.83rem',
                    marginBottom: '18px',
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>{authError}</div>
                </div>
              )}

              {/* Success Alert */}
              {successMessage && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.25)',
                    color: 'var(--accent)',
                    fontSize: '0.83rem',
                    marginBottom: '18px',
                  }}
                >
                  <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>{successMessage}</div>
                </div>
              )}

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-hairline)',
                  color: 'var(--text-primary)',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  cursor: googleLoading ? 'wait' : 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: 'var(--shadow-subtle)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'var(--bg-subtle)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-hairline)';
                  e.currentTarget.style.background = 'var(--bg-surface)';
                }}
              >
                {googleLoading ? (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Connecting to Google...
                  </span>
                ) : (
                  <>
                    <GoogleIcon size={19} />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '22px 0',
                  color: 'var(--text-tertiary)',
                  fontSize: '0.76rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                <div style={{ flex: 1, height: '1px', background: 'var(--border-hairline)' }} />
                <span style={{ padding: '0 12px' }}>or with email</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-hairline)' }} />
              </div>

              {/* Email & Password Form */}
              <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {mode === 'signup' && (
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        marginBottom: '6px',
                      }}
                    >
                      Full Name / Farm Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Kamau"
                      required
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-hairline)',
                        background: 'var(--bg-subtle)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                )}

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      marginBottom: '6px',
                    }}
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@farm.com"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-hairline)',
                      background: 'var(--bg-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '6px',
                    }}
                  >
                    <label
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      Password
                    </label>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      style={{
                        width: '100%',
                        padding: '10px 42px 10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-hairline)',
                        background: 'var(--bg-subtle)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-tertiary)',
                        padding: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="apple-btn-main"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    marginTop: '6px',
                  }}
                >
                  {submitting
                    ? 'Processing...'
                    : mode === 'signin'
                    ? 'Sign In'
                    : 'Create Account'}
                </button>
              </form>

              {/* Mode Toggle */}
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '18px',
                  fontSize: '0.84rem',
                  color: 'var(--text-secondary)',
                }}
              >
                {mode === 'signin' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        clearError();
                      }}
                      style={{
                        color: 'var(--accent)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        clearError();
                      }}
                      style={{
                        color: 'var(--accent)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>

              {/* Quick Guest Exploration Button */}
              <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-hairline)', paddingTop: '18px' }}>
                <button
                  type="button"
                  onClick={handleGuestSignIn}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-subtle)',
                    border: '1px dashed var(--border-hairline)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  <Sparkles size={14} style={{ color: 'var(--accent)' }} />
                  <span>Explore in Guest / Demo Mode</span>
                </button>
              </div>

              {/* Diagnostic / Help Info Box if Supabase env vars not found */}
              {!isConfigured && (
                <div
                  style={{
                    marginTop: '18px',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-hairline)',
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                    onClick={() => setShowConfigGuide(!showConfigGuide)}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      <HelpCircle size={14} />
                      Supabase Setup Guide
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--accent)' }}>
                      {showConfigGuide ? 'Hide' : 'Show details'}
                    </span>
                  </div>

                  {showConfigGuide && (
                    <div style={{ marginTop: '8px' }}>
                      <p style={{ marginBottom: '6px' }}>
                        To connect Google OAuth live, add your Supabase keys to <code style={{ color: 'var(--accent-text)', background: 'var(--accent-subtle)', padding: '2px 4px', borderRadius: '4px' }}>frontend/.env</code>:
                      </p>
                      <pre
                        style={{
                          background: 'var(--bg-app)',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          overflowX: 'auto',
                          fontSize: '0.74rem',
                          color: 'var(--text-primary)',
                        }}
                      >
{`VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-public-key>`}
                      </pre>
                      <p style={{ marginTop: '6px', fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                        Find these in Supabase Dashboard → Project Settings → API.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
