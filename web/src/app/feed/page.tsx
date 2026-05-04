import { fetchFeed } from '@/lib/api';
import FeedCard       from '@/components/FeedCard';
import SakuraPetals   from '@/components/SakuraPetals';
import Link           from 'next/link';
import type { Entry } from '@/lib/types';

export const dynamic = 'force-dynamic';

/* ─── helpers ──────────────────────────────────────────── */
function groupByDate(entries: Entry[]): [string, Entry[]][] {
  const map: Record<string, Entry[]> = {};
  for (const e of entries) {
    (map[dateKey(e.date)] ??= []).push(e);
  }
  // chronological order (oldest first = narrative order)
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
}

function dateKey(value: string) {
  return value.includes('T') ? value.slice(0, 10) : value;
}

function fmtDate(iso: string) {
  return new Date(dateKey(iso) + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}

/* ─── Page ──────────────────────────────────────────────── */
export default async function FeedPage({
  searchParams,
}: {
  searchParams?: { trip?: string; city?: string };
}) {
  const isPalma = searchParams?.trip === 'palma' || searchParams?.city === 'Palma de Mallorca';
  const feed = await fetchFeed(
    100,
    0,
    undefined,
    isPalma ? { city: 'Palma de Mallorca' } : { excludeCity: 'Palma de Mallorca' },
  ).catch(() => ({ entries: [], total: 0, limit: 100, offset: 0 }));

  const days = groupByDate(feed.entries);
  const places = new Set(feed.entries.flatMap((e) => e.places?.map((p) => p.id) ?? []));
  const photos = feed.entries.reduce(
    (sum, e) => sum + (e.media?.filter((m) => m.type === 'photo').length ?? 0),
    0,
  );
  const trip = isPalma
    ? {
        label: 'Palma de Mallorca',
        title: 'Diario de Palma',
        subtitle: 'Miguel & África',
        copy: 'Comida, sobremesas, casas especiales y recuerdos cerca del mar.',
        footer: 'Palma de Mallorca · 2026',
      }
    : {
        label: '日本の旅 · Primavera 2026',
        title: 'Diario de Japón',
        subtitle: 'Miguel & África',
        copy: 'Templos, ramen, cerezos y momentos irrepetibles. Dos viajeros por el corazón de Japón.',
        footer: 'Japón · Primavera 2026',
      };

  return (
    <div className="min-h-screen bg-cream">

      {/* ══════════════════════════════════════════
          HERO — full viewport
      ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        <SakuraPetals />

        {/* Decorative background kanji */}
        <span
          className="absolute -right-4 bottom-0 font-display font-black text-red
                     leading-none select-none pointer-events-none"
          style={{ fontSize: 'min(56vw, 440px)', opacity: 0.035 }}
          aria-hidden
        >
          旅
        </span>

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-5 pt-5">
          <Link
            href="/"
            className="font-sans text-xs text-ink-soft/60 hover:text-ink-soft transition-colors"
          >
            ← M&amp;A Travels
          </Link>
          <Link
            href="/login"
            className="font-sans text-xs text-ink-soft/50 hover:text-ink-soft
                       transition-colors border border-black/10 px-3 py-1 rounded-full"
          >
            Entrar
          </Link>
        </div>

        {/* Main centred content */}
        <div className="relative z-10 flex-1 flex flex-col items-center
                        justify-center text-center px-6 py-12">

          {/* Kana label */}
          <p className="font-sans text-[10px] tracking-label uppercase
                        font-medium text-gold mb-7">
            {trip.label}
          </p>

          {/* Title */}
          <h1 className="font-display font-bold text-ink leading-[0.88]">
            <span className="block text-display-lg">
              {trip.title}
            </span>
            <span className="block italic text-brand text-display-lg mt-1">
              {trip.subtitle}
            </span>
          </h1>

          {/* Tagline */}
          <p className="font-sans text-ink-soft text-sm sm:text-base leading-relaxed
                        max-w-[21rem] mx-auto mt-6 mb-8">
            {trip.copy}
          </p>

          {/* Stats */}
          {feed.entries.length > 0 && (
            <div className="flex items-end justify-center gap-6 mb-10">
              <StatBadge n={days.length}  label="días"    />
              <span className="text-black/15 pb-1 text-lg">·</span>
              <StatBadge n={places.size} label="lugares" />
              <span className="text-black/15 pb-1 text-lg">·</span>
              <StatBadge n={photos} label="fotos"   />
            </div>
          )}

          {/* Scroll CTA */}
          {feed.entries.length > 0 && (
            <a
              href="#diario"
              className="flex flex-col items-center gap-2.5 group"
            >
              <span
                className="text-[10px] tracking-[.35em] uppercase
                           text-ink-soft/50 group-hover:text-ink-soft
                           transition-colors"
              >
                Leer el diario
              </span>
              <span
                className="text-ink-soft/30 group-hover:text-ink-soft/60
                           transition-all duration-300 animate-bounce text-sm"
              >
                ↓
              </span>
            </a>
          )}
        </div>

        {/* Thin bottom separator */}
        <div className="relative z-10 px-8 pb-0">
          <DividerSakura />
        </div>
      </section>


      {/* ══════════════════════════════════════════
          FEED — timeline
      ══════════════════════════════════════════ */}
      <main id="diario" className="max-w-2xl mx-auto px-4 pt-14 pb-28">

        {feed.entries.length === 0 ? (
          <EmptyState />
        ) : (
          <div>
            {days.map(([date, entries], idx) => {
              const cities     = [...new Set(entries.map((e) => e.city).filter(Boolean))];
              const dayNumber  = entries.find((e) => e.day_number)?.day_number;
              const dateLabel  = fmtDate(date);

              return (
                <div key={date}>

                  {/* Divider between days */}
                  {idx > 0 && (
                    <div className="my-14">
                      <DividerSakura />
                    </div>
                  )}

                  <section>
                    {/* ── Day header ── */}
                    <header className="flex items-start gap-4 mb-8">
                      {/* Day number circle */}
                      {dayNumber != null ? (
                        <div
                          className="w-12 h-12 rounded-full bg-red shrink-0
                                     flex items-center justify-center
                                     shadow-lg shadow-red/25 mt-0.5"
                        >
                          <span className="font-serif font-bold text-white text-sm leading-none">
                            {String(dayNumber).padStart(2, '0')}
                          </span>
                        </div>
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-red shrink-0 mt-2.5" />
                      )}

                      {/* Day text */}
                      <div className="min-w-0">
                        {dayNumber != null && (
                          <p className="text-[10px] text-gold tracking-[.32em]
                                        uppercase font-semibold mb-0.5">
                            Día {dayNumber}
                          </p>
                        )}
                        <h2
                          className="font-display font-bold text-ink
                                     leading-tight capitalize"
                          style={{ fontSize: 'clamp(1.3rem, 5vw, 1.65rem)' }}
                        >
                          {dateLabel}
                        </h2>
                        {cities.length > 0 && (
                          <p className="text-sm text-ink-soft mt-1">
                            📍 {cities.join(' · ')}
                          </p>
                        )}
                      </div>
                    </header>

                    {/* ── Entry cards ── */}
                    <div className="flex flex-col gap-5">
                      {entries.map((entry) => (
                        <FeedCard key={entry.id} entry={entry} date={date} />
                      ))}
                    </div>

                    {/* ── Link to full day view ── */}
                    <div className="mt-5 flex justify-end">
                      <Link
                        href={`/feed/${date}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium
                                   text-red/60 hover:text-red transition-colors"
                      >
                        Ver el día completo
                        <span className="opacity-60">→</span>
                      </Link>
                    </div>
                  </section>
                </div>
              );
            })}
          </div>
        )}
      </main>


      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="border-t border-black/[0.06] bg-white">
        <div className="max-w-2xl mx-auto px-5 py-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display font-bold text-ink">Miguel &amp; África</p>
              <p className="font-sans text-xs text-ink-soft mt-0.5">{trip.footer}</p>
            </div>
            <Link href="/" className="font-sans text-xs text-ink-soft hover:text-ink transition-colors">
              ← Todos los viajes
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}


/* ─── Sub-components ────────────────────────────────────── */

function StatBadge({ n, label }: { n: number; label: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-2xl font-bold text-ink leading-none">{n}</p>
      <p className="font-sans text-[10px] text-ink-soft uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}

function DividerSakura() {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-px bg-black/8" />
      <span className="text-sakura text-base select-none" aria-hidden>✿</span>
      <div className="flex-1 h-px bg-black/8" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-28">
      <p className="text-5xl mb-5" aria-hidden>🌸</p>
      <p className="font-display text-2xl text-ink mb-2">El diario está en camino</p>
      <p className="font-sans text-sm text-ink-soft max-w-xs mx-auto leading-relaxed">
        Las entradas aparecerán aquí en cuanto se publiquen.
      </p>
    </div>
  );
}
