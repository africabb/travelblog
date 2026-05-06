import { api } from '../client.js';

export const definition = {
  type: 'function',
  function: {
    name: 'diary_upsert_day_entry',
    description: `
      Creates or updates the main diary entry for a given day.
      Use this instead of creating multiple entries when the user sends more memories on the same date.
      It keeps one primary draft per day and can link media already uploaded with diary_add_media.
    `.trim(),
    parameters: {
      type: 'object',
      required: ['date', 'title', 'body'],
      properties: {
        date: {
          type: 'string',
          description: 'Date in YYYY-MM-DD format. Use the date stated by the user even if it is yesterday or another past day. Use today only when no date is stated and media has no reliable capture date.',
        },
        title: {
          type: 'string',
          description: 'Natural, elegant title for the day entry. Maximum 80 characters.',
        },
        body: {
          type: 'string',
          description: 'Updated full body for the day entry. Merge prior context with the new memory.',
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
        source_message_id: { type: 'string' },
      },
    },
  },
};

export async function handler(params, context) {
  const { media_ids, ...entryData } = params;
  const qs = new URLSearchParams({
    date: params.date,
    status: 'draft',
  });
  if (params.city) qs.set('city', params.city);
  const existing = await api('GET', `/api/entries?${qs}`);

  let entry;
  if (existing.length) {
    entry = await api('PATCH', `/api/entries/${existing[0].id}`, {
      title: entryData.title,
      body: entryData.body,
      location: entryData.location ?? existing[0].location,
      city: entryData.city ?? existing[0].city,
      mood: entryData.mood ?? existing[0].mood,
      tags: entryData.tags ?? existing[0].tags ?? [],
    });
  } else {
    entry = await api('POST', '/api/entries', {
      ...entryData,
      source_channel: 'whatsapp',
      source_message_id: params.source_message_id ?? context?.messageId ?? null,
      source_timestamp: context?.timestamp ?? new Date().toISOString(),
    });
  }

  if (media_ids?.length) {
    await Promise.all(media_ids.map((id) => api('PATCH', `/api/media/${id}`, { entry_id: entry.id })));
  }

  return {
    ok: true,
    entry_id: entry.id,
    title: entry.title,
    date: entry.date,
    status: entry.status,
    created: !existing.length,
    summary: `Entrada principal del dia ${entry.date} ${existing.length ? 'actualizada' : 'creada'} como ${entry.status}.`,
  };
}
