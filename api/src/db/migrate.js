/**
 * Minimal migration runner.
 * Lee todos los archivos .sql de migrations/ en orden alfabético
 * y aplica los que aún no están en _migrations.
 *
 * Uso:  node src/db/migrate.js
 */

import 'dotenv/config';
import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Client } = pg;
const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS = path.join(__dirname, 'migrations');

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  // Ensure tracker table exists (bootstrap)
  await client.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id         SERIAL      PRIMARY KEY,
      filename   TEXT        NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  const applied = new Set(
    (await client.query('SELECT filename FROM _migrations')).rows.map((r) => r.filename)
  );

  const files = fs.readdirSync(MIGRATIONS)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`  skip  ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(MIGRATIONS, file), 'utf8');
    console.log(`  apply ${file}`);

    await client.query('BEGIN');
    try {
      await client.query(sql);
      await client.query('INSERT INTO _migrations (filename) VALUES ($1)', [file]);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`  ERROR in ${file}:`, err.message);
      process.exit(1);
    }
  }

  await client.end();
  console.log('Migrations done.');
}

run();
