import { api } from '../client.js';

export const definition = {
  type: 'function',
  function: {
    name: 'diary_publish_draft',
    description: `
      Publica un borrador concreto del diario y sus fotos asociadas.
      Usala SOLO cuando la usuaria lo pida explicitamente:
      "publica este borrador", "sube esta entrada", "publica el draft de Marcos y Carmen".
      Si la usuaria pide publicar todo un dia, usa diary_publish_day.
    `.trim(),
    parameters: {
      type: 'object',
      required: ['id'],
      properties: {
        id: {
          type: 'string',
          description: 'ID del borrador o entrada aprobada que se debe publicar.',
        },
      },
    },
  },
};

export async function handler(params) {
  const entry = await api('PATCH', `/api/drafts/${params.id}/publish`, {});

  return {
    ok: true,
    entry_id: entry.id,
    title: entry.title,
    date: entry.date,
    status: entry.status,
    summary: `"${entry.title}" publicado en la web.`,
  };
}
