const router = require('express').Router();
const supabase = require('../supabase');

// GET /api/feeds?batch_id=xxx
router.get('/', async (req, res) => {
  const { batch_id } = req.query;
  let query = supabase.from('feeds').select('*').order('date');
  if (batch_id) query = query.eq('batch_id', batch_id);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/feeds
router.post('/', async (req, res) => {
  const { batch_id, date, type, category, qty, cost, notes } = req.body;

  if (!batch_id) return res.status(400).json({ error: 'batch_id is required' });
  if (!date) return res.status(400).json({ error: 'date is required' });
  if (!type || !['purchase', 'consumption'].includes(type))
    return res.status(400).json({ error: 'type must be purchase or consumption' });
  if (!qty || qty <= 0) return res.status(400).json({ error: 'qty must be > 0' });

  const { data, error } = await supabase
    .from('feeds')
    .insert([{
      batch_id,
      date,
      type,
      category: category || 'Starter',
      qty,
      cost: type === 'purchase' ? (cost || 0) : 0,
      notes,
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// DELETE /api/feeds/:id
router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('feeds').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
