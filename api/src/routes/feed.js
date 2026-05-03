import { query } from '../db/client.js';

export default async function feedRoutes(app) {

  // ── GET /api/feed ─────────────────────────────────────────
  // Feed cronológico para la web pública (solo publicado).
  // Query params: limit, offset, date (YYYY-MM-DD, opcional)
  app.get('/', async (req) => {
    const limit  = Math.min(Number(req.query.limit  ?? 20), 100);
    const offset = Number(req.query.offset ?? 0);
    const date   = req.query.date ?? null;           // filtro opcional por fecha

    const dateClause = date ? 'AND e.date = $3' : '';
    const params     = date ? [limit, offset, date] : [limit, offset];

    const entries = await query(`
      SELECT
        e.*,
        COALESCE(
          json_agg(
            jsonb_build_object(
              'id', m.id, 'url', m.url, 'type', m.type,
              'caption', m.caption, 'sort_order', m.sort_order
            )
            ORDER BY m.sort_order, m.created_at
          ) FILTER (WHERE m.id IS NOT NULL AND m.status = 'published'),
          '[]'
        ) AS media,
        COALESCE(
          json_agg(DISTINCT jsonb_build_object(
            'id', p.id, 'name', p.name, 'name_jp', p.name_jp,
            'type', p.type, 'city', p.city,
            'category', p.category, 'rating', p.rating,
            'price_range', p.price_range, 'description', p.description,
            'google_maps_url', p.google_maps_url,
            'official_url', p.official_url
          )) FILTER (WHERE p.id IS NOT NULL),
          '[]'
        ) AS places
      FROM entries e
      LEFT JOIN media        m  ON m.entry_id = e.id
      LEFT JOIN entry_places ep ON ep.entry_id = e.id
      LEFT JOIN places       p  ON p.id = ep.place_id
      WHERE e.status = 'published' ${dateClause}
      GROUP BY e.id
      ORDER BY e.date ASC, e.sort_order ASC
      LIMIT $1 OFFSET $2
    `, params);

    const countParams = date ? [date] : [];
    const countWhere  = date ? 'WHERE status = $1 AND date = $2'
                             : 'WHERE status = $1';
    const countArgs   = date ? ['published', date] : ['published'];
    const [{ total }] = await query(
      `SELECT COUNT(*) AS total FROM entries ${countWhere}`,
      countArgs,
    );

    return { entries, total: Number(total), limit, offset };
  });

  // ── GET /api/stats ────────────────────────────────────────
  app.get('/stats', async () => {
    const [r] = await query(`
      SELECT
        (SELECT COUNT(DISTINCT date)  FROM entries WHERE status = 'published') AS days,
        (SELECT COUNT(*)              FROM entries WHERE status = 'published') AS entries,
        (SELECT COUNT(*)              FROM places)                             AS places,
        (SELECT COUNT(*)              FROM media   WHERE status = 'published'
                                          AND type = 'photo')                 AS photos,
        (SELECT COUNT(*)              FROM entries WHERE status = 'draft')    AS pending_drafts
    `);
    return {
      days:          Number(r.days),
      entries:       Number(r.entries),
      places:        Number(r.places),
      photos:        Number(r.photos),
      pending_drafts: Number(r.pending_drafts),
    };
  });
}
