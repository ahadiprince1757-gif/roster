import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../api/supabaseClient';

const AuthContext = createContext();

const GUEST_STORAGE_KEY = 'rosestar_guest_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      // 1. Check if Supabase client is configured
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            console.warn('[Auth] Error getting initial session:', error.message);
          }
          if (mounted && data?.session) {
            setSession(data.session);
            setUser(data.session.user);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn('[Auth] Unexpected error checking session:', e);
        }

        // Listen for auth state changes (e.g. returning from Google OAuth redirect)
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, newSession) => {
          if (!mounted) return;
          console.log('[Auth] Event:', event);
          setSession(newSession);
          setUser(newSession?.user || null);
          setLoading(false);

          // Clear guest mode if a real session arrives
          if (newSession) {
            localStorage.removeItem(GUEST_STORAGE_KEY);
          }
        });

        // Check for local guest user fallback if no active Supabase session
        const savedGuest = localStorage.getItem(GUEST_STORAGE_KEY);
        if (mounted && savedGuest) {
          try {
            const guest = JSON.parse(savedGuest);
            setUser(guest);
          } catch (e) {
            localStorage.removeItem(GUEST_STORAGE_KEY);
          }
        }

        if (mounted) setLoading(false);

        return () => {
          mounted = false;
          subscription?.unsubscribe();
        };
      } else {
        // Fallback when Supabase is not yet connected
        const savedGuest = localStorage.getItem(GUEST_STORAGE_KEY);
        if (savedGuest) {
          try {
            setUser(JSON.parse(savedGuest));
          } catch (e) {
            localStorage.removeItem(GUEST_STORAGE_KEY);
          }
        }
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  // ── Actions ─────────────────────────────────────────────────────────────────

  const signInWithGoogle = async () => {
    setAuthError(null);
    if (!isSupabaseConfigured || !supabase) {
      const msg = 'Supabase keys missing. Please paste your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY into frontend/.env (see guide below).';
      setAuthError(msg);
      throw new Error(msg);
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      setAuthError(error.message);
      throw error;
    }

    return data;
  };

  const signInWithEmail = async (email, password) => {
    setAuthError(null);
    if (!isSupabaseConfigured || !supabase) {
      const msg = 'Supabase keys missing. Please paste your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY into frontend/.env.';
      setAuthError(msg);
      throw new Error(msg);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
      throw error;
    }

    setUser(data.user);
    setSession(data.session);
    localStorage.removeItem(GUEST_STORAGE_KEY);
    return data;
  };

  const signUpWithEmail = async (email, password, fullName) => {
    setAuthError(null);
    if (!isSupabaseConfigured || !supabase) {
      const msg = 'Supabase keys missing. Please paste your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY into frontend/.env.';
      setAuthError(msg);
      throw new Error(msg);
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setAuthError(error.message);
      throw error;
    }

    if (data.session) {
      setUser(data.user);
      setSession(data.session);
      localStorage.removeItem(GUEST_STORAGE_KEY);
    }

    return data;
  };

  const signOut = async () => {
    setAuthError(null);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('[Auth] Signout error:', e);
      }
    }
    localStorage.removeItem(GUEST_STORAGE_KEY);
    setUser(null);
    setSession(null);
  };

  const signInAsGuest = (guestName = 'Demo Farm Manager') => {
    const guestUser = {
      id: 'demo-guest-user',
      email: 'demo@rosestar.farm',
      user_metadata: {
        full_name: guestName,
        avatar_url: '',
      },
      isGuest: true,
    };
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestUser));
    setUser(guestUser);
    setSession(null);
    setAuthError(null);
    return guestUser;
  };

  const clearError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        authError,
        isConfigured: isSupabaseConfigured,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        signInAsGuest,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
