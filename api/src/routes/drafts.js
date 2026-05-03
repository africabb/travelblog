import { query, transaction } from '../db/client.js';

export default async function draftsRoutes(app) {

  // ── GET /api/drafts  ──────────────────────────────────────
  // Devuelve entries con status=draft, con su media asociada.
  app.get('/', async (req) => {
    const { date, city } = req.query;
    const conditions = [`e.status = 'draft'`];
    const params     = [];

    if (date) { params.push(date); conditions.push(`e.date = $${params.length}`); }
    if (city) { params.push(city); conditions.push(`e.city ILIKE $${params.length}`); }

    const where = `WHERE ${conditions.join(' AND ')}`;

    return query(`
      SELECT
        e.*,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id', m.id, 'url', m.url, 'type', m.type, 'caption', m.caption
          )) FILTER (WHERE m.id IS NOT NULL),
          '[]'
        ) AS media
      FROM entries e
      LEFT JOIN media m ON m.entry_id = e.id
      ${where}
      GROUP BY e.id
      ORDER BY e.date DESC, e.sort_order ASC
    `, params);
  });

  // ── GET /api/drafts/:id ───────────────────────────────────
  app.get('/:id', async (req, reply) => {
    const rows = await query(`
      SELECT
        e.*,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id', m.id, 'url', m.url, 'type', m.type,
            'caption', m.caption, 'sort_order', m.sort_order
          )) FILTER (WHERE m.id IS NOT NULL),
          '[]'
        ) AS media,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id', p.id, 'name', p.name, 'type', p.type,
            'city', p.city, 'category', p.category
          )) FILTER (WHERE p.id IS NOT NULL),
          '[]'
        ) AS places
      FROM entries e
      LEFT JOIN media        m  ON m.entry_id = e.id
      LEFT JOIN entry_places ep ON ep.entry_id = e.id
      LEFT JOIN places       p  ON p.id = ep.place_id
      WHERE e.id = $1 AND e.status = 'draft'
      GROUP BY e.id
    `, [req.params.id]);

    if (!rows.length) return reply.notFound('Draft not found');
    return rows[0];
  });

  // ── PATCH /api/drafts/:id ─────────────────────────────────
  app.patch('/:id', async (req, reply) => {
    const allowed = ['title', 'body', 'location', 'city', 'mood', 'tags', 'review_notes', 'sort_order'];
    const sets    = [];
    const params  = [];

    allowed.forEach((f) => {
      if (req.body[f] !== undefined) { params.push(req.body[f]); sets.push(`${f} = $${params.length}`); }
    });

    if (!sets.length) return reply.badRequest('Nada que actualizar');

    params.push(req.params.id);
    const rows = await query(
      `UPDATE entries SET ${sets.join(', ')} WHERE id = $${params.length} AND status = 'draft' RETURNING *`,
      params
    );

    if (!rows.length) return reply.notFound('Draft not found');
    return rows[0];
  });

  // ── PATCH /api/drafts/:id/approve ────────────────────────
  app.patch('/:id/approve', async (req, reply) => {
    const { review_notes } = req.body ?? {};
    const params = review_notes
      ? [review_notes, req.params.id]
      : [req.params.id];

    const sql = review_notes
      ? `UPDATE entries SET status = 'approved', review_notes = $1 WHERE id = $2 AND status = 'draft' RETURNING *`
      : `UPDATE entries SET status = 'approved' WHERE id = $1 AND status = 'draft' RETURNING *`;

    const rows = await query(sql, params);
    if (!rows.length) return reply.notFound('Draft not found');
    return rows[0];
  });

  // ── PATCH /api/drafts/:id/publish ────────────────────────
  app.patch('/:id/publish', async (req, reply) => {
    const rows = await query(`
      UPDATE entries
      SET status = 'published'
      WHERE id = $1 AND status IN ('draft', 'approved')
      RETURNING *
    `, [req.params.id]);

    if (!rows.length) return reply.notFound('Draft not found or already published');

    // Publish associated media too
    await query(
      `UPDATE media SET status = 'published' WHERE entry_id = $1 AND status != 'published'`,
      [req.params.id]
    );

    return rows[0];
  });

  // ── DELETE /api/drafts/:id ────────────────────────────────
  app.delete('/:id', async (req, reply) => {
    const rows = await query(
      `DELETE FROM entries WHERE id = $1 AND status = 'draft' RETURNING id`,
      [req.params.id]
    );
    if (!rows.length) return reply.notFound('Draft not found');
    return { ok: true };
  });
}
