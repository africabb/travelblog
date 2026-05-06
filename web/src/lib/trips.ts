import type { DynamicTripConfig } from '@/components/DynamicTrip';

export const JAPAN_TRIP: DynamicTripConfig = {
  title: 'Japón',
  subtitle: 'Miguel & África',
  eyebrow: 'Primavera 2026',
  description: 'Templos, ramen, cerezos y recuerdos guardados por Bert.',
  basePath: '/feed',
  filters: { excludeCity: 'Palma de Mallorca' },
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
