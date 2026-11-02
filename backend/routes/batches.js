const router = require('express').Router();
const supabase = require('../supabase');

// GET /api/batches — list all batches
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('batches')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/batches/:id — get single batch with all related data
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const [batch, weights, feeds, health, deaths, finances] = await Promise.all([
    supabase.from('batches').select('*').eq('id', id).single(),
    supabase.from('weights').select('*').eq('batch_id', id).order('date'),
    supabase.from('feeds').select('*').eq('batch_id', id).order('date'),
    supabase.from('health_events').select('*').eq('batch_id', id).order('date'),
    supabase.from('deaths').select('*').eq('batch_id', id).order('date'),
    supabase.from('finances').select('*').eq('batch_id', id).order('date'),
  ]);

  if (batch.error) return res.status(404).json({ error: 'Batch not found' });

  res.json({
    batch: batch.data,
    weights: weights.data || [],
    feeds: feeds.data || [],
    health: health.data || [],
    deaths: deaths.data || [],
    finances: finances.data || [],
  });
});

// POST /api/batches — create a new batch
router.post('/', async (req, res) => {
  const { name, date, birds, breed, supplier, chick_cost, target_age, target_weight, notes } = req.body;

  if (!birds || birds <= 0) return res.status(400).json({ error: 'birds count is required and must be > 0' });

  const { data, error } = await supabase
    .from('batches')
    .insert([{ name, date, birds, breed, supplier, chick_cost, target_age, target_weight, notes }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /api/batches/:id — update batch settings
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  fields.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('batches')
    .update(fields)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE /api/batches/:id — delete batch and all cascaded records
router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('batches').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
