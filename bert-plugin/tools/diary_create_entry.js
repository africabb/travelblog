import { api } from '../client.js';

export const definition = {
  type: 'function',
  function: {
    name: 'diary_create_entry',
    description: `
      Crea una entrada de texto en el diario de viaje.
      Siempre se crea publicada directamente.
      Usala cuando el usuario cuenta algo que ha vivido, describe un lugar, comparte una reflexion
      o quiere que quede escrito en su diario.
      NO la uses para subir fotos o videos; para eso usa diary_add_media.
    `.trim(),
    parameters: {
      type: 'object',
      required: ['date', 'title', 'body'],
      properties: {
        date: {
          type: 'string',
          description: 'Fecha de la entrada en formato YYYY-MM-DD. Usa la fecha que indique la usuaria aunque sea ayer u otro dia pasado. Usa hoy solo si no hay fecha indicada ni fecha fiable en la media.',
        },
        day_number: {
          type: 'integer',
          description: 'Numero de dia dentro del viaje. Si la usuaria dice "dia dos del viaje", usa 2 aunque la fecha real sea otra.',
        },
        title: {
          type: 'string',
          description: 'Titulo evocador para la entrada. Maximo 80 caracteres.',
        },
        body: {
          type: 'string',
          description: 'Texto narrativo de la entrada. Primera persona, tono personal y viajero. Minimo 2 frases, maximo 6.',
        },
        location: {
          type: 'string',
          description: 'Nombre del lugar especifico.',
        },
        city: {
          type: 'string',
          description: 'Ciudad o destino principal del viaje.',
        },
        mood: {
          type: 'string',
          description: 'Estado de animo breve.',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Lista de etiquetas cortas.',
        },
        media_ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'IDs de media ya subida que quieres vincular a esta entrada.',
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
  const { media_ids, ...entryData } = params;

  const entry = await api('POST', '/api/entries', {
    ...entryData,
    status: 'published',
    sort_order: entryData.sort_order ?? entryData.day_number ?? 0,
    source_channel: 'whatsapp',
    source_message_id: params.source_message_id ?? context?.messageId ?? null,
    source_timestamp: context?.timestamp ?? new Date().toISOString(),
  });

  if (media_ids?.length) {
    await Promise.all(
      media_ids.map((id) => api('PATCH', `/api/media/${id}`, {
        entry_id: entry.id,
        status: 'published',
      })),
    );
  }

  return {
    ok: true,
    entry_id: entry.id,
    title: entry.title,
    date: entry.date,
    status: entry.status,
    summary: `Entrada "${entry.title}" publicada.`,
  };
}
