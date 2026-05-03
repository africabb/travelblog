import { fetchStats }    from '@/lib/api';
import Link               from 'next/link';
import Image              from 'next/image';
import PodcastPlayer      from '@/components/PodcastPlayer';
import type { Stats }     from '@/lib/types';

export const dynamic = 'force-dynamic';

/* ─── Trip catalogue (chronological order) ──────────────── */
const TRIPS = [
  {
    num:    '01',
    slug:   'grecia',
    href:   '/grecia',
    flag:   '🇬🇷',
    name:   'Grecia en barco',
    period: 'Verano 2023',
    cities: 'Corfú · Meganisi · Lefkada · Kastos · Kalamos',
    active: false,
    done:   true,
    desc:   'Doce días navegando el Mar Jónico a bordo de Mr. Bojangles. Tavernas, pulpos y ataraxia.',
    cover:  'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/dsc02754.jpg',
    accent: '#1A5276',
    bg:     '#0D2137',
  },
  {
    num:    '02',
    slug:   'japan',
    href:   '/feed',
    flag:   '🇯🇵',
    name:   'Japón',
    period: 'Primavera 2026',
    cities: 'Tokio · Kioto · Osaka · Nara · Hiroshima',
    active: true,
    done:   false,
    desc:   'Cerezos en flor, ramen a medianoche y más templos de los que podemos contar.',
    cover:  null,
    accent: '#C0392B',
    bg:     '#2C0A0A',
  },
  {
    num:    '03',
    slug:   'ibiza',
    href:   null,
    flag:   '🏝️',
    name:   'Ibiza',
    period: 'Verano 2026',
    cities: 'Santa Eulalia · Es Canar · Sant Antoni · Dalt Vila',
    active: false,
    done:   false,
    desc:   'Chiringuitos con los pies en la arena, atardeceres en el mar y las mejores paellas.',
    cover:  null,
    accent: '#1A7A5A',
    bg:     '#0A2118',
  },
  {
    num:    '04',
    slug:   'la-manga',
    href:   null,
    flag:   '🌊',
    name:   'La Manga',
    period: 'Verano 2026',
    cities: 'Mar Menor · La Manga del Mar Menor · Cartagena',
    active: false,
    done:   false,
    desc:   'Aguas templadas del Mar Menor, arroces de la huerta y tardes eternas.',
    cover:  null,
    accent: '#1F618D',
    bg:     '#071A2A',
  },
] as const;

/* ─── Page ──────────────────────────────────────────────── */
export default async function HomePage() {
  const stats = await fetchStats().catch(() => null);

  return (
    <div className="min-h-screen bg-cream">

      {/* ══════════════════════════════════════════
          NAV
      ══════════════════════════════════════════ */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between
                      px-5 sm:px-8 h-14
                      bg-cream/80 backdrop-blur-md
                      border-b border-black/[0.05]">
        <span className="font-display text-xl font-bold text-ink tracking-tight">
          M&amp;A
        </span>
        <div className="flex items-center gap-5">
          <a href="#destinos"
             className="text-xs text-ink-soft hover:text-ink transition-colors hidden sm:block">
            Destinos
          </a>
          <a href="#sobre"
             className="text-xs text-ink-soft hover:text-ink transition-colors hidden sm:block">
            Nosotros
          </a>
          <Link
            href="/login"
            className="text-xs font-medium text-ink border border-black/15
                       px-3.5 py-1.5 rounded-full
                       hover:border-black/40 hover:bg-ink hover:text-cream
                       transition-all duration-200"
          >
            Entrar
          </Link>
        </div>
      </nav>


      {/* ══════════════════════════════════════════
          HERO  ─ two-column
      ══════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col justify-center px-5 sm:px-8 pt-14">
        <div className="max-w-5xl mx-auto w-full py-16 sm:py-20">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* ── Left: text + podcast ── */}
            <div>
              {/* label */}
              <p className="text-xs font-sans font-medium text-ink-soft
                            tracking-label uppercase mb-8">
                Blog de viajes · Gastronomía · Fotografía
              </p>

              {/* main headline */}
              <h1 className="font-display font-bold text-ink leading-[0.88] mb-6">
                <span className="block text-display-xl">Miguel</span>
                <span className="block text-display-xl italic text-red">
                  &amp; África
                </span>
              </h1>

              {/* tagline */}
              <p className="font-sans text-base sm:text-lg text-ink-soft
                            leading-relaxed max-w-sm mb-2">
                Exploramos los mejores restaurantes del mundo.
                África los fotografia. Miguel automatizó todo.
                Bert lo escribe.
              </p>

              {/* ── Podcast player ── */}
              <PodcastPlayer />

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <a
                  href="#destinos"
                  className="inline-flex items-center gap-2 bg-ink text-cream
                             text-sm font-medium px-5 py-3 rounded-full
                             hover:bg-red transition-all duration-200"
                >
                  Ver destinos
                  <span className="opacity-60">↓</span>
                </a>
                <Link
                  href="/feed"
                  className="inline-flex items-center gap-2 text-sm font-medium text-ink
                             border border-black/15 px-5 py-3 rounded-full
                             hover:border-black/40 transition-colors"
                >
                  🇯🇵 Japón 2026
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" />
                </Link>
              </div>
            </div>

            {/* ── Right: couple photo ── */}
            <div className="relative order-first lg:order-last
                            flex items-center justify-center">
              <div className="relative w-full max-w-[340px] lg:max-w-none mx-auto
                              aspect-[3/4] rounded-3xl overflow-hidden
                              shadow-2xl shadow-black/20">
                <Image
                  src="https://media.hustlegotreal.com/affymiguel.webp"
                  alt="Miguel y África"
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
                {/* Subtle vignette */}
                <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/10" />
              </div>
            </div>

          </div>

          {/* scroll hint */}
          <p className="text-xs text-ink-muted mt-14 hidden sm:block">
            Scroll para explorar ↓
          </p>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          TRIPS  ─ square cards grid
      ══════════════════════════════════════════ */}
      <section id="destinos" className="max-w-5xl mx-auto px-5 sm:px-8 py-24">

        {/* section label */}
        <div className="flex items-center gap-4 mb-10">
          <span className="text-[10px] tracking-label uppercase font-medium text-ink-soft">
            01 — Destinos
          </span>
          <div className="flex-1 h-px bg-black/8" />
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {TRIPS.map((trip) => (
            <TripCard key={trip.slug} trip={trip} stats={trip.active ? stats : null} />
          ))}
        </div>
      </section>


      {/* ══════════════════════════════════════════
          ABOUT
      ══════════════════════════════════════════ */}
      <section
        id="sobre"
        className="max-w-2xl mx-auto px-5 sm:px-8 py-24 border-t border-black/[0.06]"
      >
        {/* section label */}
        <div className="flex items-center gap-4 mb-12">
          <span className="text-[10px] tracking-label uppercase font-medium text-ink-soft">
            02 — Quiénes somos
          </span>
          <div className="flex-1 h-px bg-black/8" />
        </div>

        {/* pull quote */}
        <p className="font-display italic text-display-md text-ink leading-[1.1] mb-10">
          "Comemos bien. Fotografiamos mejor.
          <br className="hidden sm:block" /> Y Bert escribe por nosotros."
        </p>

        {/* main paragraph */}
        <p className="font-sans text-[15px] text-ink-soft leading-[1.85] mb-10 max-w-prose">
          Somos Miguel y África, dos enamorados de la buena mesa y de descubrir
          los rincones gastronómicos más especiales allá donde vamos. En cada viaje
          buscamos el restaurante que no sale en las guías, el mercado que huele a
          especias, el chiringuito que sirve el mejor arroz.
          <br /><br />
          África captura cada momento con su cámara — las fotos que ves aquí son suyas.
          Miguel, con su pasión por la informática y las automatizaciones, construyó
          a Bert: nuestra asistente de WhatsApp que escribe y organiza todo el
          contenido de este blog. Le mandamos fotos, audios y mensajes durante
          el viaje, y Bert lo convierte en un diario. Juntos nos lo pasamos
          increíblemente bien, y nos amamos demasiado como para no compartirlo.
        </p>

        {/* three traits */}
        <div className="grid grid-cols-3 gap-px bg-black/[0.06] rounded-2xl overflow-hidden mb-12">
          {[
            { icon: '🍽️', label: 'Gastronomía',    sub: 'Restaurantes y experiencias únicas' },
            { icon: '📷', label: 'Fotografía',      sub: 'Imágenes de África en cada destino'  },
            { icon: '🤖', label: 'Automatización',  sub: 'Bert escribe el blog por WhatsApp'   },
          ].map(({ icon, label, sub }) => (
            <div key={label} className="bg-cream px-4 py-5 text-center">
              <p className="text-2xl mb-2">{icon}</p>
              <p className="font-sans font-semibold text-ink text-xs mb-1">{label}</p>
              <p className="text-[10px] text-ink-soft leading-tight">{sub}</p>
            </div>
          ))}
        </div>

        {/* Bert callout */}
        <div className="border border-black/[0.07] rounded-2xl p-6 bg-white">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-ink flex items-center justify-center shrink-0">
              <span className="text-cream text-lg">🤖</span>
            </div>
            <div>
              <p className="font-sans font-semibold text-ink text-sm mb-1">
                Hola, soy Bert
              </p>
              <p className="font-sans text-xs text-ink-soft leading-relaxed">
                Soy la asistente de IA de Miguel y África. Me envían sus fotos,
                audios y mensajes por WhatsApp mientras viajan, y yo organizo todo,
                escribo las entradas del diario y publico su contenido.
                Existo gracias a la idea y el código de Miguel. ✨
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="max-w-2xl mx-auto px-5 sm:px-8 py-24 border-t border-black/[0.06]">
        {/* section label */}
        <div className="flex items-center gap-4 mb-12">
          <span className="text-[10px] tracking-label uppercase font-medium text-ink-soft">
            03 — Cómo funciona
          </span>
          <div className="flex-1 h-px bg-black/8" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              n:    '1',
              icon: '📲',
              t:    'Capturamos',
              d:    'Le mandamos a Bert fotos, audios y texto por WhatsApp mientras vivimos el momento.',
            },
            {
              n:    '2',
              icon: '✍️',
              t:    'Bert organiza',
              d:    'Bert crea las entradas, identifica lugares y guarda todo como borrador.',
            },
            {
              n:    '3',
              icon: '🌐',
              t:    'Publicamos',
              d:    'Revisamos los borradores y con un mensaje a Bert el diario se actualiza.',
            },
          ].map(({ n, icon, t, d }) => (
            <div key={n} className="flex flex-col gap-3">
              <span className="font-display text-5xl font-bold text-black/[0.05]">{n}</span>
              <p className="text-xl">{icon}</p>
              <p className="font-sans font-semibold text-ink text-sm">{t}</p>
              <p className="font-sans text-xs text-ink-soft leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>


      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="border-t border-black/[0.06] bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center
                          justify-between gap-6">
            <div>
              <p className="font-display font-bold text-xl text-ink mb-1">
                Miguel &amp; África
              </p>
              <p className="text-xs text-ink-soft">
                Diarios de viaje · Gastronomía · Fotografía
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-ink-muted leading-relaxed">
                Fotos: África &nbsp;·&nbsp; Código: Miguel
                <br />
                Redacción: Bert
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


/* ─── TripCard ───────────────────────────────────────────── */
function TripCard({
  trip,
  stats,
}: {
  trip: typeof TRIPS[number];
  stats: Stats | null;
}) {
  const inner = (
    <div
      className="relative aspect-square rounded-2xl overflow-hidden group"
      style={{ backgroundColor: trip.bg }}
    >
      {/* Cover image */}
      {trip.cover && (
        <Image
          src={trip.cover}
          alt={trip.name}
          fill
          className="object-cover opacity-60
                     group-hover:opacity-75 group-hover:scale-105
                     transition-all duration-500"
          unoptimized
        />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${trip.bg}EE 0%, ${trip.bg}55 50%, transparent 100%)`,
        }}
      />

      {/* Top-right status badge */}
      <div className="absolute top-3 right-3">
        {trip.active ? (
          <span className="inline-flex items-center gap-1
                           text-[9px] font-medium text-emerald-300
                           bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
            <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />
            Activo
          </span>
        ) : trip.done ? (
          <span className="text-[9px] font-medium text-white/70
                           bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
            ✓ Leído
          </span>
        ) : (
          <span className="text-[9px] font-medium text-white/50
                           bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full
                           uppercase tracking-wide">
            Próximamente
          </span>
        )}
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4">
        {/* Flag + number */}
        <p className="font-sans text-[10px] text-white/50 mb-1.5">
          {trip.num} &nbsp;·&nbsp; {trip.flag} {trip.period}
        </p>

        {/* Destination name */}
        <h2
          className={`font-display font-bold text-white leading-tight
                      transition-all duration-300
                      ${trip.href
                        ? 'group-hover:translate-y-[-2px]'
                        : 'opacity-60'
                      }`}
          style={{ fontSize: 'clamp(1rem, 3.5vw, 1.25rem)' }}
        >
          {trip.name}
        </h2>

        {/* Stats for active Japan trip */}
        {trip.active && stats && stats.entries > 0 && (
          <div className="flex gap-3 mt-2">
            {[
              { n: stats.days,   l: 'días'    },
              { n: stats.photos, l: 'fotos'   },
            ].map(({ n, l }) => (
              <div key={l}>
                <span className="font-display font-bold text-white text-sm">{n}</span>
                <span className="font-sans text-[9px] text-white/50 ml-0.5">{l}</span>
              </div>
            ))}
          </div>
        )}

        {/* Arrow — only on linked cards */}
        {trip.href && (
          <p className="font-sans text-[10px] text-white/40
                        group-hover:text-white/80 transition-colors mt-1">
            Leer →
          </p>
        )}
      </div>
    </div>
  );

  return trip.href
    ? <Link href={trip.href}>{inner}</Link>
    : <div>{inner}</div>;
}
