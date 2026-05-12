import { api } from '../client.js';

function normalize(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function samePlace(a, b) {
  return normalize(a.name) === normalize(b.name)
    && normalize(a.city ?? '') === normalize(b.city ?? '');
}

export const definition = {
  type: 'function',
  function: {
    name: 'diary_add_place',
    description: `
      Registra un lugar o restaurante visitado durante el viaje.
      Úsala siempre que el usuario mencione un sitio concreto: un restaurante donde comió,
      una ciudad, un barrio, un templo, una tienda, un parque...
      Si publicas una entrada y hay lugares o restaurantes mencionados, debes llamar a esta
      herramienta para cada sitio y pasar entry_id para que aparezca dentro del día y en el
      resumen del viaje.
      No dejes restaurantes o lugares solo escritos en el body de la entrada: sin esta tool no
      aparecen en las secciones "Restaurantes" y "Lugares" de la web.
      Si el mismo sitio ya existe para la misma ciudad, reutiliza y vincula ese sitio: no crees
      duplicados de restaurantes o lugares.
      Siempre que registres un sitio o restaurante, intenta recopilar un enlace de Google Maps
      y guárdalo en google_maps_url solo si estás 100% segura de que corresponde al sitio exacto:
      nombre, ciudad/zona y contexto deben coincidir claramente. Si no puedes verificarlo, deja
      google_maps_url en blanco. Si es un restaurante y encuentras una web oficial fiable, guárdala
      en official_url; si no, déjala en blanco. No uses enlaces de agregadores como web oficial.
      Si verificas nombre y dirección/ciudad pero no consigues una URL de ficha estable, puedes
      guardar una URL de búsqueda de Google Maps con la query exacta del nombre y dirección.
      Opcionalmente puedes vincularlo a una entrada del diario con entry_id.
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

  const existingPlaces = placeData.city
    ? await api('GET', `/api/places?city=${encodeURIComponent(placeData.city)}`).catch(() => [])
    : [];
  const existing = existingPlaces.find((place) => samePlace(place, placeData));

  const patch = {};
  if (existing) {
    if (!existing.google_maps_url && placeData.google_maps_url) patch.google_maps_url = placeData.google_maps_url;
    if (!existing.official_url && placeData.official_url) patch.official_url = placeData.official_url;
    if (!existing.description && placeData.description) patch.description = placeData.description;
    if (!existing.category && placeData.category) patch.category = placeData.category;
    if (!existing.address && placeData.address) patch.address = placeData.address;
    if (!existing.cover_media_id && media_id) patch.cover_media_id = media_id;
  }

  const place = existing
    ? Object.keys(patch).length
      ? await api('PATCH', `/api/places/${existing.id}`, patch)
      : existing
    : await api('POST', '/api/places', {
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
    summary:  `"${place.name}" (${place.type}) ${existing ? 'reutilizado' : 'guardado'}${entry_id ? ' y vinculado a la entrada' : ''}.`,
  };
}
