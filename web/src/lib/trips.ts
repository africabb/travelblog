import type { DynamicTripConfig } from '@/components/DynamicTrip';

export const JAPAN_TRIP: DynamicTripConfig = {
  title: 'Japón',
  subtitle: 'Miguel & África',
  eyebrow: 'Primavera 2026',
  description: 'Templos, ramen, cerezos y recuerdos guardados por Bert.',
  basePath: '/feed',
  filters: { city: 'Japón' },
  fallbackCover: 'https://media.hustlegotreal.com/affymiguelpalma.webp',
  accent: '#7EC8E3',
  footer: 'Japón · Primavera 2026',
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
    fallbackCover: 'https://media.hustlegotreal.com/affymiguelpalma.webp',
    accent: '#7EC8E3',
    footer: `${title} · M&A Travels`,
  };
}
