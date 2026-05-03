const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET all entries (newest first)
router.get('/', (req, res) => {
  const entries = db.prepare(`
    SELECT * FROM entries ORDER BY date DESC, id DESC
  `).all();

  entries.forEach(e => { e.tags = JSON.parse(e.tags || '[]'); });
  res.json(entries);
});

// GET single entry
router.get('/:id', (req, res) => {
  const entry = db.prepare('SELECT * FROM entries WHERE id = ?').get(req.params.id);
  if (!entry) return res.status(404).json({ error: 'Not found' });
  entry.tags = JSON.parse(entry.tags || '[]');
  res.json(entry);
});

// POST create entry
router.post('/', (req, res) => {
  const { day, date, title, body, location, mood, tags, photo_url, raw_input } = req.body;

  if (!title || !body || !date) {
    return res.status(400).json({ error: 'title, body y date son obligatorios' });
  }

  const dayNum = day ?? (db.prepare('SELECT COUNT(*) as c FROM entries').get().c + 1);

  const result = db.prepare(`
    INSERT INTO entries (day, date, title, body, location, mood, tags, photo_url, raw_input)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    dayNum,
    date,
    title,
    body,
    location || null,
    mood    || null,
    JSON.stringify(tags || []),
    photo_url || null,
    raw_input || null
  );

  const entry = db.prepare('SELECT * FROM entries WHERE id = ?').get(result.lastInsertRowid);
  entry.tags = JSON.parse(entry.tags);
  res.status(201).json(entry);
});

// PATCH update entry
router.patch('/:id', (req, res) => {
  const entry = db.prepare('SELECT * FROM entries WHERE id = ?').get(req.params.id);
  if (!entry) return res.status(404).json({ error: 'Not found' });

  const fields = ['title', 'body', 'location', 'mood', 'photo_url'];
  const updates = [];
  const values  = [];

  fields.forEach(f => {
    if (req.body[f] !== undefined) {
      updates.push(`${f} = ?`);
      values.push(req.body[f]);
    }
  });

  if (req.body.tags) {
    updates.push('tags = ?');
    values.push(JSON.stringify(req.body.tags));
  }

  if (!updates.length) return res.status(400).json({ error: 'Nada que actualizar' });

  values.push(req.params.id);
  db.prepare(`UPDATE entries SET ${updates.join(', ')} WHERE id = ?`).run(...values);

  const updated = db.prepare('SELECT * FROM entries WHERE id = ?').get(req.params.id);
  updated.tags = JSON.parse(updated.tags);
  res.json(updated);
});

// DELETE
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM entries WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
