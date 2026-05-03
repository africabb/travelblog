import { fetchFeed }  from '@/lib/api';
import MediaGrid       from '@/components/MediaGrid';
import Link            from 'next/link';
import Image           from 'next/image';
import { notFound }    from 'next/navigation';
import type { Entry } from '@/lib/types';

export const dynamic = 'force-dynamic';

const PLACE_EMOJI: Record<string, string> = {
  restaurant: '🍜',
  temple:     '⛩️',
  park:       '🌳',
  museum:     '🏛️',
  shop:       '🛍️',
  other:      '📍',
};

/* ─── Page ──────────────────────────────────────────────── */
export default async function PublicDayPage({
  params,
}: {
  params: { date: string };
}) {
  const { date } = params;

  let entries: Entry[] = [];
  try {
    const feed = await fetchFeed(50, 0, date);
    entries = feed.entries;
  } catch {
    notFound();
  }

  if (entries.length === 0) notFound();

  /* meta */
  const dateLabel = new Date(date + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const cities    = [...new Set(entries.map((e) => e.city).filter(Boolean))];
  const dayNumber = entries.find((e) => e.day_number)?.day_number;
  const allPhotos = entries.flatMap((e) => e.media?.filter((m) => m.type === 'photo') ?? []);

  /* unique places across all entries of the day */
  const placesMap: Record<string, Entry['places'][number]> = {};
  for (const e of entries) {
    for (const p of (e.places ?? [])) placesMap[p.id] = p;
  }
  const allPlaces = Object.values(placesMap);

  const heroCover = allPhotos[0];
  const hasHero   = !!heroCover;

  return (
    <div className="min-h-screen bg-cream">

      {/* ══════════════════════════════════════════
          HERO — photo or plain
      ══════════════════════════════════════════ */}
      <div className="relative">

        {hasHero ? (
          /* Photo hero */
          <>
            <div className="relative h-64 sm:h-[22rem] overflow-hidden bg-stone-200">
              <Image
                src={heroCover.url}
                alt={dateLabel}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              {/* dark overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(28,25,23,0.82) 0%, rgba(28,25,23,0.15) 55%, transparent 100%)',
                }}
              />

              {/* text over photo */}
              <div className="absolute bottom-0 inset-x-0 px-5 pb-6 sm:px-8">
                {dayNumber != null && (
                  <p className="text-gold text-[10px] tracking-[.35em] uppercase
                                font-semibold mb-1.5">
                    Día {dayNumber}
                  </p>
                )}
                <h1
                  className="font-serif font-bold text-white capitalize leading-tight"
                  style={{ fontSize: 'clamp(1.5rem, 6vw, 2.2rem)' }}
                >
                  {dateLabel}
                </h1>
                {cities.length > 0 && (
                  <p className="text-white/65 text-sm mt-1">
                    📍 {cities.join(' · ')}
                  </p>
                )}
              </div>
            </div>

            {/* Back nav — floated on top of photo */}
            <div className="absolute top-0 inset-x-0 flex items-center px-4 h-14 z-10">
              <Link
                href="/feed"
                className="flex items-center gap-1.5 text-sm font-medium
                           text-white/75 hover:text-white transition-colors"
              >
                ← Volver
              </Link>
            </div>
          </>
        ) : (
          /* Plain header */
          <div className="bg-cream pt-5 pb-0">
            <div className="flex items-center px-4 h-12">
              <Link
                href="/feed"
                className="flex items-center gap-1.5 text-sm font-medium
                           text-ink-soft hover:text-ink transition-colors"
              >
                ← Volver
              </Link>
            </div>
            <div className="px-5 pt-4 pb-8">
              {dayNumber != null && (
                <p className="text-gold text-[10px] tracking-[.35em] uppercase
                              font-semibold mb-2">
                  Día {dayNumber}
                </p>
              )}
              <h1
                className="font-serif font-bold text-ink capitalize leading-tight"
                style={{ fontSize: 'clamp(1.6rem, 7vw, 2.4rem)' }}
              >
                {dateLabel}
              </h1>
              {cities.length > 0 && (
                <p className="text-ink-soft text-sm mt-1">📍 {cities.join(' · ')}</p>
              )}
            </div>
          </div>
        )}
      </div>


      {/* ══════════════════════════════════════════
          CONTENT
      ══════════════════════════════════════════ */}
      <main className="max-w-2xl mx-auto px-4 pt-8 pb-28">

        {/* Quick stats */}
        <div
          className="flex items-center gap-3 text-xs text-ink-soft
                     mb-8 pb-6 border-b border-black/8"
        >
          <span>{entries.length} entrada{entries.length !== 1 ? 's' : ''}</span>
          {allPhotos.length > 0 && (
            <>
              <span className="text-black/20">·</span>
              <span>{allPhotos.length} foto{allPhotos.length !== 1 ? 's' : ''}</span>
            </>
          )}
          {allPlaces.length > 0 && (
            <>
              <span className="text-black/20">·</span>
              <span>{allPlaces.length} lugar{allPlaces.length !== 1 ? 'es' : ''}</span>
            </>
          )}
        </div>


        {/* ── Entries ── */}
        <div className="flex flex-col gap-0">
          {entries.map((entry, idx) => (
            <article key={entry.id}>

              {/* thin divider between entries */}
              {idx > 0 && (
                <div className="flex items-center gap-3 my-10">
                  <div className="flex-1 h-px bg-black/8" />
                  <span className="text-gold/40 text-xs" aria-hidden>✦</span>
                  <div className="flex-1 h-px bg-black/8" />
                </div>
              )}

              {/* mood / tag */}
              {(entry.mood || (entry.tags?.length ?? 0) > 0) && (
                <p className="text-gold text-[10px] tracking-[.32em]
                              uppercase font-semibold mb-3">
                  {entry.mood ?? entry.tags[0]}
                </p>
              )}

              {/* title */}
              <h2
                className="font-serif font-bold text-ink leading-tight mb-1"
                style={{ fontSize: 'clamp(1.35rem, 5.5vw, 1.9rem)' }}
              >
                {entry.title}
              </h2>

              {/* location */}
              {entry.location && (
                <p className="text-sm text-ink-soft mb-5">📍 {entry.location}</p>
              )}

              {/* media — bleed to edges on mobile */}
              {(entry.media?.length ?? 0) > 0 && (
                <div className="mb-6 -mx-4 sm:mx-0 sm:rounded-2xl overflow-hidden">
                  <MediaGrid media={entry.media} />
                </div>
              )}

              {/* body — one paragraph at a time */}
              {entry.body && (
                <div className="space-y-4">
                  {entry.body
                    .split('\n')
                    .filter(Boolean)
                    .map((para, i) => (
                      <p
                        key={i}
                        className="text-[15px] text-ink-soft leading-[1.8]"
                      >
                        {para}
                      </p>
                    ))}
                </div>
              )}

              {/* place chips for this entry */}
              {(entry.places?.length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-5">
                  {entry.places!.map((p) => (
                    <span
                      key={p.id}
                      className="inline-flex items-center gap-1.5 text-xs font-medium
                                 bg-sakura-soft text-red-deep
                                 px-3 py-1.5 rounded-full"
                    >
                      {PLACE_EMOJI[p.type] ?? '📍'} {p.name}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>


        {/* ── All places of the day ── */}
        {allPlaces.length > 0 && (
          <section className="mt-14 pt-8 border-t border-black/8">
            <p
              className="text-[10px] tracking-[.38em] uppercase
                         text-gold font-semibold mb-5"
            >
              Lugares del día
            </p>
            <div className="grid grid-cols-1 gap-3">
              {allPlaces.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-4 bg-white
                             rounded-2xl p-4 border border-black/5
                             shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
                >
                  <span className="text-2xl shrink-0 leading-none">
                    {PLACE_EMOJI[p.type] ?? '📍'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <p className="font-serif font-semibold text-ink truncate">
                        {p.name}
                      </p>
                      {p.name_jp && (
                        <span className="text-xs text-ink-soft font-serif italic shrink-0">
                          {p.name_jp}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-0.5 text-xs text-ink-soft">
                      {p.city        && <span>{p.city}</span>}
                      {p.category    && <span>· {p.category}</span>}
                      {p.price_range && <span>· {p.price_range}</span>}
                    </div>
                    {p.description && (
                      <p className="text-xs text-ink-soft/70 mt-1 line-clamp-2">
                        {p.description}
                      </p>
                    )}
                  </div>
                  {p.rating != null && (
                    <span className="text-gold font-bold text-sm shrink-0">
                      ★{p.rating}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}


        {/* ── Navigation ── */}
        <div
          className="flex justify-center mt-14 pt-8
                     border-t border-black/8"
        >
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 text-sm font-medium
                       text-red/60 hover:text-red transition-colors"
          >
            ← Volver al diario
          </Link>
        </div>
      </main>


      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="border-t border-black/6 bg-paper py-10">
        <div className="text-center">
          <p className="font-serif text-3xl font-bold text-red">旅</p>
          <p className="text-xs text-ink-soft/45 mt-1 tracking-wide">
            Mi Diario de Japón · 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
