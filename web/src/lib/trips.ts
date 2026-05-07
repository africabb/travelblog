import type { DynamicTripConfig } from '@/components/DynamicTrip';

export const JAPAN_TRIP: DynamicTripConfig = {
  title: 'Japón',
  subtitle: 'Miguel & África',
  eyebrow: 'Primavera 2026',
  description: 'Templos, ramen, cerezos y recuerdos guardados por Bert.',
  basePath: '/feed',
  filters: { city: 'Japón' },
  fallbackCover: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1800&q=82',
  accent: '#7EC8E3',
  footer: 'Japón · Primavera 2026',
};

const TRIP_FALLBACK_COVERS: Record<string, string> = {
  ibiza: 'https://images.unsplash.com/photo-1605443796819-7f468cbd6f34?auto=format&fit=crop&w=1800&q=82',
  'la-manga': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=82',
  murcia: 'https://japon.amurasoftware.com/uploads/photos/2026-05-07/10a0ecf0-d3ef-45be-a764-9dc23d93820f..jpg',
};

export const PALMA_TRIP: DynamicTripConfig = {
  title: 'Palma de Mallorca',
  subtitle: 'Miguel & África',
  eyebrow: 'Mallorca · 2026',
  description: 'Sobremesas, amigos, comida y recuerdos cerca del mar.',
  basePath: '/palma',
  filters: { city: 'Palma de Mallorca' },
  fallbackCover: 'https://media.hustlegotreal.com/affymiguelpalma.webp',
  accent: '#7EC8E3',
  footer: 'Palma de Mallorca · 2026',
};

export function slugifyTripName(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' y ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function tripFromSlug(slug: string): DynamicTripConfig {
  const title = slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return {
    title,
    subtitle: 'Miguel & África',
    eyebrow: 'Viaje',
    description: 'Comida, fotos y recuerdos guardados por Bert.',
    basePath: `/viaje/${slugifyTripName(title)}`,
    filters: { citySlug: slug },
    fallbackCover: TRIP_FALLBACK_COVERS[slug] ?? 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=82',
    accent: '#7EC8E3',
    footer: `${title} · M&A Travels`,
  };
}
