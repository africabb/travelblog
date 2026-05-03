import { fetchStats } from '@/lib/api';
import Link           from 'next/link';
import type { Stats } from '@/lib/types';

export const dynamic = 'force-dynamic';

/* ─── Trip catalogue ────────────────────────────────────── */
const TRIPS = [
  {
    num:     '01',
    slug:    'japan',
    href:    '/feed',
    flag:    '🇯🇵',
    name:    'Japón',
    period:  'Primavera 2026',
    cities:  'Tokio · Kioto · Osaka · Nara · Hiroshima',
    active:  true,
    desc:    'Cerezos en flor, ramen a medianoche y más templos de los que podemos contar.',
  },
  {
    num:     '02',
    slug:    'grecia',
    href:    '/grecia',
    flag:    '🇬🇷',
    name:    'Grecia en barco',
    period:  'Verano 2023',
    cities:  'Corfú · Meganisi · Lefkada · Ithaka · Kastos · Kalamos',
    active:  false,
    desc:    'Doce días navegando el Mar Jónico a bordo de Mr. Bojangles. Tavernas, pulpos y ataraxia.',
  },
  {
    num:     '03',
    slug:    'ibiza',
    href:    null,
    flag:    '🏝️',
    name:    'Ibiza',
    period:  'Verano 2026',
    cities:  'Santa Eulalia · Es Canar · Sant Antoni · Dalt Vila',
    active:  false,
    desc:    'Chiringuitos con los pies en la arena, atardeceres en el mar y las mejores paellas.',
  },
  {
    num:     '04',
    slug:    'la-manga',
    href:    null,
    flag:    '🌊',
    name:    'La Manga',
    period:  'Verano 2026',
    cities:  'Mar Menor · La Manga del Mar Menor · Cartagena',
    active:  false,
    desc:    'Aguas templadas del Mar Menor, arroces de la huerta y tardes eternas.',
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
          <a
            href="#destinos"
            className="text-xs text-ink-soft hover:text-ink transition-colors hidden sm:block"
          >
            Destinos
          </a>
          <a
            href="#sobre"
            className="text-xs text-ink-soft hover:text-ink transition-colors hidden sm:block"
          >
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
          HERO
      ══════════════════════════════════════════ */}
      <section className="min-h-screen flex flex-col justify-center px-5 sm:px-8 pt-14">
        <div className="max-w-2xl mx-auto w-full py-20">

          {/* label */}
          <p className="text-xs font-sans font-medium text-ink-soft
                        tracking-label uppercase mb-8">
            Blog de viajes · Gastronomía · Fotografía
          </p>

          {/* main headline */}
          <h1 className="font-display font-bold text-ink leading-[0.88] mb-8">
            <span className="block text-display-xl">Miguel</span>
            <span className="block text-display-xl italic text-red">
              &amp; África
            </span>
          </h1>

          {/* tagline */}
          <p className="font-sans text-base sm:text-lg text-ink-soft
                        leading-relaxed max-w-sm mb-10">
            Exploramos los mejores restaurantes del mundo.
            África los fotografia. Miguel automatizó todo.
            Bert lo escribe.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
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

          {/* scroll hint */}
          <p className="text-xs text-ink-muted mt-16 hidden sm:block">
            Scroll para explorar ↓
          </p>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          TRIPS  ─ editorial list
      ══════════════════════════════════════════ */}
      <section
        id="destinos"
        className="max-w-2xl mx-auto px-5 sm:px-8 py-24"
      >
        {/* section label */}
        <div className="flex items-center gap-4 mb-12">
          <span className="text-[10px] tracking-label uppercase font-medium text-ink-soft">
            01 — Destinos
          </span>
          <div className="flex-1 h-px bg-black/8" />
        </div>

        {/* trip rows */}
        <div>
          {TRIPS.map((trip, i) => (
            <TripRow key={trip.slug} trip={trip} stats={trip.active ? stats : null} />
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
        <div className="max-w-2xl mx-auto px-5 sm:px-8 py-12">
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


/* ─── TripRow component ─────────────────────────────────── */
function TripRow({
  trip,
  stats,
}: {
  trip: typeof TRIPS[number];
  stats: Stats | null;
}) {
  const inner = (
    <div
      className={`group py-7 border-b border-black/[0.07]
                  ${trip.href ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* number + period */}
          <p className="font-sans text-[10px] tracking-label uppercase
                        text-ink-soft mb-3">
            {trip.num} &nbsp;·&nbsp; {trip.flag} {trip.period}
          </p>

          {/* destination name */}
          <h2
            className={`font-display font-bold text-display-md text-ink
                        leading-none mb-2
                        ${trip.href
                          ? 'group-hover:text-red transition-colors duration-200'
                          : 'text-ink-soft'
                        }`}
          >
            {trip.name}
          </h2>

          {/* cities */}
          <p className="font-sans text-xs text-ink-soft mb-2">{trip.cities}</p>

          {/* desc */}
          <p className="font-sans text-sm text-ink-soft/70 leading-relaxed
                        max-w-md hidden sm:block">
            {trip.desc}
          </p>

          {/* stats for active */}
          {trip.active && stats && stats.entries > 0 && (
            <div className="flex gap-5 mt-4">
              {[
                { n: stats.days,   l: 'días'    },
                { n: stats.places, l: 'lugares' },
                { n: stats.photos, l: 'fotos'   },
              ].map(({ n, l }) => (
                <div key={l}>
                  <p className="font-display font-bold text-xl text-ink">{n}</p>
                  <p className="font-sans text-[10px] uppercase tracking-wide
                                text-ink-soft">{l}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* right badge / arrow */}
        <div className="shrink-0 pt-1 text-right">
          {trip.active ? (
            <div className="flex flex-col items-end gap-2">
              <span className="inline-flex items-center gap-1.5
                               text-[10px] font-medium text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" />
                Activo
              </span>
              {trip.href && (
                <span className="font-sans text-xs font-medium text-red
                                 opacity-0 group-hover:opacity-100
                                 translate-x-1 group-hover:translate-x-0
                                 transition-all duration-200">
                  Leer →
                </span>
              )}
            </div>
          ) : (
            <span className="text-[10px] text-ink-muted font-sans
                             tracking-wide uppercase">
              Próximamente
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return trip.href
    ? <Link href={trip.href}>{inner}</Link>
    : <div>{inner}</div>;
}
