import { NextResponse, type NextRequest } from 'next/server';

/**
 * Protege las rutas privadas: /drafts, /day, /inbox.
 * El feed público (/feed) y la raíz quedan abiertos.
 *
 * Mecanismo: cookie 'diary_auth' = HMAC del PRIVATE_TOKEN.
 * El usuario introduce el PIN en /login y queda recordado.
 */

const PRIVATE_PATHS = ['/drafts', '/day', '/inbox'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPrivate = PRIVATE_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  );

  if (!isPrivate) return NextResponse.next();

  const cookie  = req.cookies.get('diary_auth')?.value;
  const expected = process.env.PRIVATE_TOKEN;

  if (!expected) {
    // Si no hay token configurado, no protejas nada (modo dev)
    return NextResponse.next();
  }

  if (cookie === expected) return NextResponse.next();

  // Redirigir a /login conservando la ruta original
  const url = req.nextUrl.clone();
  url.pathname = '/login';
  url.searchParams.set('next', pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/drafts/:path*', '/day/:path*', '/inbox/:path*'],
};
