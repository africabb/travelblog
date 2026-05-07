import { query } from '../db/client.js';

export default async function feedRoutes(app) {

  // ── GET /api/feed ─────────────────────────────────────────
  // Feed cronológico para la web pública (solo publicado).
  // Query params: limit, offset, date, city, excludeCity (opcionales)
  app.get('/feed', async (req) => {
    const limit  = Math.min(Number(req.query.limit  ?? 20), 100);
    const offset = Number(req.query.offset ?? 0);
    const date   = req.query.date ?? null;           // filtro opcional por fecha
    const city   = req.query.city ?? null;
    const excludeCity = req.query.excludeCity ?? null;

    const filters = [`e.status = 'published'`];
    const params = [limit, offset];

    if (date) {
      params.push(date);
      filters.push(`e.date = $${params.length}`);
    }

    if (city) {
      params.push(city);
      filters.push(`e.city = $${params.length}`);
    }

    if (excludeCity) {
      params.push(excludeCity);
      filters.push(`COALESCE(e.city, '') != $${params.length}`);
    }

    const entries = await query(`
      SELECT
        e.*,
        COALESCE(m.media, '[]') AS media,
        COALESCE(p.places, '[]') AS places
      FROM entries e
      LEFT JOIN LATERAL (
        SELECT json_agg(
          jsonb_build_object(
            'id', media.id, 'url', media.url, 'type', media.type,
            'caption', media.caption, 'sort_order', media.sort_order
          )
          ORDER BY media.sort_order, media.created_at
        ) AS media
        FROM media
        WHERE media.entry_id = e.id
          AND media.status = 'published'
      ) m ON true
      LEFT JOIN LATERAL (
        SELECT json_agg(
          jsonb_build_object(
            'id', places.id, 'name', places.name, 'name_jp', places.name_jp,
            'type', places.type, 'city', places.city,
            'category', places.category, 'rating', places.rating,
            'price_range', places.price_range, 'description', places.description,
            'google_maps_url', places.google_maps_url,
            'official_url', places.official_url
          )
          ORDER BY places.name
        ) AS places
        FROM entry_places ep
        JOIN places ON places.id = ep.place_id
        WHERE ep.entry_id = e.id
      ) p ON true
      WHERE ${filters.join(' AND ')}
      ORDER BY e.date ASC, e.sort_order ASC
      LIMIT $1 OFFSET $2
    `, params);

    const countFilters = [`status = $1`];
    const countArgs = ['published'];

    if (date) {
      countArgs.push(date);
      countFilters.push(`date = $${countArgs.length}`);
    }

    if (city) {
      countArgs.push(city);
      countFilters.push(`city = $${countArgs.length}`);
    }

    if (excludeCity) {
      countArgs.push(excludeCity);
      countFilters.push(`COALESCE(city, '') != $${countArgs.length}`);
    }

    const [{ total }] = await query(
      `SELECT COUNT(*) AS total FROM entries WHERE ${countFilters.join(' AND ')}`,
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
