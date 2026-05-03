import { notFound } from 'next/navigation';
import Link          from 'next/link';
import Image         from 'next/image';
import { MapPin, Utensils } from 'lucide-react';
import { GRECIA_CHAPTERS, type GreciaReference, type GreciaReferenceInput } from '@/data/grecia';

/* ─── Static paths ───────────────────────────────────────── */
export function generateStaticParams() {
  return GRECIA_CHAPTERS.map((c) => ({ num: String(c.num) }));
}

/* ─── Page ──────────────────────────────────────────────── */
export default function ChapterPage({ params }: { params: { num: string } }) {
  const num     = parseInt(params.num, 10);
  const idx     = GRECIA_CHAPTERS.findIndex((c) => c.num === num);
  if (idx === -1) notFound();

  const chapter = GRECIA_CHAPTERS[idx];
  const prev    = GRECIA_CHAPTERS[idx - 1] ?? null;
  const next    = GRECIA_CHAPTERS[idx + 1] ?? null;

  const paragraphs = chapter.text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-cream">

      {/* ══════════════════════════════════════════
          HERO — cover image or solid bg
      ══════════════════════════════════════════ */}
      <section
        className="relative h-[52vh] min-h-[320px] flex flex-col overflow-hidden"
        style={{ backgroundColor: '#0D1B2A' }}
      >
        {chapter.images[0] && (
          <>
            <Image
              src={chapter.images[0]}
              alt={chapter.title}
              fill
              className="object-cover opacity-40"
              unoptimized
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A]/50 via-transparent to-[#0D1B2A]" />
          </>
        )}

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-5 pt-5">
          <Link href="/grecia" className="font-sans text-xs text-white/60 hover:text-white transition-colors">
            ← Grecia en barco
          </Link>
          <span className="font-sans text-[10px] text-white/40 uppercase tracking-widest">
            {chapter.num} / {GRECIA_CHAPTERS.length}
          </span>
        </div>

        {/* Chapter title */}
        <div className="relative z-10 flex-1 flex flex-col justify-end px-5 pb-8 max-w-2xl mx-auto w-full">
          <p
            className="font-sans text-[10px] tracking-[.32em] uppercase font-semibold mb-2"
            style={{ color: '#7EC8E3' }}
          >
            Capítulo {String(chapter.num).padStart(2, '0')}
          </p>
          <h1
            className="font-display font-bold text-white leading-tight"
            style={{ fontSize: 'clamp(1.6rem, 6vw, 2.5rem)' }}
          >
            {chapter.title}
          </h1>
          {chapter.date && (
            <p className="font-sans text-sm text-white/50 mt-2">📅 {chapter.date}</p>
          )}
        </div>
      </section>


      {/* ══════════════════════════════════════════
          CONTENT
      ══════════════════════════════════════════ */}
      <main className="max-w-2xl mx-auto px-5 pt-12 pb-10">

        {/* Text */}
        <div className="space-y-5 mb-12">
          {paragraphs.map((p, i) => (
            <p key={i} className="font-sans text-[15px] text-ink-soft leading-[1.9]">
              {p}
            </p>
          ))}
        </div>

        <ChapterSummary
          restaurants={chapter.restaurants}
          places={chapter.places}
        />

        {/* Photo grid */}
        {chapter.images.length > 0 && (
          <PhotoGrid images={chapter.images} title={chapter.title} />
        )}
      </main>


      {/* ══════════════════════════════════════════
          PREV / NEXT navigation
      ══════════════════════════════════════════ */}
      <nav className="border-t border-black/[0.07] bg-white">
        <div className="max-w-2xl mx-auto px-5 py-6 flex items-stretch justify-between gap-4">

          {/* Previous */}
          {prev ? (
            <Link
              href={`/grecia/${prev.num}`}
              className="group flex-1 flex flex-col gap-1 min-w-0"
            >
              <span className="font-sans text-[10px] text-ink-soft uppercase tracking-wider
                               group-hover:text-[#1A5276] transition-colors">
                ← Anterior
              </span>
              <span className="font-display font-bold text-ink text-sm leading-tight
                               group-hover:text-[#1A5276] transition-colors truncate">
                Cap. {prev.num} — {prev.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {/* Divider */}
          <div className="w-px bg-black/[0.07] shrink-0" />

          {/* Next */}
          {next ? (
            <Link
              href={`/grecia/${next.num}`}
              className="group flex-1 flex flex-col gap-1 items-end min-w-0"
            >
              <span className="font-sans text-[10px] text-ink-soft uppercase tracking-wider
                               group-hover:text-[#1A5276] transition-colors">
                Siguiente →
              </span>
              <span className="font-display font-bold text-ink text-sm leading-tight text-right
                               group-hover:text-[#1A5276] transition-colors truncate w-full">
                Cap. {next.num} — {next.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1 flex flex-col items-end gap-1">
              <span className="font-sans text-[10px] text-ink-soft uppercase tracking-wider">
                Fin del viaje
              </span>
              <Link
                href="/grecia"
                className="font-display font-bold text-ink text-sm hover:text-[#1A5276] transition-colors"
              >
                Ver todos los capítulos
              </Link>
            </div>
          )}
        </div>
      </nav>


      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="border-t border-black/[0.06] bg-cream">
        <div className="max-w-2xl mx-auto px-5 py-8 flex items-center justify-between">
          <p className="font-display font-bold text-ink text-sm">Miguel &amp; África</p>
          <Link href="/" className="font-sans text-xs text-ink-soft hover:text-ink transition-colors">
            ← Todos los viajes
          </Link>
        </div>
      </footer>
    </div>
  );
}


/* ─── Chapter summary ───────────────────────────────────── */
function ChapterSummary({
  restaurants,
  places,
}: {
  restaurants: GreciaReferenceInput[];
  places: GreciaReferenceInput[];
}) {
  return (
    <section className="mb-12 border-y border-black/[0.07] py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <SummaryList
          title="Restaurantes"
          empty="Sin restaurantes anotados en esta entrada."
          items={restaurants}
          Icon={Utensils}
        />
        <SummaryList
          title="Lugares"
          empty="Sin lugares anotados en esta entrada."
          items={places}
          Icon={MapPin}
        />
      </div>
    </section>
  );
}

function SummaryList({
  title,
  empty,
  items,
  Icon,
}: {
  title: string;
  empty: string;
  items: GreciaReferenceInput[];
  Icon: typeof Utensils;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Icon size={18} className="text-[#1A5276]" strokeWidth={1.7} />
        <h2 className="font-display font-bold text-ink text-xl leading-tight">
          {title}
        </h2>
      </div>
      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item) => {
            const reference = normalizeReference(item);

            return (
            <li
              key={reference.name}
              className="font-sans text-sm text-ink-soft leading-relaxed flex gap-2"
            >
              <span className="mt-[0.62em] h-1.5 w-1.5 rounded-full bg-[#1A5276]/55 shrink-0" />
              <span>
                {reference.name}
                <span className="ml-2 whitespace-nowrap">
                  <a
                    href={googleMapsUrl(reference)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#1A5276] hover:underline"
                  >
                    Maps
                  </a>
                  {reference.officialUrl && (
                    <>
                      <span className="text-ink-muted mx-1">·</span>
                      <a
                        href={reference.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#1A5276] hover:underline"
                      >
                        Web oficial
                      </a>
                    </>
                  )}
                </span>
              </span>
            </li>
          )})}
        </ul>
      ) : (
        <p className="font-sans text-sm text-ink-muted leading-relaxed">
          {empty}
        </p>
      )}
    </div>
  );
}

function normalizeReference(item: GreciaReferenceInput): GreciaReference {
  return typeof item === 'string' ? { name: item } : item;
}

function googleMapsUrl(item: GreciaReference) {
  const query = encodeURIComponent(item.mapsQuery ?? item.name);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}


/* ─── Photo grid ─────────────────────────────────────────── */
function PhotoGrid({ images, title }: { images: string[]; title: string }) {
  const [first, ...rest] = images;

  return (
    <div className="space-y-2">
      {/* First image — full width */}
      <a
        href={first}
        target="_blank"
        rel="noreferrer"
        className="relative block w-full aspect-[4/3] rounded-2xl overflow-hidden
                   shadow-md shadow-black/10"
      >
        <Image src={first} alt={title} fill className="object-cover" unoptimized />
      </a>

      {/* Rest — 2-column masonry */}
      {rest.length > 0 && (
        <div className="columns-2 gap-2 space-y-2">
          {rest.map((src, i) => (
            <a
              key={src}
              href={src}
              target="_blank"
              rel="noreferrer"
              className="relative break-inside-avoid rounded-xl overflow-hidden
                         shadow-sm shadow-black/8 block"
              style={{ aspectRatio: i % 3 === 0 ? '4/3' : '3/4' }}
            >
              <Image
                src={src}
                alt={`${title} — foto ${i + 2}`}
                fill
                className="object-cover"
                unoptimized
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
