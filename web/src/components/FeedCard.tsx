import Image from 'next/image';
import Link  from 'next/link';
import type { Entry, Media, Place } from '@/lib/types';

interface Props {
  entry: Entry;
  date:  string;
}

const PLACE_EMOJI: Record<string, string> = {
  restaurant: '🍜',
  temple:     '⛩️',
  park:       '🌳',
  museum:     '🏛️',
  shop:       '🛍️',
  other:      '📍',
};

/* ─── Main export ───────────────────────────────────────── */
export default function FeedCard({ entry, date }: Props) {
  const photos = entry.media?.filter((m) => m.type === 'photo') ?? [];
  const cover  = photos[0];

  return cover
    ? <PhotoCard entry={entry} date={date} cover={cover} total={photos.length} />
    : <TextCard  entry={entry} date={date} />;
}

/* ─── Card with hero photo ──────────────────────────────── */
function PhotoCard({
  entry, date, cover, total,
}: {
  entry: Entry;
  date:  string;
  cover: Media;
  total: number;
}) {
  return (
    <Link href={`/feed/${date}`} className="group block">
      <article
        className="bg-white rounded-2xl overflow-hidden
                   shadow-[0_2px_12px_rgba(0,0,0,0.07)]
                   hover:shadow-[0_8px_32px_rgba(0,0,0,0.13)]
                   transition-all duration-300"
      >
        {/* ── Photo ── */}
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
          <Image
            src={cover.url}
            alt={entry.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 672px) 100vw, 672px"
          />

          {/* bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t
                          from-black/40 via-black/5 to-transparent" />

          {/* location chip */}
          {entry.location && (
            <div className="absolute bottom-3 left-3">
              <span
                className="inline-flex items-center gap-1.5
                           bg-black/25 backdrop-blur-sm border border-white/10
                           text-white/90 text-xs font-medium
                           px-2.5 py-1 rounded-full"
              >
                📍 {entry.location}
              </span>
            </div>
          )}

          {/* photo count badge */}
          {total > 1 && (
            <div className="absolute top-3 right-3">
              <span
                className="flex items-center gap-1
                           bg-black/30 backdrop-blur-sm
                           text-white/80 text-xs px-2 py-0.5 rounded-full"
              >
                🖼 {total}
              </span>
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="p-5">
          {/* category / mood */}
          <TagLine entry={entry} />

          {/* title */}
          <h3 className="font-serif text-xl font-bold text-ink leading-snug mt-1">
            {entry.title}
          </h3>

          {/* body preview */}
          {entry.body && (
            <p className="text-sm text-ink-soft leading-relaxed line-clamp-3 mt-2">
              {entry.body}
            </p>
          )}

          {/* places */}
          <PlaceChips places={entry.places} />
        </div>
      </article>
    </Link>
  );
}

/* ─── Text-only card ────────────────────────────────────── */
function TextCard({ entry, date }: { entry: Entry; date: string }) {
  return (
    <Link href={`/feed/${date}`} className="group block">
      <article
        className="bg-white rounded-2xl p-6
                   border-l-[3px] border-red
                   shadow-[0_2px_12px_rgba(0,0,0,0.06)]
                   hover:shadow-[0_8px_28px_rgba(0,0,0,0.11)]
                   hover:border-l-4
                   transition-all duration-300"
      >
        {/* decorative quote mark */}
        <p
          className="font-serif text-[4rem] leading-none text-red/12
                     mb-1 -ml-1 select-none"
          aria-hidden
        >
          "
        </p>

        {/* category / mood */}
        <TagLine entry={entry} />

        {/* title */}
        <h3 className="font-serif text-xl font-bold text-ink leading-snug mt-1 mb-3">
          {entry.title}
        </h3>

        {/* body */}
        {entry.body && (
          <p className="text-sm text-ink-soft leading-relaxed line-clamp-4">
            {entry.body}
          </p>
        )}

        {/* places */}
        <PlaceChips places={entry.places} />

        {/* footer */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-black/6">
          {entry.location
            ? <span className="text-xs text-ink-soft">📍 {entry.location}</span>
            : <span />
          }
          <span
            className="text-xs font-medium text-red/60
                       group-hover:text-red transition-colors"
          >
            Leer más →
          </span>
        </div>
      </article>
    </Link>
  );
}

/* ─── Shared sub-components ─────────────────────────────── */
function TagLine({ entry }: { entry: Entry }) {
  const tag = entry.mood ?? entry.tags?.[0];
  if (!tag) return null;
  return (
    <p className="text-gold text-[10px] tracking-[.28em] uppercase font-semibold">
      {tag}
    </p>
  );
}

function PlaceChips({ places }: { places?: Place[] }) {
  if (!places?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-black/5">
      {places.map((p) => (
        <span
          key={p.id}
          className="inline-flex items-center gap-1
                     text-[11px] font-medium
                     bg-sakura-soft text-red-deep
                     px-2.5 py-1 rounded-full"
        >
          {PLACE_EMOJI[p.type] ?? '📍'} {p.name}
        </span>
      ))}
    </div>
  );
}
