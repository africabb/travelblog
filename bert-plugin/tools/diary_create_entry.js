import { api } from '../client.js';

const SITE_URL = (process.env.DIARY_SITE_URL ?? 'https://japon.amurasoftware.com').replace(/\/$/, '');
const GREECE_TRIP_CITY = 'Grecia en barco';
const GREECE_ALIASES = [
  'grecia',
  'grecia en barco',
  'mar jonico',
  'corfu',
  'paleros',
  'meganisi',
  'sivota',
  'lefkada',
  'ithaka',
  'ithaca',
  'atokos',
  'kastos',
  'kalamos',
  'agrapidia',
];
const GREECE_DATE_TO_DAY = {
  '2023-07-07': 2,
  '2023-07-08': 3,
  '2023-07-09': 4,
  '2023-07-10': 5,
  '2023-07-13': 6,
  '2023-07-14': 7,
  '2023-07-15': 8,
  '2023-07-16': 9,
};
const JAPAN_CITIES = new Set(['tokio', 'kioto', 'osaka', 'nara', 'hiroshima', 'japon', 'japón']);

function slugifyTripName(name = '') {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' y ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function datePath(value) {
  const match = String(value ?? '').match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : String(value ?? '');
}

function normalizeText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function isGreeceTrip(value = '') {
  const normalized = normalizeText(value);
  return GREECE_ALIASES.some((alias) => normalized.includes(normalizeText(alias)));
}

function normalizeTripFields(params) {
  const date = datePath(params.date);
  const tripText = [
    params.city,
    params.location,
    params.title,
    params.body,
    ...(params.tags ?? []),
  ].filter(Boolean).join(' ');

  if (!isGreeceTrip(tripText)) return { ...params, date };

  return {
    ...params,
    date,
    city: GREECE_TRIP_CITY,
    day_number: params.day_number && params.day_number > 0
      ? params.day_number
      : GREECE_DATE_TO_DAY[date] ?? params.day_number,
  };
}

function publicEntryUrl(entry) {
  const city = (entry.city ?? '').trim();
  const normalized = city
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  const date = datePath(entry.date);

  if (isGreeceTrip(normalized)) {
    const day = entry.day_number && entry.day_number > 0 ? entry.day_number : GREECE_DATE_TO_DAY[date];
    return day ? `${SITE_URL}/grecia/${day}` : `${SITE_URL}/grecia`;
  }

  if (normalized === 'palma de mallorca' || normalized === 'palma' || normalized === 'mallorca') {
    return `${SITE_URL}/palma/${date}`;
  }

  if (JAPAN_CITIES.has(normalized)) {
    return `${SITE_URL}/feed/${date}`;
  }

  const slug = slugifyTripName(city || 'viaje');
  return `${SITE_URL}/viaje/${slug}/${date}`;
}

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
  params = normalizeTripFields(params);
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
    public_url: publicEntryUrl(entry),
    summary: `Entrada "${entry.title}" publicada: ${publicEntryUrl(entry)}`,
  };
}
