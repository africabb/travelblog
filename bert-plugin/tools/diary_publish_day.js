import { api } from '../client.js';

export const definition = {
  type: 'function',
  function: {
    name: 'diary_publish_day',
    description: `
      Publica todas las entradas y fotos en borrador de un día completo.
      Úsala SOLO cuando el usuario lo pida explícitamente:
      "publica el día de hoy", "publícalo todo", "que salga en el diario".
      NO la uses de forma automática sin confirmación del usuario.
    `.trim(),
    parameters: {
      type: 'object',
      required: ['date'],
      properties: {
        date: {
          type: 'string',
          description: 'Fecha YYYY-MM-DD del día a publicar.',
        },
      },
    },
  },
};

export async function handler(params) {
  const { date } = params;

  let result;
  try {
    result = await api('POST', `/api/days/${date}/publish`);
  } catch (err) {
    if (err.message.includes('400')) {
      return {
        ok:      false,
        summary: `No hay entradas en borrador para el ${date}. Puede que ya estén publicadas o no haya nada guardado.`,
      };
    }
    throw err;
  }

  return {
    ok:               true,
    published_entries: result.published_entries,
    summary: `✅ ${result.published_entries} entrada${result.published_entries > 1 ? 's' : ''} del ${date} publicada${result.published_entries > 1 ? 's' : ''} en el diario.`,
  };
}
