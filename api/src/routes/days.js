import { query } from '../db/client.js';

export default async function daysRoutes(app) {

  // ── GET /api/days  ────────────────────────────────────────
  // Lista de fechas con actividad (cualquier status).
  app.get('/', async () => {
    return query(`
      SELECT
        e.date,
        MIN(e.day_number)                       AS day_number,
        COUNT(DISTINCT e.id)                    AS entry_count,
        COUNT(DISTINCT m.id)                    AS media_count,
        bool_or(e.status = 'published')         AS has_published,
        bool_or(e.status = 'draft')             AS has_drafts,
        MIN(e.city)                             AS city
      FROM entries e
      LEFT JOIN media m ON m.entry_id = e.id
      GROUP BY e.date
      ORDER BY e.date DESC
    `);
  });

  // ── GET /api/days/:date ───────────────────────────────────
  // Todo el día: entries (con media) + places visitados ese día.
  app.get('/:date', async (req, reply) => {
    const { date } = req.params;

    const entries = await query(`
      SELECT
        e.*,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id', m.id, 'url', m.url, 'type', m.type,
            'caption', m.caption, 'sort_order', m.sort_order
          )) FILTER (WHERE m.id IS NOT NULL),
          '[]'
        ) AS media
      FROM entries e
      LEFT JOIN media m ON m.entry_id = e.id
      WHERE e.date = $1
      GROUP BY e.id
      ORDER BY e.sort_order ASC, e.created_at ASC
    `, [date]);

    if (!entries.length) return reply.notFound('No hay entradas para ese día');

    const places = await query(`
      SELECT DISTINCT p.*
      FROM places p
      JOIN entry_places ep ON ep.place_id = p.id
      JOIN entries e       ON e.id = ep.entry_id
      WHERE e.date = $1
    `, [date]);

    return { date, entries, places };
  });

  // ── POST /api/days/:date/publish ──────────────────────────
  // Publica todas las entries y media aprobadas/draft del día.
  app.post('/:date/publish', async (req, reply) => {
    const { date } = req.params;

    const updated = await query(`
      UPDATE entries
      SET status = 'published'
      WHERE date = $1 AND status IN ('draft', 'approved')
      RETURNING id
    `, [date]);

    if (!updated.length) {
      return reply.badRequest('No hay entradas en draft/approved para publicar en ese día');
    }

    const ids = updated.map((r) => r.id);
    await query(
      `UPDATE media SET status = 'published'
       WHERE entry_id = ANY($1::uuid[]) AND status != 'published'`,
      [ids]
    );

    return { ok: true, published_entries: ids.length };
  });
}
