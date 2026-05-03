const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const db       = require('./db');

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve uploaded photos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ─────────────────────────────────────────────────
app.use('/api/entries',     require('./routes/entries'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/gallery',     require('./routes/gallery'));

// Stats endpoint
app.get('/api/stats', (req, res) => {
  const days        = db.prepare('SELECT COUNT(DISTINCT date) as c FROM entries').get().c;
  const places      = db.prepare('SELECT COUNT(*) as c FROM places').get().c;
  const restaurants = db.prepare('SELECT COUNT(*) as c FROM restaurants').get().c;
  const photos      = db.prepare('SELECT COUNT(*) as c FROM gallery').get().c;
  res.json({ days, places, restaurants, photos });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// ─── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Diario API corriendo en http://localhost:${PORT}`);
});
