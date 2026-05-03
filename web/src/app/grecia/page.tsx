import Link          from 'next/link';
import Image         from 'next/image';
import { MapPin, Utensils } from 'lucide-react';
import {
  GRECIA_CHAPTERS,
  type GreciaChapter,
  type GreciaReference,
  type GreciaReferenceInput,
} from '@/data/grecia';

/* ─── Page ──────────────────────────────────────────────── */
export default function GreciaPage() {
  const restaurants = uniqueItems(GRECIA_CHAPTERS.flatMap((chapter) => chapter.restaurants));
  const places      = uniqueItems(GRECIA_CHAPTERS.flatMap((chapter) => chapter.places));

  return (
    <div className="min-h-screen bg-cream">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative h-[60vh] min-h-[400px] flex flex-col overflow-hidden bg-[#0D1B2A]">

        {/* Cover image */}
        <div className="absolute inset-0">
          <Image
            src="https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/dsc02781.jpg"
            alt="Mar Jónico desde Mr. Bojangles"
            fill
            className="object-cover opacity-35"
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A]/50 via-transparent to-[#0D1B2A]" />
        </div>

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-5 pt-5">
          <Link href="/" className="font-sans text-xs text-white/60 hover:text-white transition-colors">
            ← M&amp;A Travels
          </Link>
          <Link
            href="/login"
            className="font-sans text-xs text-white/50 hover:text-white
                       border border-white/20 px-3 py-1 rounded-full transition-colors"
          >
            Entrar
          </Link>
        </div>

        {/* Centre content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">
          <p className="font-sans text-[10px] tracking-label uppercase font-medium text-[#7EC8E3] mb-5">
            🇬🇷 Mar Jónico · Verano 2023
          </p>
          <h1 className="font-display font-bold text-white leading-[0.88]">
            <span className="block text-display-lg">Grecia en barco</span>
            <span className="block italic text-[#7EC8E3] text-display-md mt-2">De aventuras se vive</span>
          </h1>
          <p className="font-sans text-white/60 text-sm leading-relaxed max-w-xs mx-auto mt-5">
            Doce días navegando el Mar Jónico a bordo de Mr. Bojangles.
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 mt-7">
            {[
              { n: 12,  l: 'días' },
              { n: GRECIA_CHAPTERS.length, l: 'capítulos' },
              { n: GRECIA_CHAPTERS.reduce((a, c) => a + c.images.length, 0), l: 'fotos' },
            ].map(({ n, l }) => (
              <div key={l} className="text-center">
                <p className="font-display font-bold text-white text-2xl leading-none">{n}</p>
                <p className="font-sans text-[10px] text-white/40 uppercase tracking-wider mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          CHAPTER CARDS — vertical timeline
      ══════════════════════════════════════════ */}
      <main className="max-w-5xl mx-auto px-4 pt-14 pb-28">
        <TripSummary restaurants={restaurants} places={places} />

        <div className="max-w-2xl mx-auto">

        {/* top label */}
        <div className="flex items-center gap-4 mb-10">
          <span className="text-[10px] tracking-label uppercase font-medium text-ink-soft">
            Capítulos · en orden cronológico
          </span>
          <div className="flex-1 h-px bg-black/8" />
        </div>

        {GRECIA_CHAPTERS.map((chapter, idx) => (
          <div key={chapter.num}>
            <ChapterCard chapter={chapter} />

            {/* Arrow connector between cards */}
            {idx < GRECIA_CHAPTERS.length - 1 && (
              <div className="flex flex-col items-center py-1">
                <div className="w-px h-5 bg-[#1A5276]/20" />
                <svg
                  width="20" height="20" viewBox="0 0 20 20" fill="none"
                  className="text-[#1A5276]/30"
                >
                  <path
                    d="M10 3v11M5 10l5 7 5-7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="w-px h-5 bg-[#1A5276]/20" />
              </div>
            )}
          </div>
        ))}
        </div>
      </main>


      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="border-t border-black/[0.06] bg-white">
        <div className="max-w-2xl mx-auto px-5 py-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display font-bold text-ink">Miguel &amp; África</p>
              <p className="font-sans text-xs text-ink-soft mt-0.5">Grecia · Verano 2023</p>
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


function uniqueItems(items: GreciaReferenceInput[]) {
  const byName = new Map<string, GreciaReference>();

  items.forEach((item) => {
    const reference = normalizeReference(item);
    if (!byName.has(reference.name)) byName.set(reference.name, reference);
  });

  return Array.from(byName.values());
}


/* ─── Trip summary ───────────────────────────────────────── */
function TripSummary({
  restaurants,
  places,
}: {
  restaurants: GreciaReference[];
  places: GreciaReference[];
}) {
  return (
    <section className="mb-16 border-y border-black/[0.07] py-10">
      <div className="flex items-center gap-4 mb-8">
        <span className="text-[10px] tracking-label uppercase font-medium text-ink-soft">
          Resumen del viaje
        </span>
        <div className="flex-1 h-px bg-black/8" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <SummaryList
          title="Restaurantes"
          items={restaurants}
          Icon={Utensils}
        />
        <SummaryList
          title="Lugares"
          items={places}
          Icon={MapPin}
        />
      </div>
    </section>
  );
}

function SummaryList({
  title,
  items,
  Icon,
}: {
  title: string;
  items: GreciaReference[];
  Icon: typeof Utensils;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Icon size={18} className="text-[#1A5276]" strokeWidth={1.7} />
        <h2 className="font-display font-bold text-ink text-2xl leading-tight">
          {title}
        </h2>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2">
        {items.map((item) => (
          <li
            key={item.name}
            className="font-sans text-sm text-ink-soft leading-relaxed flex gap-2"
          >
            <span className="mt-[0.62em] h-1.5 w-1.5 rounded-full bg-[#1A5276]/55 shrink-0" />
            <span>
              {item.name}
              <span className="ml-2 whitespace-nowrap">
                <a
                  href={googleMapsUrl(item)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#1A5276] hover:underline"
                >
                  Maps
                </a>
                {item.officialUrl && (
                  <>
                    <span className="text-ink-muted mx-1">·</span>
                    <a
                      href={item.officialUrl}
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
        ))}
      </ul>
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


/* ─── Chapter card ───────────────────────────────────────── */
function ChapterCard({ chapter }: { chapter: GreciaChapter }) {
  const preview = chapter.text
    .split(/\n\n+/)[0]      // first paragraph only
    .replace(/\n/g, ' ')
    .trim()
    .slice(0, 160);

  return (
    <Link href={`/grecia/${chapter.num}`} className="group block">
      <article
        className="bg-white rounded-2xl overflow-hidden
                   shadow-[0_2px_12px_rgba(0,0,0,0.07)]
                   hover:shadow-[0_8px_32px_rgba(0,0,0,0.13)]
                   transition-all duration-300"
      >
        <div className="flex">
          {/* Left: cover image */}
          {chapter.images[0] && (
            <div className="relative w-[120px] sm:w-[160px] shrink-0">
              <Image
                src={chapter.images[0]}
                alt={chapter.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                unoptimized
              />
            </div>
          )}

          {/* Right: text */}
          <div className="flex-1 min-w-0 p-5">
            {/* Chapter badge */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#1A5276' }}
              >
                <span className="font-display font-bold text-white text-[10px] leading-none">
                  {String(chapter.num).padStart(2, '0')}
                </span>
              </span>
              <span
                className="font-sans text-[10px] tracking-[.28em] uppercase font-semibold"
                style={{ color: '#2980B9' }}
              >
                Capítulo {chapter.num}
              </span>
            </div>

            {/* Title */}
            <h2
              className="font-display font-bold text-ink leading-tight mb-1
                         group-hover:text-[#1A5276] transition-colors"
              style={{ fontSize: 'clamp(1rem, 4vw, 1.2rem)' }}
            >
              {chapter.title}
            </h2>

            {/* Date */}
            {chapter.date && (
              <p className="font-sans text-[11px] text-ink-soft mb-2">
                📅 {chapter.date}
              </p>
            )}

            {/* Preview */}
            <p className="font-sans text-sm text-ink-soft leading-relaxed line-clamp-2 hidden sm:block">
              {preview}{preview.length >= 160 ? '…' : ''}
            </p>

            {/* CTA */}
            <p
              className="font-sans text-xs font-medium mt-3
                         text-[#1A5276]/50 group-hover:text-[#1A5276]
                         transition-colors"
            >
              Leer capítulo →
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
