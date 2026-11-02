const router = require('express').Router();
const supabase = require('../supabase');

// GET /api/weights?batch_id=xxx
router.get('/', async (req, res) => {
  const { batch_id } = req.query;
  let query = supabase.from('weights').select('*').order('date');
  if (batch_id) query = query.eq('batch_id', batch_id);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/weights
router.post('/', async (req, res) => {
  const { batch_id, date, sample, avg, min, max, notes } = req.body;

  if (!batch_id) return res.status(400).json({ error: 'batch_id is required' });
  if (!date) return res.status(400).json({ error: 'date is required' });
  if (!avg || avg <= 0) return res.status(400).json({ error: 'avg weight is required' });

  const { data, error } = await supabase
    .from('weights')
    .insert([{ batch_id, date, sample: sample || 50, avg, min: min || avg, max: max || avg, notes }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// DELETE /api/weights/:id
router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('weights').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
