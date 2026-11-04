import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://wleyoepejqawqmwlgifi.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsZXlvZXBlanFhd3Ftd2xnaWZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2MTc3MzgsImV4cCI6MjEwOTE5MzczOH0.bZbT2LAQmS-5Pt_hILuQMXth6LuNZHTYu4I7yqz56IA';

const isValid = (v) =>
  Boolean(
    v &&
      typeof v === 'string' &&
      v.trim() !== '' &&
      v !== 'undefined' &&
      v !== 'null' &&
      !v.includes('your-project') &&
      !v.includes('your-anon-key')
  );

const rawUrl = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_SUPABASE_URL : null;
const rawKey = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_SUPABASE_ANON_KEY : null;

const supabaseUrl = isValid(rawUrl) ? rawUrl : DEFAULT_URL;
const supabaseAnonKey = isValid(rawKey) ? rawKey : DEFAULT_KEY;

export const isSupabaseConfigured = isValid(supabaseUrl) && isValid(supabaseAnonKey);

/**
 * Shared Supabase client instance.
 * Automatically configured with project credentials.
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
