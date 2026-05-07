import { uploadMedia } from '../client.js';
import fs from 'node:fs/promises';
import path from 'node:path';

export const definition = {
  type: 'function',
  function: {
    name: 'diary_add_media',
    description: `
      Sube una foto, vídeo o audio al diario de viaje.
      Úsala siempre que el usuario mande un archivo multimedia.
      Puede vincularse a una entrada existente (entry_id) o quedar suelta para vincular después.
      Devuelve el ID y la URL pública del archivo subido.
      Si WhatsApp proporciona una ruta local del archivo, usa file_path en vez de media_base64 para no cargar archivos grandes dentro del modelo.
      No analices visualmente fotos o vídeos para crear captions; usa solo el texto explícito de la usuaria.
    `.trim(),
    parameters: {
      type: 'object',
      required: ['mime_type'],
      properties: {
        file_path: {
          type: 'string',
          description: 'Ruta local del archivo recibido por WhatsApp. Preferir siempre este campo cuando exista.',
        },
        media_base64: {
          type: 'string',
          description: 'Contenido del archivo en base64. Usar solo si no hay file_path.',
        },
        mime_type: {
          type: 'string',
          description: 'MIME type del archivo. Ej: "image/jpeg", "video/mp4", "audio/ogg".',
        },
        original_name: {
          type: 'string',
          description: 'Nombre original del archivo si está disponible.',
        },
        caption: {
          type: 'string',
          description: 'Pie de foto opcional. No describas la imagen: usa solo el texto que haya escrito la usuaria o un caption genérico como "Foto del día".',
        },
        location: {
          type: 'string',
          description: 'Lugar donde se tomó (si se conoce).',
        },
        entry_id: {
          type: 'string',
          description: 'ID de la entrada del diario a la que asociar este archivo.',
        },
        taken_at: {
          type: 'string',
          description: 'Fecha/hora en que se tomó, ISO 8601. Si no se sabe, omitir.',
        },
        source_message_id: {
          type: 'string',
          description: 'ID del mensaje de WhatsApp de origen.',
        },
      },
    },
  },
};

export async function handler(params, context) {
  const { file_path, media_base64, mime_type, original_name, ...meta } = params;

  if (!file_path && !media_base64) {
    throw new Error('file_path o media_base64 es obligatorio');
  }

  const buffer = file_path
    ? await fs.readFile(file_path)
    : Buffer.from(media_base64, 'base64');
  const resolvedName = original_name ?? (file_path ? path.basename(file_path) : null);

  const record = await uploadMedia(buffer, {
    mime_type:         mime_type,
    original_name:     resolvedName,
    entry_id:          meta.entry_id          ?? null,
    status:            'published',
    caption:           meta.caption           ?? genericCaption(recordTypeFromMime(mime_type)),
    location:          meta.location          ?? null,
    taken_at:          meta.taken_at          ?? null,
    source_channel:    'whatsapp',
    source_message_id: meta.source_message_id ?? context?.messageId ?? null,
    source_timestamp:  context?.timestamp     ?? new Date().toISOString(),
  });

  return {
    ok:       true,
    media_id: record.id,
    url:      record.url,
    type:     record.type,
    summary:  `${recordSummaryLabel(record.type)}. URL: ${record.url}`,
  };
}

function recordTypeFromMime(mimeType) {
  if (mimeType?.startsWith('image/')) return 'photo';
  if (mimeType?.startsWith('video/')) return 'video';
  if (mimeType?.startsWith('audio/')) return 'audio';
  return 'file';
}

function genericCaption(type) {
  if (type === 'photo') return 'Foto del día';
  if (type === 'video') return 'Vídeo del día';
  if (type === 'audio') return 'Audio del día';
  return null;
}

function recordSummaryLabel(type) {
  if (type === 'photo') return 'Foto guardada';
  if (type === 'video') return 'Vídeo guardado';
  if (type === 'audio') return 'Audio guardado';
  return 'Archivo guardado';
}

