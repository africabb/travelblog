const express = require('express');
const router  = express.Router();
const db      = require('../db');

const CATEGORIES = ['ramen', 'sushi', 'izakaya', 'street', 'cafe', 'tempura', 'wagyu', 'otro'];

router.get('/', (req, res) => {
  const { category } = req.query;
  const rows = category && category !== 'all'
    ? db.prepare('SELECT * FROM restaurants WHERE category = ? ORDER BY created_at DESC').all(category)
    : db.prepare('SELECT * FROM restaurants ORDER BY created_at DESC').all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM restaurants WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

router.post('/', (req, res) => {
  const { name, location, city, category, rating, description, photo_url, price_range, visited_at } = req.body;

  if (!name) return res.status(400).json({ error: 'name es obligatorio' });

  const cat = CATEGORIES.includes(category) ? category : 'otro';

  const result = db.prepare(`
    INSERT INTO restaurants (name, location, city, category, rating, description, photo_url, price_range, visited_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    name,
    location    || null,
    city        || null,
    cat,
    rating      || 0,
    description || null,
    photo_url   || null,
    price_range || '¥¥',
    visited_at  || new Date().toISOString()
  );

  res.status(201).json(db.prepare('SELECT * FROM restaurants WHERE id = ?').get(result.lastInsertRowid));
});

router.patch('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM restaurants WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });

  const fields = ['name', 'location', 'city', 'category', 'rating', 'description', 'photo_url', 'price_range'];
  const updates = [], values = [];

  fields.forEach(f => {
    if (req.body[f] !== undefined) { updates.push(`${f} = ?`); values.push(req.body[f]); }
  });

  if (!updates.length) return res.status(400).json({ error: 'Nada que actualizar' });
  values.push(req.params.id);
  db.prepare(`UPDATE restaurants SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  res.json(db.prepare('SELECT * FROM restaurants WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM restaurants WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
