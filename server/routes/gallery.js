const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const db      = require('../db');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname) || '.jpg';
    const name = `photo_${Date.now()}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    cb(null, file.mimetype.startsWith('image/'));
  },
});

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM gallery ORDER BY taken_at DESC').all();
  res.json(rows);
});

// Upload photo file
router.post('/upload', upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió imagen' });

  const url = `/uploads/${req.file.filename}`;
  const { caption, location, taken_at } = req.body;

  const result = db.prepare(`
    INSERT INTO gallery (filename, url, caption, location, taken_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    req.file.filename,
    url,
    caption   || null,
    location  || null,
    taken_at  || new Date().toISOString()
  );

  res.status(201).json(db.prepare('SELECT * FROM gallery WHERE id = ?').get(result.lastInsertRowid));
});

// Register photo from external URL (e.g., WhatsApp media URL already downloaded)
router.post('/', (req, res) => {
  const { filename, url, caption, location, taken_at } = req.body;

  if (!url) return res.status(400).json({ error: 'url es obligatorio' });

  const result = db.prepare(`
    INSERT INTO gallery (filename, url, caption, location, taken_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    filename  || path.basename(url),
    url,
    caption   || null,
    location  || null,
    taken_at  || new Date().toISOString()
  );

  res.status(201).json(db.prepare('SELECT * FROM gallery WHERE id = ?').get(result.lastInsertRowid));
});

router.delete('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM gallery WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });

  const filePath = path.join(UPLOADS_DIR, row.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  db.prepare('DELETE FROM gallery WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
