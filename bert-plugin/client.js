/**
 * Cliente HTTP para la Diary API.
 * Todas las tools lo importan — un único lugar para cambiar la URL o el secret.
 */

import fetch    from 'node-fetch';
import FormData from 'form-data';

const BASE_URL = process.env.DIARY_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3001';
const SECRET   = process.env.DIARY_API_SECRET ?? '';

function authHeaders() {
  return {
    Authorization: `Bearer ${SECRET}`,
  };
}

/**
 * JSON request helper.
 * @param {'GET'|'POST'|'PATCH'|'DELETE'} method
 * @param {string} path
 * @param {object} [body]
 */
export async function api(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json',
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = json?.error ?? json?.message ?? `HTTP ${res.status}`;
    throw new Error(`[diary-api] ${method} ${path} → ${msg}`);
  }

  return json;
}

/**
 * Multipart upload helper — usado por diary_add_media.
 * @param {Buffer} buffer
 * @param {object} meta  — mime_type, original_name, entry_id, caption, etc.
 */
export async function uploadMedia(buffer, meta) {
  const form = new FormData();
  form.append('file', buffer, {
    filename:    meta.original_name ?? `media_${Date.now()}`,
    contentType: meta.mime_type     ?? 'application/octet-stream',
  });

  const fields = ['entry_id', 'status', 'caption', 'location', 'sort_order',
                  'source_channel', 'source_message_id', 'source_timestamp', 'taken_at'];

  fields.forEach((f) => {
    if (meta[f] != null) form.append(f, String(meta[f]));
  });

  const res = await fetch(`${BASE_URL}/api/media/ingest`, {
    method:  'POST',
    headers: { ...authHeaders(), ...form.getHeaders() },
    body:    form,
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`[diary-api] media/ingest → ${json?.error ?? res.status}`);
  return json;
}
