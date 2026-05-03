import { query }       from '../db/client.js';
import { uploadMedia, deleteMedia } from '../services/storage.js';

const ALLOWED_TYPES = new Set(['photo', 'video', 'audio']);
const MIME_TO_TYPE  = {
  'image/':  'photo',
  'video/':  'video',
  'audio/':  'audio',
};

function guessType(mimeType) {
  for (const [prefix, type] of Object.entries(MIME_TO_TYPE)) {
    if (mimeType.startsWith(prefix)) return type;
  }
  return null;
}

export default async function mediaRoutes(app) {

  // ── POST /api/media/ingest ────────────────────────────────
  // Recibe el binario (multipart), sube a R2, guarda metadatos.
  app.post('/ingest', async (req, reply) => {
    const data = await req.file();
    if (!data) return reply.badRequest('Se esperaba un fichero en el campo "file"');

    const mimeType = data.mimetype;
    const type     = guessType(mimeType);
    if (!type) return reply.badRequest(`Tipo de fichero no soportado: ${mimeType}`);

    const buffer       = await data.toBuffer();
    const originalName = data.filename;

    // Metadatos opcionales en campos del mismo multipart
    const fields           = data.fields ?? {};
    const entry_id         = fields.entry_id?.value         ?? null;
    const caption          = fields.caption?.value          ?? null;
    const location         = fields.location?.value         ?? null;
    const sort_order       = Number(fields.sort_order?.value ?? 0);
    const source_channel   = fields.source_channel?.value   ?? null;
    const source_message_id = fields.source_message_id?.value ?? null;
    const source_timestamp = fields.source_timestamp?.value  ?? null;
    const taken_at         = fields.taken_at?.value          ?? null;

    const { key, url } = await uploadMedia(buffer, { type, mimeType, originalName });

    const rows = await query(`
      INSERT INTO media
        (entry_id, type, sort_order, storage_key, url, caption, mime_type, size_bytes,
         source_channel, source_message_id, source_timestamp, taken_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *
    `, [
      entry_id, type, sort_order, key, url, caption,
      mimeType, buffer.byteLength,
      source_channel, source_message_id, source_timestamp, taken_at,
    ]);

    return reply.code(201).send(rows[0]);
  });

  // ── GET /api/media ────────────────────────────────────────
  app.get('/', async (req) => {
    const { entry_id, status, type } = req.query;
    const conditions = [];
    const params     = [];

    if (entry_id) { params.push(entry_id); conditions.push(`entry_id = $${params.length}`); }
    if (status)   { params.push(status);   conditions.push(`status = $${params.length}`); }
    if (type)     { params.push(type);     conditions.push(`type = $${params.length}`); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    return query(`SELECT * FROM media ${where} ORDER BY sort_order, created_at DESC`, params);
  });

  // ── PATCH /api/media/:id ──────────────────────────────────
  app.patch('/:id', async (req, reply) => {
    const allowed = ['entry_id', 'caption', 'sort_order', 'status', 'taken_at'];
    const sets    = [];
    const params  = [];

    allowed.forEach((f) => {
      if (req.body[f] !== undefined) {
        params.push(req.body[f]);
        sets.push(`${f} = $${params.length}`);
      }
    });

    if (!sets.length) return reply.badRequest('Nada que actualizar');

    params.push(req.params.id);
    const rows = await query(
      `UPDATE media SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING *`,
      params
    );

    if (!rows.length) return reply.notFound('Media not found');
    return rows[0];
  });

  // ── DELETE /api/media/:id ─────────────────────────────────
  app.delete('/:id', async (req, reply) => {
    const rows = await query('SELECT storage_key FROM media WHERE id = $1', [req.params.id]);
    if (!rows.length) return reply.notFound('Media not found');

    await deleteMedia(rows[0].storage_key);
    await query('DELETE FROM media WHERE id = $1', [req.params.id]);
    return { ok: true };
  });
}
