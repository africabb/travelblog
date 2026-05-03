import { query } from '../db/client.js';

export default async function entriesRoutes(app) {

  // ── GET /api/entries ──────────────────────────────────────
  app.get('/', async (req, reply) => {
    const { date, city, status } = req.query;
    const conditions = [];
    const params     = [];

    if (date)   { params.push(date);   conditions.push(`e.date = $${params.length}`); }
    if (city)   { params.push(city);   conditions.push(`e.city ILIKE $${params.length}`); }
    if (status) { params.push(status); conditions.push(`e.status = $${params.length}`); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

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
            'city', p.city, 'category', p.category, 'rating', p.rating
          )) FILTER (WHERE p.id IS NOT NULL),
          '[]'
        ) AS places
      FROM entries e
      LEFT JOIN media       m  ON m.entry_id = e.id
      LEFT JOIN entry_places ep ON ep.entry_id = e.id
      LEFT JOIN places       p  ON p.id = ep.place_id
      ${where}
      GROUP BY e.id
      ORDER BY e.date DESC, e.sort_order ASC, e.created_at DESC
    `, params);

    return rows;
  });

  // ── GET /api/entries/:id ──────────────────────────────────
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
            'id', p.id, 'name', p.name, 'name_jp', p.name_jp,
            'type', p.type, 'city', p.city, 'category', p.category,
            'rating', p.rating, 'description', p.description
          )) FILTER (WHERE p.id IS NOT NULL),
          '[]'
        ) AS places
      FROM entries e
      LEFT JOIN media        m  ON m.entry_id = e.id
      LEFT JOIN entry_places ep ON ep.entry_id = e.id
      LEFT JOIN places       p  ON p.id = ep.place_id
      WHERE e.id = $1
      GROUP BY e.id
    `, [req.params.id]);

    if (!rows.length) return reply.notFound('Entry not found');
    return rows[0];
  });

  // ── POST /api/entries ─────────────────────────────────────
  app.post('/', async (req, reply) => {
    const {
      date, day_number, sort_order = 0,
      title, body,
      location, city, coordinates,
      mood, tags = [],
      status = 'draft', review_notes,
      source_channel, source_message_id, source_timestamp,
    } = req.body;

    if (!date || !title || !body) {
      return reply.badRequest('date, title y body son obligatorios');
    }

    const rows = await query(`
      INSERT INTO entries
        (date, day_number, sort_order, title, body,
         location, city, coordinates,
         mood, tags, status, review_notes,
         source_channel, source_message_id, source_timestamp)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING *
    `, [
      date, day_number ?? null, sort_order,
      title, body,
      location ?? null, city ?? null, coordinates ? JSON.stringify(coordinates) : null,
      mood ?? null, tags, status, review_notes ?? null,
      source_channel ?? null, source_message_id ?? null, source_timestamp ?? null,
    ]);

    return reply.code(201).send(rows[0]);
  });

  // ── PATCH /api/entries/:id ────────────────────────────────
  app.patch('/:id', async (req, reply) => {
    const allowed = [
      'title', 'body', 'location', 'city', 'coordinates',
      'mood', 'tags', 'status', 'review_notes', 'sort_order', 'day_number',
    ];

    const sets   = [];
    const params = [];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        params.push(
          field === 'coordinates' ? JSON.stringify(req.body[field]) : req.body[field]
        );
        sets.push(`${field} = $${params.length}`);
      }
    });

    if (!sets.length) return reply.badRequest('Nada que actualizar');

    params.push(req.params.id);
    const rows = await query(
      `UPDATE entries SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING *`,
      params
    );

    if (!rows.length) return reply.notFound('Entry not found');
    return rows[0];
  });

  // ── DELETE /api/entries/:id ───────────────────────────────
  app.delete('/:id', async (req, reply) => {
    await query('DELETE FROM entries WHERE id = $1', [req.params.id]);
    return { ok: true };
  });
}
