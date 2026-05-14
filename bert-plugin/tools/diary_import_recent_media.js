import { api, uploadMedia } from '../client.js';
import fs from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_INBOUND_DIRS = [
  '/home/node/.openclaw/media/inbound',
  '/home/openclaw/.openclaw/media/inbound',
];

const MIME_BY_EXT = {
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.webp': 'image/webp',
  '.mp4':  'video/mp4',
  '.mov':  'video/quicktime',
};

export const definition = {
  type: 'function',
  function: {
    name: 'diary_import_recent_media',
    description: `
      Revisa la carpeta de media recibida por WhatsApp y vincula a una entrada todos los archivos de una fecha que todavia no esten subidos.
      Usala SIEMPRE despues de crear o actualizar una entrada cuando Africa haya mandado fotos o videos, especialmente si mando muchas fotos o varios mensajes seguidos.
      Sirve como comprobacion final para no dejar fotos fuera.
      No sube audios.
    `.trim(),
    parameters: {
      type: 'object',
      required: ['entry_id', 'date'],
      properties: {
        entry_id: {
          type: 'string',
          description: 'ID de la entrada a la que se vincularan las fotos/videos.',
        },
        date: {
          type: 'string',
          description: 'Fecha del dia en formato YYYY-MM-DD.',
        },
        caption: {
          type: 'string',
          description: 'Caption generico para archivos importados sin pie propio.',
        },
        inbound_dir: {
          type: 'string',
          description: 'Directorio inbound si se conoce. Normalmente se omite.',
        },
      },
    },
  },
};

export async function handler(params) {
  const inboundDir = await resolveInboundDir(params.inbound_dir);
  const existing = await api('GET', `/api/media?entry_id=${encodeURIComponent(params.entry_id)}`);
  const existingSources = new Set(existing.map((item) => item.source_message_id).filter(Boolean));
  const existingNames = new Set(existing.map((item) => path.basename(item.storage_key ?? item.url ?? '')).filter(Boolean));
  const files = await filesForDate(inboundDir, params.date);
  const uploaded = [];
  const skipped = [];

  for (const file of files) {
    const originalName = path.basename(file.path);
    if (existingSources.has(originalName) || existingNames.has(originalName)) {
      skipped.push({ file: originalName, reason: 'already_uploaded' });
      continue;
    }

    const mimeType = MIME_BY_EXT[path.extname(file.path).toLowerCase()];
    if (!mimeType) {
      skipped.push({ file: originalName, reason: 'unsupported_type' });
      continue;
    }
    if (mimeType.startsWith('audio/')) {
      skipped.push({ file: originalName, reason: 'audio_not_published' });
      continue;
    }

    const buffer = await fs.readFile(file.path);
    const record = await uploadMedia(buffer, {
      mime_type:         mimeType,
      original_name:     originalName,
      entry_id:          params.entry_id,
      status:            'published',
      caption:           params.caption ?? captionForMime(mimeType),
      source_channel:    'whatsapp',
      source_message_id: originalName,
      source_timestamp:  file.mtime.toISOString(),
    });
    uploaded.push(record);
  }

  return {
    ok: true,
    inbound_dir: inboundDir,
    scanned_count: files.length,
    already_present_count: skipped.filter((item) => item.reason === 'already_uploaded').length,
    uploaded_count: uploaded.length,
    skipped_count: skipped.length,
    total_media_count_after: existing.length + uploaded.length,
    uploaded,
    skipped,
    summary: `Revisadas ${files.length} fotos/videos del ${params.date}. Importadas ${uploaded.length}. Total vinculado: ${existing.length + uploaded.length}.`,
  };
}

async function resolveInboundDir(explicitDir) {
  const candidates = explicitDir ? [explicitDir, ...DEFAULT_INBOUND_DIRS] : DEFAULT_INBOUND_DIRS;
  for (const candidate of candidates) {
    try {
      const stat = await fs.stat(candidate);
      if (stat.isDirectory()) return candidate;
    } catch {
      // Try next candidate.
    }
  }
  throw new Error('No se encontro la carpeta inbound de WhatsApp');
}

async function filesForDate(inboundDir, date) {
  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  const entries = await fs.readdir(inboundDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const filePath = path.join(inboundDir, entry.name);
    const ext = path.extname(entry.name).toLowerCase();
    if (!MIME_BY_EXT[ext]) continue;

    const stat = await fs.stat(filePath);
    if (stat.mtime >= start && stat.mtime < end) {
      files.push({ path: filePath, mtime: stat.mtime });
    }
  }

  files.sort((a, b) => a.mtime - b.mtime);
  return files;
}

function captionForMime(mimeType) {
  if (mimeType.startsWith('image/')) return 'Foto del día';
  if (mimeType.startsWith('video/')) return 'Vídeo del día';
  return 'Recuerdo del día';
}
