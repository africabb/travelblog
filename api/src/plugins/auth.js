/**
 * Plugin de autenticación mínimo por API secret.
 * Bert incluye el header  Authorization: Bearer <API_SECRET>
 * en cada llamada a la API.
 *
 * Las rutas públicas (feed, stats) no requieren el header.
 */

const PUBLIC_PREFIXES = ['/api/feed', '/api/stats', '/health'];

export default async function authPlugin(app) {
  app.addHook('onRequest', async (req, reply) => {
    const isPublic = PUBLIC_PREFIXES.some((p) => req.url.startsWith(p));
    if (isPublic) return;

    const secret  = process.env.API_SECRET;
    const header  = req.headers.authorization ?? '';
    const token   = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!secret || token !== secret) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
  });
}
