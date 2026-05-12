import { api } from '../client.js';

const SITE_URL = (process.env.DIARY_SITE_URL ?? 'https://japon.amurasoftware.com').replace(/\/$/, '');
const GREECE_TRIP_CITY = 'Grecia en barco';
const GREECE_ALIASES = [
  'grecia',
  'grecia en barco',
  'mar jonico',
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

function normalizeBody(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function mergeBody(existingBody = '', nextBody = '') {
  const existing = String(existingBody ?? '').trim();
  const next = String(nextBody ?? '').trim();

  if (!existing) return next;
  if (!next) return existing;

  const normalizedExisting = normalizeBody(existing);
  const normalizedNext = normalizeBody(next);

  if (normalizedNext.includes(normalizedExisting)) return next;
  if (normalizedExisting.includes(normalizedNext)) return existing;

  return `${existing}\n\n${next}`;
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
    name: 'diary_upsert_day_entry',
    description: `
      Creates or updates the main diary entry for a given day.
      Use this instead of creating multiple entries when the user sends more memories on the same date.
      It keeps one primary published entry per day and can link media already uploaded with diary_add_media.
    `.trim(),
    parameters: {
      type: 'object',
      required: ['date', 'title', 'body'],
      properties: {
        date: {
          type: 'string',
          description: 'Date in YYYY-MM-DD format. Use the date stated by the user even if it is yesterday or another past day. Use today only when no date is stated and media has no reliable capture date.',
        },
        day_number: {
          type: 'integer',
          description: 'Sequential day number inside the trip. If the user says "dia dos del viaje", use 2 even when the calendar date is different.',
        },
        title: {
          type: 'string',
          description: 'Natural, elegant title for the day entry. Maximum 80 characters.',
        },
        body: {
          type: 'string',
          description: 'Narrative body for the day entry, written in third person about Miguel and Africa. If the day already exists, write only the new polished scene or the full merged story; the tool will never delete previous text accidentally.',
        },
        location: { type: 'string' },
        city: { type: 'string' },
        mood: { type: 'string' },
        tags: {
          type: 'array',
          items: { type: 'string' },
        },
        media_ids: {
          type: 'array',
          items: { type: 'string' },
          description: 'Media IDs to attach to this day entry.',
        },
        replace_body: {
          type: 'boolean',
          description: 'Use true only when rewriting the existing day to remove literal audio text or duplicated prose. Use false or omit when adding a new scene to the day.',
        },
        source_message_id: { type: 'string' },
      },
    },
  },
};

export async function handler(params, context) {
  params = normalizeTripFields(params);
  const { media_ids, ...entryData } = params;
  const qs = new URLSearchParams({
    date: params.date,
  });
  if (params.city) qs.set('city', params.city);
  const existing = await api('GET', `/api/entries?${qs}`);

  let entry;
  if (existing.length) {
    const body = params.replace_body ? entryData.body : mergeBody(existing[0].body, entryData.body);

    entry = await api('PATCH', `/api/entries/${existing[0].id}`, {
      title: entryData.title ?? existing[0].title,
      body,
      location: entryData.location ?? existing[0].location,
      city: entryData.city ?? existing[0].city,
      day_number: entryData.day_number ?? existing[0].day_number,
      sort_order: entryData.day_number ?? existing[0].sort_order ?? 0,
      mood: entryData.mood ?? existing[0].mood,
      tags: entryData.tags ?? existing[0].tags ?? [],
      status: 'published',
    });
  } else {
    entry = await api('POST', '/api/entries', {
      ...entryData,
      status: 'published',
      sort_order: entryData.sort_order ?? entryData.day_number ?? 0,
      source_channel: 'whatsapp',
      source_message_id: params.source_message_id ?? context?.messageId ?? null,
      source_timestamp: context?.timestamp ?? new Date().toISOString(),
    });
  }

  if (media_ids?.length) {
    await Promise.all(media_ids.map((id) => api('PATCH', `/api/media/${id}`, {
      entry_id: entry.id,
      status: 'published',
    })));
  }

  return {
    ok: true,
    entry_id: entry.id,
    title: entry.title,
    date: entry.date,
    status: entry.status,
    public_url: publicEntryUrl(entry),
    created: !existing.length,
    summary: `Entrada principal del dia ${entry.date} ${existing.length ? 'actualizada' : 'creada'} y publicada: ${publicEntryUrl(entry)}`,
  };
}
