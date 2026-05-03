const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'diary.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS entries (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    day         INTEGER NOT NULL,
    date        TEXT NOT NULL,
    title       TEXT NOT NULL,
    body        TEXT NOT NULL,
    location    TEXT,
    mood        TEXT,
    tags        TEXT DEFAULT '[]',
    photo_url   TEXT,
    raw_input   TEXT,
    created_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS restaurants (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    location    TEXT,
    city        TEXT,
    category    TEXT,
    rating      REAL DEFAULT 0,
    description TEXT,
    photo_url   TEXT,
    price_range TEXT,
    visited_at  TEXT DEFAULT (datetime('now')),
    created_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS gallery (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    filename    TEXT NOT NULL,
    url         TEXT NOT NULL,
    caption     TEXT,
    location    TEXT,
    taken_at    TEXT DEFAULT (datetime('now')),
    created_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS places (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    name_jp     TEXT,
    city        TEXT,
    days        INTEGER DEFAULT 1,
    description TEXT,
    cover_url   TEXT,
    created_at  TEXT DEFAULT (datetime('now'))
  );
`);

module.exports = db;
