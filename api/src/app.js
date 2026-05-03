import Fastify          from 'fastify';
import cors             from '@fastify/cors';
import multipart        from '@fastify/multipart';
import sensible         from '@fastify/sensible';

import authPlugin       from './plugins/auth.js';
import entriesRoutes    from './routes/entries.js';
import mediaRoutes      from './routes/media.js';
import placesRoutes     from './routes/places.js';
import draftsRoutes     from './routes/drafts.js';
import daysRoutes       from './routes/days.js';
import feedRoutes       from './routes/feed.js';

export async function buildApp(opts = {}) {
  const app = Fastify({
    logger: opts.logger ?? { level: process.env.LOG_LEVEL ?? 'info' },
  });

  // ── Core plugins ────────────────────────────────────────
  await app.register(sensible);

  await app.register(cors, {
    origin: (process.env.ALLOWED_ORIGINS ?? '*')
      .split(',')
      .map((o) => o.trim()),
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  await app.register(multipart, {
    limits: {
      fileSize: 100 * 1024 * 1024,  // 100 MB (vídeos)
      files:    1,
    },
  });

  // ── Auth ─────────────────────────────────────────────────
  await app.register(authPlugin);

  // ── Routes ──────────────────────────────────────────────
  await app.register(entriesRoutes, { prefix: '/api/entries' });
  await app.register(mediaRoutes,   { prefix: '/api/media'   });
  await app.register(placesRoutes,  { prefix: '/api/places'  });
  await app.register(draftsRoutes,  { prefix: '/api/drafts'  });
  await app.register(daysRoutes,    { prefix: '/api/days'    });
  await app.register(feedRoutes,    { prefix: '/api'         });

  // ── Health ───────────────────────────────────────────────
  app.get('/health', async () => ({ ok: true, ts: new Date().toISOString() }));

  return app;
}
