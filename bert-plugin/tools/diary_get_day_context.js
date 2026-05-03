import { api } from '../client.js';

export const definition = {
  type: 'function',
  function: {
    name: 'diary_get_day_context',
    description: `
      Devuelve todo lo guardado de un día: entradas, fotos, vídeos y lugares visitados.
      Úsala cuando el usuario quiera un resumen de su día, cuando pida "léeme el draft de hoy",
      o cuando necesites contexto completo antes de editar o publicar un día entero.
    `.trim(),
    parameters: {
      type: 'object',
      required: ['date'],
      properties: {
        date: {
          type: 'string',
          description: 'Fecha YYYY-MM-DD. Para "hoy" usa la fecha actual.',
        },
      },
    },
  },
};

export async function handler(params) {
  const { date } = params;
  let day;

  try {
    day = await api('GET', `/api/days/${date}`);
  } catch (err) {
    if (err.message.includes('404') || err.message.includes('No hay')) {
      return { ok: true, found: false, summary: `No hay nada guardado para el ${date} todavía.` };
    }
    throw err;
  }

  const entries    = day.entries ?? [];
  const places     = day.places  ?? [];
  const totalMedia = entries.reduce((n, e) => n + (e.media?.length ?? 0), 0);

  // Resumen compacto para que Bert pueda narrarlo en chat
  const entryLines = entries.map((e) =>
    `• "${e.title}" [${e.status}]${e.location ? ` — ${e.location}` : ''}` +
    `${e.media?.length ? ` (${e.media.length} archivo${e.media.length > 1 ? 's' : ''})` : ''}`
  );

  const placesLines = places.map((p) =>
    `• ${p.name} (${p.type})${p.rating ? ` ★${p.rating}` : ''}`
  );

  const parts = [];
  if (entryLines.length) parts.push(`Entradas:\n${entryLines.join('\n')}`);
  if (placesLines.length) parts.push(`Lugares:\n${placesLines.join('\n')}`);
  if (totalMedia)         parts.push(`Total archivos multimedia: ${totalMedia}`);

  return {
    ok:      true,
    found:   true,
    date,
    entries,
    places,
    summary: `Día ${date}:\n${parts.join('\n\n')}`,
  };
}
