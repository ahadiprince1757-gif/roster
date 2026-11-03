const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

let supabase = null;

if (!supabaseUrl || !supabaseKey) {
  console.warn('[Warn] SUPABASE_URL or SUPABASE_SERVICE_KEY missing in backend/.env. Database routes will return 503 until configured.');
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.error('[Error] Failed to initialize Supabase client:', err.message);
  }
}

module.exports = supabase;

