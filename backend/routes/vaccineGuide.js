const router = require('express').Router();
const supabase = require('../supabase');

// GET /api/vaccine-guide — all entries (optionally filtered by flock_type)
router.get('/', async (req, res) => {
  const { flock_type } = req.query;

  let query = supabase.from('vaccine_guide').select('*').order('day_offset');

  if (flock_type) {
    // Supabase array contains operator: flock_types @> '{broiler}'
    query = query.contains('flock_types', [flock_type]);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/vaccine-guide/auto-schedule?flock_type=broiler
router.get('/auto-schedule', async (req, res) => {
  const { flock_type } = req.query;
  if (!flock_type) return res.status(400).json({ error: 'flock_type query param required' });

  const { data, error } = await supabase
    .from('auto_schedule')
    .select('sort_order, vaccine_guide(*)')
    .eq('flock_type', flock_type)
    .order('sort_order');

  if (error) return res.status(500).json({ error: error.message });
  // Unwrap nested relation → flat array
  res.json(data.map((row) => ({ ...row.vaccine_guide, sort_order: row.sort_order })));
});

// GET /api/vaccine-guide/methods — method glossary
router.get('/methods', async (req, res) => {
  const { data, error } = await supabase
    .from('method_glossary')
    .select('*')
    .order('id');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/vaccine-guide/flock-types — flock type definitions
router.get('/flock-types', async (req, res) => {
  const { data, error } = await supabase
    .from('flock_type_defs')
    .select('*')
    .order('id');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;
