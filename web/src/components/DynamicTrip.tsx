import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CalendarDays, Camera, MapPin, Utensils } from 'lucide-react';
import { fetchFeed } from '@/lib/api';
import MediaGrid from '@/components/MediaGrid';
import type { Entry, Place } from '@/lib/types';

type TripFilters = {
  city?: string;
  excludeCity?: string;
  citySlug?: string;
};

export type DynamicTripConfig = {
  title: string;
  subtitle: string;
  eyebrow: string;
  description: string;
  basePath: string;
  filters: TripFilters;
  fallbackCover: string;
  accent: string;
  footer: string;
};

type DayGroup = {
  date: string;
  entries: Entry[];
  dayNumber: number;
};

export async function DynamicTripPage({ config }: { config: DynamicTripConfig }) {
  const feed = await fetchFeed(100, 0, undefined, apiFilters(config.filters)).catch(() => ({
    entries: [],
    total: 0,
    limit: 100,
    offset: 0,
  }));

  const entries = filterEntriesBySlug(feed.entries, config.filters.citySlug);
  const days = groupByDate(entries);
  const photos = entries.flatMap((entry) => entry.media?.filter((media) => media.type === 'photo') ?? []);
  const places = uniquePlaces(entries.flatMap((entry) => entry.places ?? []));
  const restaurants = places.filter(isRestaurantLike);
  const cover = photos[0]?.url ?? config.fallbackCover;
  const restaurantStat = restaurants.length || places.length;
  const summary = buildSummary(entries);

  return (
    <div className="min-h-screen bg-cream">
      <TripHero
        config={config}
        cover={cover}
        days={days.length}
        restaurants={restaurantStat}
        photos={photos.length}
      />

      <main className="max-w-5xl mx-auto px-4 pt-14 pb-28">
        {entries.length === 0 ? (
          <EmptyTrip />
        ) : (
          <>
            <TripSummary groups={summary} accent={config.accent} />

            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-4 mb-10">
                <span className="text-[10px] tracking-label uppercase font-medium text-ink-soft">
                  Días · en orden cronológico
                </span>
                <div className="flex-1 h-px bg-black/8" />
              </div>

              {days.map((day, idx) => (
                <div key={day.date}>
                  <DayCard day={day} config={config} accent={config.accent} />
                  {idx < days.length - 1 && <TimelineConnector accent={config.accent} />}
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <TripFooter config={config} />
    </div>
  );
}

export async function DynamicTripDayPage({
  config,
  date,
}: {
  config: DynamicTripConfig;
  date: string;
}) {
  let entries: Entry[] = [];
  const normalizedDate = datePath(date);
  try {
    const feed = await fetchFeed(50, 0, normalizedDate, apiFilters(config.filters));
    entries = filterEntriesBySlug(feed.entries, config.filters.citySlug);
  } catch {
    notFound();
  }

  if (!entries.length) notFound();

  const dayNumber = getDayNumber(entries, 0);
  const dateLabel = formatDate(normalizedDate, true);
  const cities = [...new Set(entries.map((entry) => entry.city).filter(Boolean))];
  const photos = entries.flatMap((entry) => entry.media?.filter((media) => media.type === 'photo') ?? []);
  const places = uniquePlaces(entries.flatMap((entry) => entry.places ?? []));
  const cover = photos[0]?.url;

  return (
    <div className="min-h-screen bg-cream">
      <section className="relative h-[46vh] min-h-[320px] flex flex-col overflow-hidden bg-[#0D1B2A]">
        {cover ? (
          <Image
            src={cover}
            alt={dateLabel}
            fill
            className="object-cover opacity-45"
            sizes="100vw"
            priority
          />
        ) : (
          <Image
            src={config.fallbackCover}
            alt={config.title}
            fill
            className="object-cover opacity-35"
            sizes="100vw"
            priority
            unoptimized
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A]/55 via-[#0D1B2A]/10 to-[#0D1B2A]" />

        <div className="relative z-10 flex items-center justify-between px-5 pt-5">
          <Link href={config.basePath} className="font-sans text-xs text-white/70 hover:text-white transition-colors">
            ← Volver a {config.title}
          </Link>
          <Link
            href="/login"
            className="font-sans text-xs text-white/55 hover:text-white border border-white/20 px-3 py-1 rounded-full transition-colors"
          >
            Entrar
          </Link>
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">
          <p className="font-sans text-[10px] tracking-label uppercase font-medium mb-4" style={{ color: config.accent }}>
            Día {dayNumber}
          </p>
          <h1 className="font-display font-bold text-white leading-[0.9] text-display-md">
            {dateLabel}
          </h1>
          {cities.length > 0 && (
            <p className="font-sans text-white/65 text-sm leading-relaxed max-w-xs mx-auto mt-4">
              {cities.join(' · ')}
            </p>
          )}
        </div>
      </section>

      <main className="max-w-2xl mx-auto px-4 pt-10 pb-28">
        <div className="flex flex-wrap items-center gap-3 text-xs text-ink-soft mb-8 pb-6 border-b border-black/8">
          <span>{entries.length} entrada{entries.length !== 1 ? 's' : ''}</span>
          <span className="text-black/20">·</span>
          <span>{photos.length} foto{photos.length !== 1 ? 's' : ''}</span>
          <span className="text-black/20">·</span>
          <span>{places.length} lugar{places.length !== 1 ? 'es' : ''}</span>
        </div>

        <div className="flex flex-col gap-0">
          {entries.map((entry, idx) => (
            <article key={entry.id}>
              {idx > 0 && <ArticleDivider accent={config.accent} />}
              {(entry.mood || (entry.tags?.length ?? 0) > 0) && (
                <p className="text-[10px] tracking-[.32em] uppercase font-semibold mb-3" style={{ color: config.accent }}>
                  {entry.mood ?? entry.tags[0]}
                </p>
              )}
              <h2 className="font-serif font-bold text-ink leading-tight mb-1 text-3xl">
                {entry.title}
              </h2>
              {entry.location && <p className="text-sm text-ink-soft mb-5">{entry.location}</p>}
              {(entry.media?.length ?? 0) > 0 && (
                <div className="mb-6 -mx-4 sm:mx-0 sm:rounded-2xl overflow-hidden">
                  <MediaGrid media={entry.media} />
                </div>
              )}
              {entry.body && (
                <div className="space-y-4">
                  {entry.body.split('\n').filter(Boolean).map((paragraph, i) => (
                    <p key={i} className="text-[15px] text-ink-soft leading-[1.8]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
              {(entry.places?.length ?? 0) > 0 && <EntryPlaces places={entry.places} accent={config.accent} />}
            </article>
          ))}
        </div>

        {places.length > 0 && (
          <section className="mt-14 pt-8 border-t border-black/8">
            <p className="text-[10px] tracking-[.38em] uppercase text-ink-soft font-semibold mb-5">
              Restaurantes y lugares
            </p>
            <div className="grid grid-cols-1 gap-3">
              {places.map((place) => (
                <PlaceRow key={place.id} place={place} accent={config.accent} />
              ))}
            </div>
          </section>
        )}

        <div className="flex justify-center mt-14 pt-8 border-t border-black/8">
          <Link href={config.basePath} className="inline-flex items-center gap-2 text-sm font-medium hover:underline" style={{ color: config.accent }}>
            ← Volver al viaje
          </Link>
        </div>
      </main>

      <TripFooter config={config} />
    </div>
  );
}

export async function generateTripDayMetadata({
  config,
  date,
}: {
  config: DynamicTripConfig;
  date: string;
}): Promise<Metadata> {
  const siteUrl = getSiteUrl();
  const fallbackImage = absoluteUrl(config.fallbackCover, siteUrl);
  const normalizedDate = datePath(date);

  try {
    const feed = await fetchFeed(50, 0, normalizedDate, apiFilters(config.filters));
    const entries = filterEntriesBySlug(feed.entries, config.filters.citySlug);
    const firstEntry = entries[0];

    if (!firstEntry) {
      return {
        title: `${config.title} · ${formatDate(normalizedDate, true)}`,
        description: config.description,
        openGraph: {
          title: `${config.title} · ${formatDate(normalizedDate, true)}`,
          description: config.description,
          url: absoluteUrl(`${config.basePath}/${normalizedDate}`, siteUrl),
          images: [{ url: fallbackImage }],
        },
      };
    }

    const dayNumber = getDayNumber(entries, 0);
    const title = firstEntry.title
      ? `${firstEntry.title} · Dia ${dayNumber}`
      : `${config.title} · Dia ${dayNumber}`;
    const description = excerpt(entries.map((entry) => entry.body).join(' '), config.description);
    const image = absoluteUrl(
      entries
        .flatMap((entry) => entry.media?.filter((media) => media.type === 'photo') ?? [])
        .find(Boolean)?.url ?? config.fallbackCover,
      siteUrl,
    );
    const url = absoluteUrl(`${config.basePath}/${normalizedDate}`, siteUrl);

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        type: 'article',
        siteName: 'Miguel & Africa',
        publishedTime: firstEntry.date,
        images: [
          {
            url: image,
            alt: firstEntry.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
    };
  } catch {
    return {
      title: `${config.title} · ${formatDate(normalizedDate, true)}`,
      description: config.description,
      openGraph: {
        title: `${config.title} · ${formatDate(normalizedDate, true)}`,
        description: config.description,
        url: absoluteUrl(`${config.basePath}/${normalizedDate}`, siteUrl),
        images: [{ url: fallbackImage }],
      },
    };
  }
}

function TripHero({
  config,
  cover,
  days,
  restaurants,
  photos,
}: {
  config: DynamicTripConfig;
  cover: string;
  days: number;
  restaurants: number;
  photos: number;
}) {
  return (
    <section className="relative h-[60vh] min-h-[400px] flex flex-col overflow-hidden bg-[#0D1B2A]">
      <div className="absolute inset-0">
        <Image
          src={cover}
          alt={config.title}
          fill
          className="object-cover opacity-35"
          sizes="100vw"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A]/50 via-transparent to-[#0D1B2A]" />
      </div>

      <div className="relative z-10 flex items-center justify-between px-5 pt-5">
        <Link href="/" className="font-sans text-xs text-white/60 hover:text-white transition-colors">
          ← M&amp;A Travels
        </Link>
        <Link
          href="/login"
          className="font-sans text-xs text-white/50 hover:text-white border border-white/20 px-3 py-1 rounded-full transition-colors"
        >
          Entrar
        </Link>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">
        <p className="font-sans text-[10px] tracking-label uppercase font-medium mb-5" style={{ color: config.accent }}>
          {config.eyebrow}
        </p>
        <h1 className="font-display font-bold text-white leading-[0.88]">
          <span className="block text-display-lg">{config.title}</span>
          <span className="block italic text-display-md mt-2" style={{ color: config.accent }}>
            {config.subtitle}
          </span>
        </h1>
        <p className="font-sans text-white/60 text-sm leading-relaxed max-w-xs mx-auto mt-5">
          {config.description}
        </p>

        <div className="flex items-center justify-center gap-6 mt-7">
          <HeroStat n={days} label="días" />
          <HeroStat n={restaurants} label="restaurantes" />
          <HeroStat n={photos} label="fotos" />
        </div>
      </div>
    </section>
  );
}

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://japon.amurasoftware.com').replace(/\/$/, '');
}

function apiFilters(filters: TripFilters) {
  const { citySlug, ...rest } = filters;
  return rest;
}

function filterEntriesBySlug(entries: Entry[], citySlug?: string) {
  if (!citySlug) return entries;
  return entries.filter((entry) => slugifyForRoute(entry.city ?? '') === citySlug);
}

function slugifyForRoute(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' y ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function datePath(value: string) {
  const match = decodeURIComponent(value).match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : value;
}

function absoluteUrl(url: string, siteUrl: string) {
  if (/^http:\/\/204\.168\.146\.128:3001\/uploads\//i.test(url)) {
    return url.replace(/^http:\/\/204\.168\.146\.128:3001/i, siteUrl);
  }
  if (/^https?:\/\//i.test(url)) return url;
  return `${siteUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

function excerpt(text: string | null | undefined, fallback: string) {
  const clean = (text ?? '').replace(/\s+/g, ' ').trim();
  if (!clean) return fallback;
  return clean.length > 155 ? `${clean.slice(0, 152).trim()}...` : clean;
}

function TripSummary({
  groups,
  accent,
}: {
  groups: ReturnType<typeof buildSummary>;
  accent: string;
}) {
  if (!groups.length) return null;

  return (
    <section className="mb-16 border-y border-black/[0.07] py-10">
      <div className="flex items-center gap-4 mb-8">
        <span className="text-[10px] tracking-label uppercase font-medium text-ink-soft">
          Resumen del viaje
        </span>
        <div className="flex-1 h-px bg-black/8" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 sm:gap-5 mb-5">
        <span className="hidden sm:block" />
        <SectionTitle icon="restaurant" title="Restaurantes" accent={accent} />
        <SectionTitle icon="place" title="Lugares" accent={accent} />
      </div>

      <div className="divide-y divide-black/[0.06]">
        {groups.map((group) => (
          <div
            key={group.name}
            className="grid grid-cols-1 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 sm:gap-5 py-5 sm:py-4 first:pt-0 last:pb-0"
          >
            <h3 className="font-display font-bold text-ink text-lg leading-tight">{group.name}</h3>
            <ReferenceList title="Restaurantes" items={group.restaurants} empty="-" accent={accent} />
            <ReferenceList title="Lugares" items={group.places} empty="-" accent={accent} />
          </div>
        ))}
      </div>
    </section>
  );
}

function DayCard({
  day,
  config,
  accent,
}: {
  day: DayGroup;
  config: DynamicTripConfig;
  accent: string;
}) {
  const entry = day.entries[0];
  const photos = day.entries.flatMap((item) => item.media?.filter((media) => media.type === 'photo') ?? []);
  const cover = photos[0];
  const preview = day.entries
    .map((item) => item.body)
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);

  return (
    <Link href={`${config.basePath}/${day.date}`} className="group block">
      <article className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.13)] transition-all duration-300">
        <div className="flex">
          <div className="relative w-[120px] sm:w-[160px] shrink-0 bg-stone-100">
            {cover ? (
              <Image
                src={cover.url}
                alt={entry.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                sizes="160px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-stone-100">
                <CalendarDays size={28} className="text-black/25" strokeWidth={1.4} />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: accent }}>
                <span className="font-display font-bold text-white text-[10px] leading-none">
                  {String(day.dayNumber).padStart(2, '0')}
                </span>
              </span>
              <span className="font-sans text-[10px] tracking-[.28em] uppercase font-semibold" style={{ color: accent }}>
                Día {day.dayNumber}
              </span>
            </div>

            <h2 className="font-display font-bold text-ink leading-tight mb-1 group-hover:opacity-80 transition-opacity text-xl">
              {entry.title}
            </h2>
            <p className="font-sans text-[11px] text-ink-soft mb-2">{formatDate(day.date)}</p>
            {preview && (
              <p className="font-sans text-sm text-ink-soft leading-relaxed line-clamp-2 hidden sm:block">
                {preview}{preview.length >= 160 ? '...' : ''}
              </p>
            )}
            <p className="font-sans text-xs font-medium mt-3 transition-colors" style={{ color: accent }}>
              Leer día →
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}

function ReferenceList({
  title,
  items,
  empty,
  accent,
}: {
  title: string;
  items: Place[];
  empty: string;
  accent: string;
}) {
  return (
    <div className="rounded-md bg-white/55 px-3 py-2 sm:bg-transparent sm:p-0">
      <p className="mb-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] sm:hidden" style={{ color: accent }}>
        {title}
      </p>
      {items.length ? (
        <ul className="space-y-1.5">
          {items.map((item) => (
            <SummaryItem key={item.id} item={item} accent={accent} />
          ))}
        </ul>
      ) : (
        <p className="font-sans text-sm text-ink-muted leading-relaxed">{empty}</p>
      )}
    </div>
  );
}

function SummaryItem({ item, accent }: { item: Place; accent: string }) {
  return (
    <li className="font-sans text-sm text-ink-soft leading-relaxed flex gap-2">
      <span className="mt-[0.62em] h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: accent }} />
      <span>
        {item.name}
        <ExternalLinks place={item} accent={accent} />
      </span>
    </li>
  );
}

function EntryPlaces({ places, accent }: { places: Place[]; accent: string }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-5">
      {places.map((place) => (
        <span key={place.id} className="inline-flex items-center gap-1.5 text-xs font-medium bg-white text-ink-soft px-3 py-1.5 rounded-full border border-black/8">
          <MapPin size={10} strokeWidth={1.8} style={{ color: accent }} />
          {place.name}
          <ExternalLinks place={place} accent={accent} compact />
        </span>
      ))}
    </div>
  );
}

function PlaceRow({ place, accent }: { place: Place; accent: string }) {
  return (
    <div className="flex items-start gap-4 bg-white rounded-2xl p-4 border border-black/5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
      <span className="text-xl shrink-0 leading-none">
        {isRestaurantLike(place) ? <Utensils size={18} style={{ color: accent }} /> : <MapPin size={18} style={{ color: accent }} />}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-serif font-semibold text-ink">{place.name}</p>
        <div className="flex flex-wrap gap-2 mt-0.5 text-xs text-ink-soft">
          {place.city && <span>{place.city}</span>}
          {place.category && <span>· {place.category}</span>}
          {place.price_range && <span>· {place.price_range}</span>}
        </div>
        {place.description && <p className="text-xs text-ink-soft/70 mt-1 line-clamp-2">{place.description}</p>}
        <ExternalLinks place={place} accent={accent} />
      </div>
      {place.rating != null && <span className="text-gold font-bold text-sm shrink-0">★{place.rating}</span>}
    </div>
  );
}

function ExternalLinks({ place, accent, compact = false }: { place: Place; accent: string; compact?: boolean }) {
  if (!place.google_maps_url && !place.official_url) return null;

  return (
    <span className={compact ? 'ml-1 inline-flex gap-1' : 'mt-2 flex flex-wrap gap-2 text-xs'}>
      {place.google_maps_url && (
        <a href={place.google_maps_url} target="_blank" rel="noreferrer" className="font-medium hover:underline" style={{ color: accent }}>
          Maps
        </a>
      )}
      {place.official_url && (
        <a href={place.official_url} target="_blank" rel="noreferrer" className="font-medium hover:underline" style={{ color: accent }}>
          Web oficial
        </a>
      )}
    </span>
  );
}

function SectionTitle({
  icon,
  title,
  accent,
}: {
  icon: 'restaurant' | 'place';
  title: string;
  accent: string;
}) {
  const Icon = icon === 'restaurant' ? Utensils : MapPin;
  return (
    <div className="hidden sm:flex items-center gap-2">
      <Icon size={16} strokeWidth={1.7} style={{ color: accent }} />
      <h2 className="font-display font-bold text-ink text-xl leading-tight">{title}</h2>
    </div>
  );
}

function HeroStat({ n, label }: { n: number; label: string }) {
  return (
    <div className="text-center">
      <p className="font-display font-bold text-white text-2xl leading-none">{n}</p>
      <p className="font-sans text-[10px] text-white/40 uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}

function TimelineConnector({ accent }: { accent: string }) {
  return (
    <div className="flex flex-col items-center py-1">
      <div className="w-px h-5 opacity-20" style={{ backgroundColor: accent }} />
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: accent, opacity: 0.3 }}>
        <path d="M10 3v11M5 10l5 7 5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="w-px h-5 opacity-20" style={{ backgroundColor: accent }} />
    </div>
  );
}

function ArticleDivider({ accent }: { accent: string }) {
  return (
    <div className="flex items-center gap-3 my-10">
      <div className="flex-1 h-px bg-black/8" />
      <span className="text-xs" style={{ color: accent, opacity: 0.45 }} aria-hidden>
        ✦
      </span>
      <div className="flex-1 h-px bg-black/8" />
    </div>
  );
}

function TripFooter({ config }: { config: DynamicTripConfig }) {
  return (
    <footer className="border-t border-black/[0.06] bg-white">
      <div className="max-w-2xl mx-auto px-5 py-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display font-bold text-ink">Miguel &amp; África</p>
            <p className="font-sans text-xs text-ink-soft mt-0.5">{config.footer}</p>
          </div>
          <Link href="/" className="font-sans text-xs text-ink-soft hover:text-ink transition-colors">
            ← Todos los viajes
          </Link>
        </div>
      </div>
    </footer>
  );
}

function EmptyTrip() {
  return (
    <div className="text-center py-28">
      <p className="font-display text-2xl text-ink mb-2">El diario está en camino</p>
      <p className="font-sans text-sm text-ink-soft max-w-xs mx-auto leading-relaxed">
        Las entradas aparecerán aquí en cuanto se publiquen.
      </p>
    </div>
  );
}

function groupByDate(entries: Entry[]): DayGroup[] {
  const map = new Map<string, Entry[]>();
  entries.forEach((entry) => {
    const key = dateKey(entry.date);
    map.set(key, [...(map.get(key) ?? []), entry]);
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, dayEntries], index) => ({
      date,
      entries: dayEntries,
      dayNumber: getDayNumber(dayEntries, index),
    }));
}

function getDayNumber(entries: Entry[], index: number) {
  const explicitDay = entries.find((entry) => entry.day_number != null)?.day_number;
  return explicitDay && explicitDay > 0 ? explicitDay : index + 1;
}

function dateKey(value: string) {
  return value.includes('T') ? value.slice(0, 10) : value;
}

function formatDate(iso: string, withYear = false) {
  return new Date(dateKey(iso) + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    ...(withYear ? { year: 'numeric' as const } : {}),
  });
}

function uniquePlaces(places: Place[]) {
  const map = new Map<string, Place>();
  places.forEach((place) => {
    if (!map.has(place.id)) map.set(place.id, place);
  });
  return Array.from(map.values());
}

function isRestaurantLike(place: Place) {
  const text = `${place.type} ${place.category ?? ''} ${place.description ?? ''}`.toLowerCase();
  return text.includes('restaurant') || text.includes('restaurante') || text.includes('gastronom') || text.includes('comida');
}

function buildSummary(entries: Entry[]) {
  const groups = new Map<string, { name: string; restaurants: Place[]; places: Place[] }>();

  entries.forEach((entry) => {
    const groupName = entry.location || entry.city || 'Viaje';
    const group = groups.get(groupName) ?? { name: groupName, restaurants: [], places: [] };

    uniquePlaces(entry.places ?? []).forEach((place) => {
      const target = isRestaurantLike(place) ? group.restaurants : group.places;
      if (!target.some((item) => item.id === place.id)) target.push(place);
    });

    groups.set(groupName, group);
  });

  return Array.from(groups.values()).filter((group) => group.restaurants.length || group.places.length);
}
