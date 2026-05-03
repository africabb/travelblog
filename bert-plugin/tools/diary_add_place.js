import { api } from '../client.js';

export const definition = {
  type: 'function',
  function: {
    name: 'diary_add_place',
    description: `
      Registra un lugar o restaurante visitado durante el viaje.
      Úsala cuando el usuario mencione un sitio concreto: un restaurante donde comió,
      un templo que visitó, una tienda, un parque…
      Siempre que registres un sitio o restaurante, recopila y guarda un enlace de Google Maps
      en google_maps_url solo si estas 100% segura de que corresponde al sitio exacto.
      Si no puedes verificarlo, deja google_maps_url en blanco. Si es un restaurante y encuentras
      una web oficial fiable, guardala en official_url; si no, dejala en blanco. Opcionalmente
      puedes vincularlo a una entrada del diario con entry_id.
    `.trim(),
    parameters: {
      type: 'object',
      required: ['name', 'type'],
      properties: {
        name: {
          type: 'string',
          description: 'Nombre del lugar. Ej: "Ichiran Ramen", "Senso-ji", "Tsukiji Outer Market".',
        },
        name_jp: {
          type: 'string',
          description: 'Nombre en japonés si se conoce. Ej: "浅草寺".',
        },
        type: {
          type: 'string',
          enum: ['restaurant', 'temple', 'park', 'museum', 'shop', 'other'],
          description: 'Tipo de lugar.',
        },
        city: {
          type: 'string',
          description: 'Ciudad japonesa donde está el lugar.',
        },
        address: {
          type: 'string',
          description: 'Dirección o referencia de ubicación.',
        },
        category: {
          type: 'string',
          description: 'Solo para restaurantes: ramen, sushi, izakaya, tempura, wagyu, cafe, street, otro.',
        },
        rating: {
          type: 'number',
          minimum: 1,
          maximum: 5,
          description: 'Puntuación del 1 al 5. Infiere del tono del usuario si no lo dice explícitamente.',
        },
        price_range: {
          type: 'string',
          enum: ['¥', '¥¥', '¥¥¥', '¥¥¥¥'],
          description: 'Rango de precios aproximado.',
        },
        description: {
          type: 'string',
          description: 'Descripción breve y evocadora del lugar. 1-2 frases.',
        },
        google_maps_url: {
          type: 'string',
          description: 'URL de Google Maps del lugar/restaurante.',
        },
        official_url: {
          type: 'string',
          description: 'Web oficial del restaurante/lugar si se encuentra una fuente fiable.',
        },
        media_id: {
          type: 'string',
          description: 'ID de una foto ya subida para usar como portada del lugar.',
        },
        entry_id: {
          type: 'string',
          description: 'ID de la entrada del diario a la que vincular este lugar.',
        },
      },
    },
  },
};

export async function handler(params, context) {
  const { entry_id, media_id, ...placeData } = params;

  const place = await api('POST', '/api/places', {
    ...placeData,
    cover_media_id: media_id ?? null,
    visited_at:     context?.timestamp ?? new Date().toISOString(),
  });

  // Vincular a entrada si se proporcionó entry_id
  if (entry_id) {
    await api('POST', `/api/places/${place.id}/link`, { entry_id });
  }

  return {
    ok:       true,
    place_id: place.id,
    name:     place.name,
    type:     place.type,
    summary:  `"${place.name}" (${place.type}) guardado${entry_id ? ' y vinculado a la entrada' : ''}.`,
  };
}
