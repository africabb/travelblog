import { fetchFeed } from './api';
import type { Entry, Place } from './types';
import type { GreciaChapter, GreciaReference, GreciaSummaryGroup } from '@/data/grecia';

export const GREECE_TRIP_CITY = 'Grecia en barco';

export async function fetchGreciaDynamicChapters() {
  const feed = await fetchFeed(100, 0, undefined, { city: GREECE_TRIP_CITY }).catch(() => ({
    entries: [],
    total: 0,
    limit: 100,
    offset: 0,
  }));

  return feed.entries
    .filter((entry) => entry.status === 'published')
    .map(entryToChapter)
    .sort((a, b) => a.num - b.num || dateOrder(a.date) - dateOrder(b.date));
}

export function mergeGreciaChapters(staticChapters: GreciaChapter[], dynamicChapters: GreciaChapter[]) {
  const byNumber = new Map<number, GreciaChapter>();
  staticChapters.forEach((chapter) => byNumber.set(chapter.num, chapter));
  dynamicChapters.forEach((chapter) => byNumber.set(chapter.num, chapter));
  return Array.from(byNumber.values()).sort((a, b) => a.num - b.num);
}

function entryToChapter(entry: Entry): GreciaChapter {
  const restaurants = entry.places.filter(isRestaurant).map(placeToReference);
  const places = entry.places.filter((place) => !isRestaurant(place)).map(placeToReference);
  const fallbackPlace = entry.location ? [{ name: entry.location }] : [];
  const groupedPlaces = places.length ? places : fallbackPlace;
  const summaryGroups: GreciaSummaryGroup[] = groupedPlaces.length || restaurants.length
    ? [{
      place: groupedPlaces[0] ?? { name: GREECE_TRIP_CITY },
      restaurants,
      places: groupedPlaces,
    }]
    : [];

  return {
    num: validDayNumber(entry),
    title: entry.title,
    date: formatGreekDate(entry.date),
    restaurants,
    places: groupedPlaces,
    summaryGroups,
    text: entry.body,
    images: (entry.media ?? [])
      .filter((media) => media.type === 'photo')
      .map((media) => publicMediaUrl(media.url)),
  };
}

function validDayNumber(entry: Entry) {
  if (entry.day_number && entry.day_number > 0) return entry.day_number;

  const date = entry.date.includes('T') ? entry.date.slice(0, 10) : entry.date;
  const dateToDay: Record<string, number> = {
    '2023-07-07': 2,
    '2023-07-08': 3,
    '2023-07-09': 4,
    '2023-07-10': 5,
    '2023-07-13': 6,
    '2023-07-14': 7,
    '2023-07-15': 8,
    '2023-07-16': 9,
  };

  return dateToDay[date] ?? Math.max(1, entry.sort_order || 1);
}

function formatGreekDate(value: string) {
  const date = value.includes('T') ? value.slice(0, 10) : value;
  const [year, month, day] = date.split('-').map(Number);
  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  if (!year || !month || !day) return value;
  return `${day} ${months[month - 1]} ${year}`;
}

function dateOrder(value: string | null) {
  if (!value) return 0;
  const [day, monthName, year] = value.split(' ');
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const month = months.indexOf(monthName) + 1;
  if (!month) return 0;
  return Number(`${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`);
}

function isRestaurant(place: Place) {
  const value = `${place.type ?? ''} ${place.category ?? ''}`.toLowerCase();
  return value.includes('restaurant') || value.includes('restaurante') || value.includes('food') || value.includes('comida');
}

function placeToReference(place: Place): GreciaReference {
  return {
    name: place.name,
    mapsUrl: place.google_maps_url ?? undefined,
    officialUrl: place.official_url ?? undefined,
  };
}

function publicMediaUrl(url: string) {
  return url.replace(/^http:\/\/204\.168\.146\.128:3001/i, 'https://japon.amurasoftware.com');
}
