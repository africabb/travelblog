import { api } from '../client.js';

export const definition = {
  type: 'function',
  function: {
    name: 'diary_approve_draft',
    description: `
      Marca un borrador como aprobado (listo para publicar).
      Úsala cuando el usuario diga "está bien así", "aprueba ese", "me gusta".
      El borrador aprobado no es público todavía — para eso se usa diary_publish_day
      o diary_publish_draft.
    `.trim(),
    parameters: {
      type: 'object',
      required: ['id'],
      properties: {
        id: {
          type: 'string',
          description: 'ID del borrador a aprobar.',
        },
        review_notes: {
          type: 'string',
          description: 'Nota de revisión opcional.',
        },
      },
    },
  },
};

export async function handler(params) {
  const entry = await api('PATCH', `/api/drafts/${params.id}/approve`, {
    review_notes: params.review_notes ?? null,
  });

  return {
    ok:      true,
    entry_id: entry.id,
    title:   entry.title,
    summary: `"${entry.title}" aprobado. Listo para publicar cuando quieras.`,
  };
}
