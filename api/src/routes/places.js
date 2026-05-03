import { query } from '../db/client.js';

export default async function placesRoutes(app) {

  // ── GET /api/places ───────────────────────────────────────
  app.get('/', async (req) => {
    const { type, city } = req.query;
    const conditions = [];
    const params     = [];

    if (type) { params.push(type); conditions.push(`type = $${params.length}`); }
    if (city) { params.push(city); conditions.push(`city ILIKE $${params.length}`); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    return query(
      `SELECT * FROM places ${where} ORDER BY visited_at DESC NULLS LAST, created_at DESC`,
      params
    );
  });

  // ── GET /api/places/:id ───────────────────────────────────
  app.get('/:id', async (req, reply) => {
    const rows = await query('SELECT * FROM places WHERE id = $1', [req.params.id]);
    if (!rows.length) return reply.notFound('Place not found');
    return rows[0];
  });

  // ── POST /api/places ──────────────────────────────────────
  app.post('/', async (req, reply) => {
    const {
      name, name_jp, type = 'other',
      city, address, coordinates,
      category, rating, price_range,
      description, cover_media_id, visited_at,
    } = req.body;

    if (!name) return reply.badRequest('name es obligatorio');

    const rows = await query(`
      INSERT INTO places
        (name, name_jp, type, city, address, coordinates,
         category, rating, price_range, description, cover_media_id, visited_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *
    `, [
      name, name_jp ?? null, type,
      city ?? null, address ?? null,
      coordinates ? JSON.stringify(coordinates) : null,
      category ?? null, rating ?? null, price_range ?? null,
      description ?? null, cover_media_id ?? null,
      visited_at ?? null,
    ]);

    return reply.code(201).send(rows[0]);
  });

  // ── PATCH /api/places/:id ─────────────────────────────────
  app.patch('/:id', async (req, reply) => {
    const allowed = [
      'name', 'name_jp', 'type', 'city', 'address',
      'category', 'rating', 'price_range', 'description',
      'cover_media_id', 'visited_at',
    ];

    const sets   = [];
    const params = [];

    allowed.forEach((f) => {
      if (req.body[f] !== undefined) { params.push(req.body[f]); sets.push(`${f} = $${params.length}`); }
    });

    if (req.body.coordinates !== undefined) {
      params.push(JSON.stringify(req.body.coordinates));
      sets.push(`coordinates = $${params.length}`);
    }

    if (!sets.length) return reply.badRequest('Nada que actualizar');

    params.push(req.params.id);
    const rows = await query(
      `UPDATE places SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING *`,
      params
    );

    if (!rows.length) return reply.notFound('Place not found');
    return rows[0];
  });

  // ── DELETE /api/places/:id ────────────────────────────────
  app.delete('/:id', async (req, reply) => {
    await query('DELETE FROM places WHERE id = $1', [req.params.id]);
    return { ok: true };
  });

  // ── POST /api/places/:id/link  { entry_id } ───────────────
  app.post('/:id/link', async (req, reply) => {
    const { entry_id } = req.body;
    if (!entry_id) return reply.badRequest('entry_id es obligatorio');

    await query(`
      INSERT INTO entry_places (entry_id, place_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `, [entry_id, req.params.id]);

    return { ok: true };
  });

  // ── DELETE /api/places/:id/link/:entry_id ─────────────────
  app.delete('/:id/link/:entry_id', async (req) => {
    await query(
      'DELETE FROM entry_places WHERE entry_id = $1 AND place_id = $2',
      [req.params.entry_id, req.params.id]
    );
    return { ok: true };
  });
}
