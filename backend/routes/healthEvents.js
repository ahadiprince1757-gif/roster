const router = require('express').Router();
const supabase = require('../supabase');

// GET /api/health-events?batch_id=xxx
router.get('/', async (req, res) => {
  const { batch_id } = req.query;
  let query = supabase.from('health_events').select('*').order('date');
  if (batch_id) query = query.eq('batch_id', batch_id);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/health-events
router.post('/', async (req, res) => {
  const { batch_id, name, date, type, method, status, notes } = req.body;

  if (!batch_id) return res.status(400).json({ error: 'batch_id is required' });
  if (!name) return res.status(400).json({ error: 'name is required' });
  if (!date) return res.status(400).json({ error: 'date is required' });

  const { data, error } = await supabase
    .from('health_events')
    .insert([{ batch_id, name, date, type: type || 'Vaccination', method, status: status || 'Pending', notes }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// POST /api/health-events/bulk — insert multiple protocols at once
router.post('/bulk', async (req, res) => {
  const { records } = req.body;
  if (!Array.isArray(records) || records.length === 0)
    return res.status(400).json({ error: 'records array is required' });

  const { data, error } = await supabase
    .from('health_events')
    .insert(records)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PATCH /api/health-events/:id/toggle — toggle Pending/Completed
router.patch('/:id/toggle', async (req, res) => {
  const { id } = req.params;

  // Fetch current status
  const { data: existing, error: fetchErr } = await supabase
    .from('health_events')
    .select('status')
    .eq('id', id)
    .single();

  if (fetchErr) return res.status(404).json({ error: 'Event not found' });

  const newStatus = existing.status === 'Completed' ? 'Pending' : 'Completed';

  const { data, error } = await supabase
    .from('health_events')
    .update({ status: newStatus })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE /api/health-events/:id
router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('health_events').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
