import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on('error', (err) => {
  console.error('[db] Unexpected pool error:', err.message);
});

/**
 * Run a single query. Returns rows array.
 * @param {string} text
 * @param {any[]}  params
 */
export async function query(text, params) {
  const result = await pool.query(text, params);
  return result.rows;
}

/**
 * Run multiple queries inside a transaction.
 * @param {(q: typeof query) => Promise<T>} fn
 */
export async function transaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn((text, params) =>
      client.query(text, params).then((r) => r.rows)
    );
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export default pool;
