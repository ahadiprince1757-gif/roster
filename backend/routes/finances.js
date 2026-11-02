const router = require('express').Router();
const supabase = require('../supabase');

// GET /api/finances?batch_id=<uuid>
router.get('/', async (req, res) => {
  const { batch_id } = req.query;
  if (!batch_id) return res.status(400).json({ error: 'batch_id query param is required' });

  const { data, error } = await supabase
    .from('finances')
    .select('*')
    .eq('batch_id', batch_id)
    .order('date', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/finances/summary?batch_id=<uuid>
router.get('/summary', async (req, res) => {
  const { batch_id } = req.query;
  if (!batch_id) return res.status(400).json({ error: 'batch_id query param is required' });

  const { data, error } = await supabase
    .from('finances')
    .select('type, amount, qty, weight')
    .eq('batch_id', batch_id);

  if (error) return res.status(500).json({ error: error.message });

  const summary = data.reduce(
    (acc, row) => {
      if (row.type === 'Sale') {
        acc.totalRevenue += Number(row.amount) || 0;
        acc.totalBirdsSold += Number(row.qty) || 0;
        acc.totalWeightSold += Number(row.weight) || 0;
      } else {
        acc.totalExpenses += Number(row.amount) || 0;
      }
      return acc;
    },
    { totalRevenue: 0, totalExpenses: 0, totalBirdsSold: 0, totalWeightSold: 0 }
  );

  summary.netProfit = summary.totalRevenue - summary.totalExpenses;
  res.json(summary);
});

// POST /api/finances — add an expense or sale record
router.post('/', async (req, res) => {
  const { batch_id, date, type, description, amount, qty, weight } = req.body;

  if (!batch_id) return res.status(400).json({ error: 'batch_id is required' });
  if (!type || !['Expense', 'Sale'].includes(type))
    return res.status(400).json({ error: 'type must be "Expense" or "Sale"' });
  if (!amount || Number(amount) <= 0)
    return res.status(400).json({ error: 'amount must be a positive number' });

  const { data, error } = await supabase
    .from('finances')
    .insert([{
      batch_id,
      date: date || new Date().toISOString().split('T')[0],
      type,
      description: description || '',
      amount: Number(amount),
      qty: qty ? Number(qty) : null,
      weight: weight ? Number(weight) : null,
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// DELETE /api/finances/:id
router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('finances')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
