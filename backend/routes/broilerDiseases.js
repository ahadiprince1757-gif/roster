const router = require('express').Router();
const supabase = require('../supabase');

/**
 * GET /api/broiler-diseases
 * Optional query params:
 *   - category: 'Viral' | 'Bacterial' | 'Parasitic' | 'Protozoal' | 'Fungal' | 'Nutritional' | 'Environmental'
 *   - severity: 'Critical' | 'High' | 'Moderate' | 'Low'
 *   - emergency: 'true' | 'false'
 *   - search: text query searching name, symptoms, broiler_signs, keywords
 */
router.get('/', async (req, res) => {
  const { category, severity, emergency, search } = req.query;

  let query = supabase
    .from('broiler_diseases')
    .select('*')
    .order('severity_score', { ascending: false })
    .order('name');

  if (category && category !== 'All') {
    query = query.eq('category', category);
  }

  if (severity && severity !== 'All') {
    query = query.eq('severity', severity);
  }

  if (emergency !== undefined && emergency !== '') {
    query = query.eq('emergency', emergency === 'true');
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });

  if (!search || !search.trim()) {
    return res.json(data);
  }

  // In-memory flexible fuzzy match across array fields & name
  const q = search.toLowerCase().trim();
  const filtered = data.filter((d) => {
    const haystack = [
      d.name,
      d.category,
      ...(d.symptoms || []),
      ...(d.broiler_signs || []),
      ...(d.keywords || []),
    ].join(' ').toLowerCase();
    return haystack.includes(q);
  });

  res.json(filtered);
});

/**
 * GET /api/broiler-diseases/:id
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('broiler_diseases')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return res.status(error.code === 'PGRST116' ? 404 : 500).json({ error: error.message });
  res.json(data);
});

/**
 * GET /api/broiler-diseases/meta/categories
 */
router.get('/meta/categories', async (req, res) => {
  const { data, error } = await supabase
    .from('broiler_diseases')
    .select('category');

  if (error) return res.status(500).json({ error: error.message });
  const unique = Array.from(new Set(data.map((r) => r.category))).filter(Boolean);
  res.json(unique);
});

module.exports = router;
