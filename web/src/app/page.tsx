import { fetchStats }    from '@/lib/api';
import Link               from 'next/link';
import Image              from 'next/image';
import nextDynamic        from 'next/dynamic';
import PodcastPlayer      from '@/components/PodcastPlayer';
import {
  Utensils, Camera, Bot, Smartphone, PenLine, Globe,
  MapPin, ChevronRight,
} from 'lucide-react';
import type { Stats }     from '@/lib/types';

export const dynamic = 'force-dynamic';

/* Leaflet map — client only, no SSR */
const WorldMap = nextDynamic(() => import('@/components/WorldMap'), {
  ssr:     false,
  loading: () => (
    <div
      className="w-full rounded-2xl bg-[#f0ede9] animate-pulse"
      style={{ height: '420px' }}
    />
  ),
});

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
    cover:  'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/dsc02754.jpg',
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
    cover:  null,
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
    cover:  null,
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
    cover:  null,
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
          <a href="#mapa"
             className="text-xs text-ink-soft hover:text-ink transition-colors hidden sm:block">
            Mapa
          </a>
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
            className="text-xs font-medium text-white px-3.5 py-1.5 rounded-full
                       transition-all duration-200"
            style={{ backgroundColor: '#669bbc' }}
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
              <p className="text-xs font-sans font-medium text-ink-soft
                            tracking-label uppercase mb-8">
                Blog de viajes · Gastronomía · Fotografía
              </p>

              <h1 className="font-display font-bold text-ink leading-[0.88] mb-6">
                <span className="block text-display-xl">Miguel</span>
                <span className="block text-display-xl italic text-brand">
                  &amp; África
                </span>
              </h1>

              <p className="font-sans text-base sm:text-lg text-ink-soft
                            leading-relaxed max-w-sm mb-2">
                Exploramos los mejores restaurantes del mundo.
                África los fotografia. Miguel automatizó todo.
                Bert lo escribe.
              </p>

              <PodcastPlayer />

              <div className="flex flex-wrap items-center gap-3 mt-6">
                <a
                  href="#destinos"
                  className="inline-flex items-center gap-2 text-white
                             text-sm font-medium px-5 py-3 rounded-full
                             transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: '#669bbc' }}
                >
                  Ver destinos
                  <ChevronRight size={14} className="opacity-70" />
                </a>
                <Link
                  href="/feed"
                  className="inline-flex items-center gap-2 text-sm font-medium text-ink
                             border border-black/15 px-5 py-3 rounded-full
                             hover:border-[#669bbc] hover:text-[#669bbc] transition-colors"
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
                <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/10" />
              </div>
            </div>

          </div>

          <p className="text-xs text-ink-muted mt-14 hidden sm:block">
            Scroll para explorar ↓
          </p>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          MAP  ─ above Destinos
      ══════════════════════════════════════════ */}
      <section id="mapa" className="border-t border-black/[0.06] py-16">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">

          {/* section label */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[10px] tracking-label uppercase font-medium text-ink-soft">
              Mapa · Lugares visitados
            </span>
            <div className="flex-1 h-px bg-black/8" />
          </div>

          {/* legend */}
          <div className="flex items-center gap-6 mb-5">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full border-2 border-white
                           shadow-sm flex-shrink-0"
                style={{ backgroundColor: '#669bbc' }}
              />
              <span className="font-sans text-[11px] text-ink-soft">Visitado</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full border-2 border-white
                           shadow-sm flex-shrink-0"
                style={{ backgroundColor: '#b0b0b0' }}
              />
              <span className="font-sans text-[11px] text-ink-soft">Próximamente</span>
            </div>
          </div>

          <WorldMap />

          <p className="font-sans text-[10px] text-ink-muted mt-3 text-right">
            Haz clic en cualquier punto para ver más información
          </p>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          TRIPS  ─ square cards grid
      ══════════════════════════════════════════ */}
      <section id="destinos" className="border-t border-black/[0.06] py-16">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">

          <div className="flex items-center gap-4 mb-10">
            <span className="text-[10px] tracking-label uppercase font-medium text-ink-soft">
              01 — Destinos
            </span>
            <div className="flex-1 h-px bg-black/8" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {TRIPS.map((trip) => (
              <TripCard key={trip.slug} trip={trip} stats={trip.active ? stats : null} />
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          ABOUT
      ══════════════════════════════════════════ */}
      <section id="sobre" className="border-t border-black/[0.06] py-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">

          <div className="flex items-center gap-4 mb-12">
            <span className="text-[10px] tracking-label uppercase font-medium text-ink-soft">
              02 — Quiénes somos
            </span>
            <div className="flex-1 h-px bg-black/8" />
          </div>

          {/* About text + Bert image */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 lg:gap-14
                          items-start mb-12 max-w-5xl">
            <div className="max-w-2xl">
            <p className="font-sans text-xs font-semibold tracking-label uppercase text-ink mb-4">
              Bert, la asistente de IA de M&amp;A
            </p>

          {/* Narrow reading column */}
            <p className="font-sans text-[15px] text-ink-soft leading-[1.85] mb-10">
              Miguel y África viven en Palma de Mallorca, cerca del mar y con
              una idea bastante clara de la vida: viajar, comer bien, trabajar
              a su manera y exprimir cada aventura sin dejar de cuidar lo que
              construyen. Allá donde van buscan una mesa especial, un mercado
              con vida, una experiencia gastronómica que merezca recordarse y
              una historia que contar.
              <br /><br />
              Para ellos los sueños no son más que planes sin ejecutar. Las
              locuras son retos, y los retos empiezan trazando un plan y
              poniéndose en marcha. Les gusta la libertad, el mundo digital,
              la inteligencia artificial y llevarse el ordenador a cualquier
              destino para mantener los negocios a raya mientras viven a su
              ritmo.
              <br /><br />
              África hace las fotos. Miguel aporta su conocimiento de
              informática, automatizaciones e inteligencia artificial. África
              creó a Bert y le escribe por WhatsApp durante los viajes: fotos,
              audios, notas sueltas y momentos que no quieren olvidar. Bert,
              su asistente, ordena todo eso y lo convierte en este blog. Aquí
              aparecerán viajes, comida, fotografía y mucho amor. Que empiece
              la aventura.
            </p>

            {/* Three traits */}
            <div className="grid grid-cols-2 gap-px bg-black/[0.06] rounded-2xl overflow-hidden mb-8">
              {[
                { Icon: Utensils, label: 'Gastronomía',   sub: 'Restaurantes y experiencias únicas' },
                { Icon: Camera,   label: 'Fotografía',     sub: 'Imágenes de África en cada destino'  },
              ].map(({ Icon, label, sub }) => (
                <div key={label} className="bg-cream px-4 py-5 text-center">
                  <div className="flex justify-center mb-2">
                    <Icon size={22} className="text-ink-soft" strokeWidth={1.5} />
                  </div>
                  <p className="font-sans font-semibold text-ink text-xs mb-1">{label}</p>
                  <p className="text-[10px] text-ink-soft leading-tight">{sub}</p>
                </div>
              ))}
            </div>

            {/* Bert callout */}
            <div className="border border-black/[0.07] rounded-2xl p-6 bg-white">
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#669bbc' }}
                >
                  <Bot size={18} className="text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-sans font-semibold text-ink text-sm mb-1">
                    Hola, soy Bert
                  </p>
                  <p className="font-sans text-xs text-ink-soft leading-relaxed">
                    Soy la asistente de IA de Miguel y África. Me envían sus fotos,
                    audios y mensajes por WhatsApp mientras viajan, y yo organizo todo,
                    escribo las entradas del diario y publico su contenido.
                    Existo gracias a la idea y el código de Miguel.
                  </p>
                </div>
              </div>
            </div>
            </div>
            <div className="order-first lg:order-last flex flex-col items-center lg:items-end">
              <p className="font-display italic text-display-md text-ink leading-[1.1] mb-8 max-w-[360px]">
                "Comemos bien. Fotografiamos mejor.
                <br className="hidden sm:block" /> Y Bert escribe por nosotros."
              </p>
              <Image
                src="https://media.hustlegotreal.com/bert.webp"
                alt="Bert, la asistente de IA de M&A"
                width={1080}
                height={1350}
                className="h-auto w-auto max-w-full max-h-[min(760px,calc(100vh-7rem))] rounded-2xl shadow-xl shadow-black/15"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="border-t border-black/[0.06] py-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">

          <div className="flex items-center gap-4 mb-12">
            <span className="text-[10px] tracking-label uppercase font-medium text-ink-soft">
              03 — Cómo funciona
            </span>
            <div className="flex-1 h-px bg-black/8" />
          </div>

          <div className="max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                n:    '1',
                Icon: Smartphone,
                t:    'Capturamos',
                d:    'Le mandamos a Bert fotos, audios y texto por WhatsApp mientras vivimos el momento.',
              },
              {
                n:    '2',
                Icon: PenLine,
                t:    'Bert organiza',
                d:    'Bert crea las entradas, identifica lugares y guarda todo como borrador.',
              },
              {
                n:    '3',
                Icon: Globe,
                t:    'Publicamos',
                d:    'Revisamos los borradores y con un mensaje a Bert el diario se actualiza.',
              },
            ].map(({ n, Icon, t, d }) => (
              <div key={n} className="flex flex-col gap-3">
                <span className="font-display text-5xl font-bold text-black/[0.05]">{n}</span>
                <Icon size={22} className="text-ink-soft" strokeWidth={1.5} />
                <p className="font-sans font-semibold text-ink text-sm">{t}</p>
                <p className="font-sans text-xs text-ink-soft leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="border-t border-black/[0.06] bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
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
                <br />Redacción: Bert
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


/* ─── TripCard ───────────────────────────────────────────── */
function TripCard({ trip, stats }: { trip: typeof TRIPS[number]; stats: Stats | null }) {
  const inner = (
    <div
      className="relative aspect-square rounded-2xl overflow-hidden group"
      style={{ backgroundColor: trip.bg }}
    >
      {trip.cover && (
        <Image
          src={trip.cover}
          alt={trip.name}
          fill
          className="object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105
                     transition-all duration-500"
          unoptimized
        />
      )}

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${trip.bg}EE 0%, ${trip.bg}55 50%, transparent 100%)`,
        }}
      />

      {/* Status badge */}
      <div className="absolute top-3 right-3">
        {trip.active ? (
          <span className="inline-flex items-center gap-1 text-[9px] font-medium text-emerald-300
                           bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
            <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />
            Activo
          </span>
        ) : trip.done ? (
          <span className="text-[9px] font-medium text-white/70
                           bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
            ✓ Visitado
          </span>
        ) : (
          <span className="text-[9px] font-medium text-white/50
                           bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full uppercase tracking-wide">
            Próximamente
          </span>
        )}
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4">
        <p className="font-sans text-[10px] text-white/50 mb-1.5">
          {trip.num} &nbsp;·&nbsp; {trip.flag} {trip.period}
        </p>
        <h2
          className={`font-display font-bold text-white leading-tight transition-all duration-300
                      ${trip.href ? 'group-hover:translate-y-[-2px]' : 'opacity-60'}`}
          style={{ fontSize: 'clamp(1rem, 3.5vw, 1.25rem)' }}
        >
          {trip.name}
        </h2>

        {trip.active && stats && stats.entries > 0 && (
          <div className="flex gap-3 mt-2">
            {[{ n: stats.days, l: 'días' }, { n: stats.photos, l: 'fotos' }].map(({ n, l }) => (
              <div key={l}>
                <span className="font-display font-bold text-white text-sm">{n}</span>
                <span className="font-sans text-[9px] text-white/50 ml-0.5">{l}</span>
              </div>
            ))}
          </div>
        )}

        {trip.href && (
          <p className="font-sans text-[10px] text-white/40 group-hover:text-white/80
                        transition-colors mt-1">
            Leer →
          </p>
        )}
      </div>
    </div>
  );

  return trip.href ? <Link href={trip.href}>{inner}</Link> : <div>{inner}</div>;
}
