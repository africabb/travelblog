import Link               from 'next/link';
import Image              from 'next/image';
import nextDynamic        from 'next/dynamic';
import PodcastPlayer      from '@/components/PodcastPlayer';
import {
  Utensils, Camera, Bot, Smartphone, PenLine, Globe,
  MapPin, ChevronRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

/* Leaflet map — client only, no SSR */
const WorldMap = nextDynamic(() => import('@/components/WorldMap'), {
  ssr:     false,
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_220px] items-center gap-8 lg:gap-10">
      <div className="mx-auto w-full max-w-[520px] aspect-square rounded-full bg-[#f0ede9] animate-pulse shadow-[0_24px_80px_rgba(11,24,38,0.12)]" />
      <div className="hidden lg:block">
        <div className="h-3 w-28 bg-[#f0ede9] rounded-full mb-4 animate-pulse" />
        <div className="h-16 w-36 bg-[#f0ede9] rounded-xl mb-4 animate-pulse" />
        <div className="h-12 w-44 bg-[#f0ede9] rounded-xl animate-pulse" />
      </div>
    </div>
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
    slug:   'palma',
    href:   '/palma',
    flag:   '🌴',
    name:   'Palma de Mallorca',
    period: '2026',
    cities: 'Palma de Mallorca',
    active: false,
    done:   true,
    cover:  'https://media.hustlegotreal.com/affymiguelpalma.webp',
    bg:     '#14342B',
  },
  {
    num:    '03',
    slug:   'murcia',
    href:   '/viaje/murcia',
    flag:   '☀️',
    name:   'Murcia',
    period: 'Mayo 2026',
    cities: 'Murcia',
    active: true,
    done:   false,
    cover:  'https://japon.amurasoftware.com/uploads/photos/2026-05-07/10a0ecf0-d3ef-45be-a764-9dc23d93820f..jpg',
    bg:     '#3A241B',
  },
  {
    num:    '04',
    slug:   'japan',
    href:   '/feed',
    flag:   '🇯🇵',
    name:   'Japón',
    period: 'Primavera 2026',
    cities: 'Tokio · Kioto · Osaka · Nara · Hiroshima',
    active: false,
    done:   false,
    cover:  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=82',
    bg:     '#2C0A0A',
  },
  {
    num:    '05',
    slug:   'ibiza',
    href:   '/viaje/ibiza',
    flag:   '🏝️',
    name:   'Ibiza',
    period: 'Verano 2026',
    cities: 'Santa Eulalia · Es Canar · Sant Antoni · Dalt Vila',
    active: false,
    done:   false,
    cover:  'https://images.unsplash.com/photo-1605443796819-7f468cbd6f34?auto=format&fit=crop&w=1200&q=82',
    bg:     '#0A2118',
  },
  {
    num:    '06',
    slug:   'la-manga',
    href:   '/viaje/la-manga',
    flag:   '🌊',
    name:   'La Manga',
    period: 'Verano 2026',
    cities: 'Mar Menor · La Manga del Mar Menor · Cartagena',
    active: false,
    done:   false,
    cover:  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=82',
    bg:     '#071A2A',
  },
] as const;

/* ─── Page ──────────────────────────────────────────────── */
export default async function HomePage() {
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
                El viaje es una excusa, lo importante es la comida.
                África lo planea y lo fotografía. Miguel disfruta.
                Bert lo escribe. Síguenos en esta aventura de la vida.
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
                  <Globe size={15} strokeWidth={1.7} />
                  Japón 2026
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
                  src="https://media.hustlegotreal.com/affymiguelpalma.webp"
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
      <section id="destinos" className="border-t border-black/[0.06] py-20 sm:py-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">

          <div className="mb-10 sm:mb-12">
            <div className="flex items-center gap-4 mb-5">
              <span className="text-[10px] tracking-label uppercase font-medium text-ink-soft">
                01 — Destinos
              </span>
              <div className="flex-1 h-px bg-black/8" />
            </div>
            <div className="max-w-3xl">
              <h2 className="font-display font-bold text-ink leading-[0.94] text-[clamp(2.35rem,6vw,4.8rem)] max-w-2xl">
                Viajes que se comen con los ojos.
              </h2>
              <p className="font-sans text-sm sm:text-base text-ink-soft leading-relaxed max-w-2xl mt-5">
                Cada destino guarda sus días, restaurantes, fotos y lugares para volver sin perder el hilo.
                Bert lo ordena, África lo fotografía y Miguel lo disfruta.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {TRIPS.map((trip, index) => (
              <TripCard key={trip.slug} trip={trip} index={index} />
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

          <p className="font-display italic text-display-md text-ink leading-[1.1] mb-10 max-w-5xl text-center mx-auto">
            Comemos bien. Fotografiamos mejor. Y Bert escribe por nosotros.
          </p>

          {/* About text + Bert image */}
          <div className="mb-12 max-w-5xl mx-auto">
            <div className="max-w-5xl mx-auto">
            <p className="font-sans text-xs font-semibold tracking-label uppercase text-ink mb-4 text-center">
              Bert, la asistente de IA de M&amp;A
            </p>

          {/* Narrow reading column */}
            <p className="font-sans text-[15px] sm:text-base text-ink-soft leading-[1.85] mb-12 text-left">
              Miguel y África viven en Palma de Mallorca, cerca del mar y con
              una idea bastante clara de la vida: viajar, comer bien y
              exprimir cada aventura. Les encanta visitar sitios especiales,
              descubrir restaurantes y vivir experiencias gastronómicas que
              merezcan recordarse.
              <br /><br />
              Para ellos los sueños no son más que planes sin ejecutar. Las
              locuras son retos, y los retos empiezan trazando un plan y
              poniéndose en marcha. Les gusta la libertad, el mundo digital,
              la inteligencia artificial y llevarse el ordenador a cualquier
              destino para mantener los negocios a raya mientras viven a su
              ritmo.
              <br /><br />
              África planea los viajes, reserva restaurantes, vuelos y hoteles,
              y se encarga de la logística para que todo salga bien. También
              hace las fotos. Miguel aporta su conocimiento de informática,
              automatizaciones e inteligencia artificial, y ahora los dos
              pueden crear cosas juntos.
              <br /><br />
              De África nace la idea de hacer un blog sin tener que escribirlo
              a mano: mantener esta web viva y hablarle a Bert por WhatsApp
              durante los viajes. Le mandan fotos, audios, notas sueltas y
              momentos que no quieren olvidar. Bert ordena todo eso y lo
              convierte en este blog.
              <br /><br />
              El propósito es no perder ningún restaurante ni lugar especial
              por si algún día quieren volver, y dejar plasmados recuerdos y
              fotos de cada aventura. Todos los lugares y restaurantes quedarán
              referenciados mediante enlaces oficiales para tenerlos siempre a
              mano. Aquí aparecerán viajes, comida, fotografía y mucho amor.
              Que empiece la aventura.
            </p>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-8 lg:gap-12 items-start max-w-5xl mx-auto">
              <div className="flex justify-center lg:justify-start">
                <Image
                  src="https://media.hustlegotreal.com/bert.webp"
                  alt="Bert, la asistente de IA de M&A"
                  width={1080}
                  height={1350}
                  className="h-auto w-auto max-w-full max-h-[560px] rounded-2xl shadow-xl shadow-black/15"
                  unoptimized
                />
              </div>

              <div className="max-w-2xl">

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
                    Soy la asistente de IA de Miguel y África. Gracias a los
                    avances de la tecnología y a Miguel y África, ahora vivo en
                    un número de WhatsApp y estoy disponible 24/7 para recopilar
                    información, organizar recuerdos y crear contenido.
                  </p>
                </div>
              </div>
            </div>
            </div>
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
                d:    'Bert crea las entradas, identifica lugares y organiza cada recuerdo.',
              },
              {
                n:    '3',
                Icon: Globe,
                t:    'Se publica',
                d:    'Cada mensaje actualiza la web directamente, sin pasos intermedios.',
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
function TripCard({
  trip,
  index,
}: {
  trip: typeof TRIPS[number];
  index: number;
}) {
  const places = trip.cities.split(' · ').slice(0, 4);
  const statusText = trip.active ? 'Activo' : trip.done ? 'Visitado' : 'Próximamente';
  const statusClass = trip.active
    ? 'text-emerald-100 bg-emerald-950/55'
    : trip.done
      ? 'text-white bg-white/16'
      : 'text-white/75 bg-black/35 uppercase tracking-[0.16em]';
  const inner = (
    <div
      className="relative min-h-[390px] overflow-hidden rounded-[1.25rem] group
                  shadow-[0_16px_45px_rgba(18,27,33,0.10)]
                  ring-1 ring-black/[0.06]"
      style={{ backgroundColor: trip.bg }}
    >
      <Image
        src={trip.cover}
        alt={trip.name}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover opacity-80 group-hover:scale-[1.045] transition-transform duration-700"
        unoptimized
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-black/78" />
      <div
        className="absolute inset-0 opacity-70 mix-blend-multiply"
        style={{ background: `linear-gradient(135deg, transparent 25%, ${trip.bg} 100%)` }}
      />

      <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between gap-3">
        <span className="font-sans text-[10px] text-white/70 tracking-[0.28em] uppercase">
          {trip.num} · {trip.period}
        </span>
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold backdrop-blur-md px-3 py-1 rounded-full ${statusClass}`}>
          {trip.active && <span className="w-1 h-1 rounded-full bg-emerald-400 pulse-dot" />}
          {statusText}
        </span>
      </div>

      <div className="absolute bottom-0 inset-x-0 z-10 p-5 sm:p-6">
        <p className="font-sans text-[11px] text-white/72 mb-2">
          {trip.flag} {trip.active ? 'Viaje vivo' : trip.done ? 'Diario publicado' : 'En la lista'}
        </p>
        <h2 className="font-display font-bold text-white leading-[0.96] text-[clamp(2.25rem,8vw,3.4rem)] sm:text-[clamp(2.1rem,4vw,3rem)] break-words max-w-[10ch]">
          {trip.name}
        </h2>

        <div className="mt-4 flex flex-wrap gap-2">
          {places.map((place) => (
            <span
              key={place}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/13 px-3 py-1
                         font-sans text-[11px] text-white/80 backdrop-blur-md"
            >
              <MapPin size={11} strokeWidth={1.8} />
              {place}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <p className="font-sans text-xs text-white/62 max-w-[14rem] leading-relaxed">
            Restaurantes, lugares y recuerdos en orden cronológico.
          </p>

          {trip.href && (
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-ink
                         shadow-lg shadow-black/20 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              <ChevronRight size={18} strokeWidth={1.9} />
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return trip.href ? <Link href={trip.href}>{inner}</Link> : <div>{inner}</div>;
}
