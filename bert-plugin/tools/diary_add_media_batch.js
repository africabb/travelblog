import { handler as addMedia } from './diary_add_media.js';

export const definition = {
  type: 'function',
  function: {
    name: 'diary_add_media_batch',
    description: `
      Sube muchas fotos o vídeos del mismo lote al diario de viaje.
      Úsala cuando África mande varias fotos/vídeos juntos o cuando haya que asegurarse de que no falta ninguna.
      Debe subir TODOS los archivos recibidos, uno por uno, y devolver el recuento final.
      No subas audios: los audios se usan solo como transcripcion para redactar.
    `.trim(),
    parameters: {
      type: 'object',
      required: ['items'],
      properties: {
        entry_id: {
          type: 'string',
          description: 'ID de la entrada del diario a la que asociar todos los archivos.',
        },
        default_caption: {
          type: 'string',
          description: 'Pie genérico si un item no trae caption propio. Ej: "Foto del día".',
        },
        location: {
          type: 'string',
          description: 'Lugar general si se conoce por el texto de África.',
        },
        taken_at: {
          type: 'string',
          description: 'Fecha/hora general ISO 8601 si se conoce.',
        },
        items: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            required: ['mime_type'],
            properties: {
              file_path: {
                type: 'string',
                description: 'Ruta local del archivo recibido por WhatsApp.',
              },
              media_base64: {
                type: 'string',
                description: 'Contenido base64. Usar solo si no hay file_path.',
              },
              mime_type: {
                type: 'string',
                description: 'MIME type. Ej: image/jpeg, video/mp4.',
              },
              original_name: {
                type: 'string',
                description: 'Nombre original del archivo.',
              },
              caption: {
                type: 'string',
                description: 'Pie breve para este archivo.',
              },
              location: {
                type: 'string',
                description: 'Lugar concreto si se conoce.',
              },
              taken_at: {
                type: 'string',
                description: 'Fecha/hora ISO 8601 si se conoce.',
              },
              source_message_id: {
                type: 'string',
                description: 'ID del mensaje de WhatsApp de origen.',
              },
            },
          },
        },
      },
    },
  },
};

export async function handler(params, context) {
  const uploaded = [];
  const skipped = [];

  for (const item of params.items) {
    const mimeType = item.mime_type ?? '';

    if (mimeType.startsWith('audio/')) {
      skipped.push({
        original_name: item.original_name ?? item.file_path ?? null,
        reason: 'audio_not_published',
      });
      continue;
    }

    const result = await addMedia({
      ...item,
      entry_id: item.entry_id ?? params.entry_id ?? null,
      caption: item.caption ?? params.default_caption ?? undefined,
      location: item.location ?? params.location ?? undefined,
      taken_at: item.taken_at ?? params.taken_at ?? undefined,
    }, context);

    if (result.ok && !result.skipped) {
      uploaded.push(result);
    } else {
      skipped.push({
        original_name: item.original_name ?? item.file_path ?? null,
        reason: result.summary ?? result.error ?? 'skipped',
      });
    }
  }

  return {
    ok: true,
    uploaded_count: uploaded.length,
    skipped_count: skipped.length,
    uploaded,
    skipped,
    summary: `Media subida: ${uploaded.length}. Omitidos: ${skipped.length}.`,
  };
}
