'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const pin  = String(formData.get('pin') ?? '');
  const next = String(formData.get('next') ?? '/feed');

  const expected = process.env.PRIVATE_TOKEN;

  if (!expected || pin !== expected) {
    redirect(`/login?next=${encodeURIComponent(next)}&error=1`);
  }

  cookies().set('diary_auth', expected, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path:     '/',
    maxAge:   60 * 60 * 24 * 30,   // 30 días
  });

  redirect(next);
}

export async function logout() {
  cookies().delete('diary_auth');
  redirect('/feed');
}
