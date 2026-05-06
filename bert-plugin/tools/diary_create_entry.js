import { api } from '../client.js';

export const definition = {
  type: 'function',
  function: {
    name: 'diary_create_entry',
    description: `
      Crea una entrada de texto en el diario de viaje.
      Siempre se crea como borrador (draft) a menos que se indique explícitamente status='published'.
      Úsala cuando el usuario cuenta algo que ha vivido, describe un lugar, comparte una reflexión
      o quiere que quede escrito en su diario.
      NO la uses para subir fotos o vídeos — para eso usa diary_add_media.
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
          description: 'Título evocador y poético para la entrada. Máximo 80 caracteres.',
        },
        body: {
          type: 'string',
          description: 'Texto narrativo de la entrada. Primera persona, tono personal y viajero. Mínimo 2 frases, máximo 6.',
        },
        location: {
          type: 'string',
          description: 'Nombre del lugar específico (templo, barrio, calle…).',
        },
        city: {
          type: 'string',
          description: 'Ciudad japonesa (Tokio, Kioto, Osaka, Nara…).',
        },
        mood: {
          type: 'string',
          description: 'Emoji + adjetivo que describe el estado de ánimo. Ej: "🌸 Maravillada", "⚡ Electrizada".',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Lista de etiquetas cortas. Ej: ["Asakusa", "Templo", "Amanecer"].',
        },
        media_ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'IDs de media ya subida que quieres vincular a esta entrada.',
        },
        source_message_id: {
          type: 'string',
          description: 'ID del mensaje de WhatsApp de origen (para trazabilidad).',
        },
      },
    },
  },
};

export async function handler(params, context) {
  const { media_ids, ...entryData } = params;

  const entry = await api('POST', '/api/entries', {
    ...entryData,
    sort_order: entryData.sort_order ?? entryData.day_number ?? 0,
    source_channel: 'whatsapp',
    source_message_id: params.source_message_id ?? context?.messageId ?? null,
    source_timestamp:  context?.timestamp        ?? new Date().toISOString(),
  });

  // Vincular media si se pasaron IDs
  if (media_ids?.length) {
    await Promise.all(
      media_ids.map((id) =>
        api('PATCH', `/api/media/${id}`, { entry_id: entry.id })
      )
    );
  }

  return {
    ok:       true,
    entry_id: entry.id,
    title:    entry.title,
    date:     entry.date,
    status:   entry.status,
    summary:  `Entrada "${entry.title}" guardada como ${entry.status}.`,
  };
}
