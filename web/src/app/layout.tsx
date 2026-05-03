import type { Metadata, Viewport } from 'next';
import { Fraunces, DM_Sans }       from 'next/font/google';
import './globals.css';

/* ─── Fonts ─────────────────────────────────────────────── */
const fraunces = Fraunces({
  subsets:  ['latin'],
  variable: '--font-fraunces',
  display:  'swap',
  weight:   ['300', '400', '600', '700'],
  style:    ['normal', 'italic'],
});

const dmSans = DM_Sans({
  subsets:  ['latin'],
  variable: '--font-dm-sans',
  display:  'swap',
  weight:   ['300', '400', '500', '600', '700'],
});

/* ─── Metadata ───────────────────────────────────────────── */
export const metadata: Metadata = {
  title:       'Miguel & África · Diarios de Viaje',
  description: 'Blog de viajes, gastronomía y fotografía. Todo escrito por Bert, nuestra asistente de WhatsApp.',
  manifest:    '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'M&A Travels' },
  icons: {
    icon:    [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple:   '/icon.svg',
    shortcut: '/icon.svg',
  },
};

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor:   '#FAFAF8',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${fraunces.variable} ${dmSans.variable} min-h-screen bg-cream`}>
        {children}
      </body>
    </html>
  );
}
