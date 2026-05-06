import { uploadMedia } from '../client.js';

export const definition = {
  type: 'function',
  function: {
    name: 'diary_add_media',
    description: `
      Sube una foto, vídeo o audio al diario de viaje.
      Úsala siempre que el usuario mande un archivo multimedia.
      Puede vincularse a una entrada existente (entry_id) o quedar suelta para vincular después.
      Devuelve el ID y la URL pública del archivo subido.
    `.trim(),
    parameters: {
      type: 'object',
      required: ['media_base64', 'mime_type'],
      properties: {
        media_base64: {
          type: 'string',
          description: 'Contenido del archivo en base64.',
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
          description: 'Descripción o pie de foto. Si el usuario mandó texto junto a la foto, úsalo aquí.',
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
  const { media_base64, mime_type, original_name, ...meta } = params;

  if (!media_base64) throw new Error('media_base64 es obligatorio');

  const buffer = Buffer.from(media_base64, 'base64');

  const record = await uploadMedia(buffer, {
    mime_type:         mime_type,
    original_name:     original_name ?? null,
    entry_id:          meta.entry_id          ?? null,
    status:            'published',
    caption:           meta.caption           ?? null,
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
    summary:  `${record.type === 'photo' ? 'Foto' : record.type === 'video' ? 'Vídeo' : 'Audio'} guardado. URL: ${record.url}`,
  };
}
