import { api } from '../client.js';

export const definition = {
  type: 'function',
  function: {
    name: 'diary_list_drafts',
    description: `
      Lista los borradores del diario pendientes de revision.
      Usala cuando el usuario pregunte que has guardado, quiera ver sus borradores,
      quiera revisar lo del dia antes de publicarlo, o quiera publicar por numero de dia del viaje.
      Devuelve un resumen compacto de cada borrador para que puedas contarselo en chat.
    `.trim(),
    parameters: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'Filtrar por fecha YYYY-MM-DD. Si no se indica, devuelve todos los drafts.',
        },
        city: {
          type: 'string',
          description: 'Filtrar por ciudad o viaje.',
        },
      },
    },
  },
};

export async function handler(params) {
  const qs = new URLSearchParams();
  if (params.date) qs.set('date', params.date);
  if (params.city) qs.set('city', params.city);

  const drafts = await api('GET', `/api/drafts?${qs}`);

  if (!drafts.length) {
    return { ok: true, count: 0, summary: 'No hay borradores pendientes.' };
  }

  const lines = drafts.map((d, i) =>
    `${i + 1}. [${d.date}]${d.day_number ? ` Dia ${d.day_number}` : ''} "${d.title}"${d.city ? ` - ${d.city}` : ''}` +
    `${d.media?.length ? ` (${d.media.length} foto${d.media.length > 1 ? 's' : ''})` : ''}`
  );

  return {
    ok:     true,
    count:  drafts.length,
    drafts: drafts.map((d) => ({
      id:          d.id,
      date:        d.date,
      day_number:  d.day_number,
      title:       d.title,
      city:        d.city,
      media_count: d.media?.length ?? 0,
    })),
    summary: `Tienes ${drafts.length} borrador${drafts.length > 1 ? 'es' : ''}:\n${lines.join('\n')}`,
  };
}
