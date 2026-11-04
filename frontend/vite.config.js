import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const defaultUrl = 'https://wleyoepejqawqmwlgifi.supabase.co'
  const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsZXlvZXBlanFhd3Ftd2xnaWZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM2MTc3MzgsImV4cCI6MjEwOTE5MzczOH0.bZbT2LAQmS-5Pt_hILuQMXth6LuNZHTYu4I7yqz56IA'

  const isValid = (v) =>
    Boolean(
      v &&
        typeof v === 'string' &&
        v.trim() !== '' &&
        v !== 'undefined' &&
        v !== 'null' &&
        !v.includes('your-project') &&
        !v.includes('your-anon-key')
    )

  const candidateUrl =
    env.VITE_SUPABASE_URL ||
    env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL

  const candidateKey =
    env.VITE_SUPABASE_ANON_KEY ||
    env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY

  const supabaseUrl = isValid(candidateUrl) ? candidateUrl : defaultUrl
  const supabaseAnonKey = isValid(candidateKey) ? candidateKey : defaultKey

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
    },
  }
})
