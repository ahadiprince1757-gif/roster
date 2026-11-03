require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const supabase = require('./supabase');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet());

// Allow requests from frontend origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4173',
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Rate limiting: 200 requests per 15 minutes per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use(express.json({ limit: '1mb' }));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Rosestar Farm API',
    supabaseConnected: Boolean(supabase),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Guard data routes if Supabase credentials are not configured yet
app.use('/api', (req, res, next) => {
  if (!supabase) {
    return res.status(503).json({
      error: 'Backend Supabase credentials missing. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in backend/.env',
    });
  }
  next();
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/batches',       require('./routes/batches'));
app.use('/api/weights',       require('./routes/weights'));
app.use('/api/feeds',         require('./routes/feeds'));
app.use('/api/health-events', require('./routes/healthEvents'));
app.use('/api/deaths',        require('./routes/deaths'));
app.use('/api/finances',      require('./routes/finances'));
app.use('/api/vaccine-guide', require('./routes/vaccineGuide'));

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Error Handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Rosestar Farm API running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
});
