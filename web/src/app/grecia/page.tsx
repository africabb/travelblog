import Link          from 'next/link';
import Image         from 'next/image';
import { GRECIA_CHAPTERS, type GreciaChapter } from '@/data/grecia';

/* ─── Page ──────────────────────────────────────────────── */
export default function GreciaPage() {
  return (
    <div className="min-h-screen bg-cream">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative min-h-[70vh] flex flex-col overflow-hidden bg-[#0D1B2A]">

        {/* Cover image — first chapter image */}
        <div className="absolute inset-0">
          <Image
            src="https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/dsc02781.jpg"
            alt="Mar Jónico desde el velero Mr. Bojangles"
            fill
            className="object-cover opacity-40"
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A]/60 via-transparent to-[#0D1B2A]" />
        </div>

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-5 pt-5">
          <Link
            href="/"
            className="font-sans text-xs text-white/60 hover:text-white transition-colors"
          >
            ← M&amp;A Travels
          </Link>
          <Link
            href="/login"
            className="font-sans text-xs text-white/50 hover:text-white
                       transition-colors border border-white/20 px-3 py-1 rounded-full"
          >
            Entrar
          </Link>
        </div>

        {/* Main centred content */}
        <div className="relative z-10 flex-1 flex flex-col items-center
                        justify-center text-center px-6 py-16 mt-8">

          {/* Label */}
          <p className="font-sans text-[10px] tracking-label uppercase
                        font-medium text-[#A8C5E0] mb-6">
            🇬🇷 Mar Jónico · Verano 2023
          </p>

          {/* Title */}
          <h1 className="font-display font-bold leading-[0.88] text-white">
            <span className="block text-display-lg">
              Grecia en barco
            </span>
            <span className="block italic text-[#A8C5E0] text-display-md mt-2">
              De aventuras se vive
            </span>
          </h1>

          {/* Tagline */}
          <p className="font-sans text-white/70 text-sm sm:text-base leading-relaxed
                        max-w-[22rem] mx-auto mt-6 mb-10">
            Doce días navegando el Mar Jónico a bordo de Mr. Bojangles.
            Tavernas, pulpos, anclas y ataraxia.
          </p>

          {/* Stats */}
          <div className="flex items-end justify-center gap-6 mb-10">
            <StatBadge n={12} label="días" light />
            <span className="text-white/20 pb-1 text-lg">·</span>
            <StatBadge n={GRECIA_CHAPTERS.length} label="capítulos" light />
            <span className="text-white/20 pb-1 text-lg">·</span>
            <StatBadge n={GRECIA_CHAPTERS.reduce((acc, c) => acc + c.images.length, 0)} label="fotos" light />
          </div>

          {/* Scroll CTA */}
          <a href="#capitulos" className="flex flex-col items-center gap-2.5 group">
            <span className="text-[10px] tracking-[.35em] uppercase text-white/40
                             group-hover:text-white/70 transition-colors">
              Leer el diario
            </span>
            <span className="text-white/30 group-hover:text-white/60
                             transition-all duration-300 animate-bounce text-sm">
              ↓
            </span>
          </a>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          CHAPTERS
      ══════════════════════════════════════════ */}
      <main id="capitulos" className="max-w-2xl mx-auto px-4 pt-14 pb-28">
        {GRECIA_CHAPTERS.map((chapter, idx) => (
          <ChapterSection key={chapter.num} chapter={chapter} idx={idx} />
        ))}
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
            <Link
              href="/"
              className="font-sans text-xs text-ink-soft hover:text-ink transition-colors"
            >
              ← Todos los viajes
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}


/* ─── Chapter section ───────────────────────────────────── */
function ChapterSection({ chapter, idx }: { chapter: GreciaChapter; idx: number }) {
  const paragraphs = chapter.text
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(Boolean);

  return (
    <div>
      {idx > 0 && (
        <div className="my-14">
          <DividerWave />
        </div>
      )}

      <section>
        {/* ── Chapter header ── */}
        <header className="flex items-start gap-4 mb-8">
          {/* Chapter number circle */}
          <div
            className="w-12 h-12 rounded-full shrink-0
                       flex items-center justify-center
                       shadow-lg mt-0.5"
            style={{ backgroundColor: '#1A5276' }}
          >
            <span className="font-serif font-bold text-white text-sm leading-none">
              {String(chapter.num).padStart(2, '0')}
            </span>
          </div>

          {/* Chapter text */}
          <div className="min-w-0">
            <p className="text-[10px] tracking-[.32em] uppercase font-semibold mb-0.5"
               style={{ color: '#2980B9' }}>
              Capítulo {chapter.num}
            </p>
            <h2
              className="font-serif font-bold text-ink leading-tight"
              style={{ fontSize: 'clamp(1.3rem, 5vw, 1.65rem)' }}
            >
              {chapter.title}
            </h2>
            {chapter.date && (
              <p className="text-sm text-ink-soft mt-1">📅 {chapter.date}</p>
            )}
          </div>
        </header>

        {/* ── Cover image (first) ── */}
        {chapter.images[0] && (
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6
                          shadow-lg shadow-black/10">
            <Image
              src={chapter.images[0]}
              alt={`Capítulo ${chapter.num} — ${chapter.title}`}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {/* ── Text ── */}
        <div className="space-y-4 mb-8">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="font-sans text-[15px] text-ink-soft leading-[1.85]"
            >
              {p}
            </p>
          ))}
        </div>

        {/* ── Photo grid (remaining images) ── */}
        {chapter.images.length > 1 && (
          <PhotoGrid images={chapter.images.slice(1)} title={chapter.title} />
        )}
      </section>
    </div>
  );
}


/* ─── Photo grid ────────────────────────────────────────── */
function PhotoGrid({ images, title }: { images: string[]; title: string }) {
  if (images.length === 0) return null;

  // 1 image → full width; 2 → side by side; 3+ → masonry-style 2 cols
  if (images.length === 1) {
    return (
      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden
                      shadow-md shadow-black/10 mb-2">
        <Image src={images[0]} alt={title} fill className="object-cover" unoptimized />
      </div>
    );
  }

  return (
    <div className="columns-2 gap-2 space-y-2 mb-2">
      {images.map((src, i) => (
        <div
          key={src}
          className="relative break-inside-avoid rounded-xl overflow-hidden
                     shadow-sm shadow-black/10"
          style={{ aspectRatio: i % 3 === 0 ? '4/3' : '3/4' }}
        >
          <Image
            src={src}
            alt={`${title} — foto ${i + 2}`}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}


/* ─── Sub-components ────────────────────────────────────── */
function StatBadge({ n, label, light }: { n: number; label: string; light?: boolean }) {
  return (
    <div className="text-center">
      <p className={`font-display text-2xl font-bold leading-none ${light ? 'text-white' : 'text-ink'}`}>
        {n}
      </p>
      <p className={`font-sans text-[10px] uppercase tracking-wider mt-0.5 ${light ? 'text-white/50' : 'text-ink-soft'}`}>
        {label}
      </p>
    </div>
  );
}

function DividerWave() {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-px bg-black/8" />
      <span className="text-[#2980B9]/40 text-base select-none" aria-hidden>⚓</span>
      <div className="flex-1 h-px bg-black/8" />
    </div>
  );
}
