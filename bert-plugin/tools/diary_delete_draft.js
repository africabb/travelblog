import { api } from '../client.js';

export const definition = {
  type: 'function',
  function: {
    name: 'diary_delete_draft',
    description: `
      Elimina un borrador del diario.
      Úsala SOLO cuando el usuario lo pida explícitamente: "borra ese", "no lo quiero", "descártalo".
      Solo funciona con borradores (status=draft), no con entradas ya publicadas.
    `.trim(),
    parameters: {
      type: 'object',
      required: ['id'],
      properties: {
        id: {
          type: 'string',
          description: 'ID del borrador a eliminar.',
        },
      },
    },
  },
};

export async function handler(params) {
  await api('DELETE', `/api/drafts/${params.id}`);
  return {
    ok:      true,
    summary: 'Borrador eliminado.',
  };
}
