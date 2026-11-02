const router = require('express').Router();
const supabase = require('../supabase');

// GET /api/deaths?batch_id=xxx
router.get('/', async (req, res) => {
  const { batch_id } = req.query;
  let query = supabase.from('deaths').select('*').order('date');
  if (batch_id) query = query.eq('batch_id', batch_id);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/deaths
router.post('/', async (req, res) => {
  const { batch_id, date, qty, cause } = req.body;

  if (!batch_id) return res.status(400).json({ error: 'batch_id is required' });
  if (!date) return res.status(400).json({ error: 'date is required' });
  if (!qty || qty <= 0) return res.status(400).json({ error: 'qty must be > 0' });

  const { data, error } = await supabase
    .from('deaths')
    .insert([{ batch_id, date, qty, cause: cause || 'Unspecified' }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// DELETE /api/deaths/:id
router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('deaths').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
