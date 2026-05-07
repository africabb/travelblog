import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

const LOCAL_MEDIA_DIR = process.env.LOCAL_MEDIA_DIR || '/home/openclaw/japonweb-media';
const USE_LOCAL_STORAGE = process.env.STORAGE_DRIVER === 'local' ||
  !process.env.S3_BUCKET ||
  !process.env.S3_ACCESS_KEY_ID ||
  !process.env.S3_SECRET_ACCESS_KEY;

const s3 = new S3Client({
  region:   process.env.S3_REGION || 'auto',
  endpoint: process.env.S3_ENDPOINT || undefined,
  credentials: {
    accessKeyId:     process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  // R2 necesita esto
  forcePathStyle: Boolean(process.env.S3_ENDPOINT),
});

const BUCKET     = process.env.S3_BUCKET;
const PUBLIC_URL = process.env.S3_PUBLIC_URL?.replace(/\/$/, '');

/**
 * Sube un buffer al bucket y devuelve { key, url }.
 * @param {Buffer} buffer
 * @param {object} opts
 * @param {'photo'|'video'|'audio'} opts.type
 * @param {string} opts.mimeType
 * @param {string} [opts.originalName]
 */
export async function uploadMedia(buffer, { type, mimeType, originalName }) {
  const ext = originalName
    ? path.extname(originalName)
    : mimeType.split('/')[1]?.replace('jpeg', 'jpg') ?? 'bin';

  const key = `${type}s/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${ext}`;

  if (USE_LOCAL_STORAGE) {
    const filePath = path.join(LOCAL_MEDIA_DIR, key);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, buffer);

    const baseUrl = PUBLIC_URL || '/uploads';
    return { key, url: `${baseUrl}/${key}` };
  }

  await s3.send(new PutObjectCommand({
    Bucket:      BUCKET,
    Key:         key,
    Body:        buffer,
    ContentType: mimeType,
  }));

  const url = `${PUBLIC_URL}/${key}`;
  return { key, url };
}

/**
 * Elimina un objeto del bucket.
 * @param {string} key
 */
export async function deleteMedia(key) {
  if (USE_LOCAL_STORAGE) {
    await fs.rm(path.join(LOCAL_MEDIA_DIR, key), { force: true });
    return;
  }

  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}
