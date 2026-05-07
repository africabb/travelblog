'use client';

import { useEffect, useRef } from 'react';

/* ─── Visited + upcoming locations ──────────────────────── */
const LOCATIONS = [
  /* Greece — visited */
  { name: 'Corfú',            lat: 39.6243, lng: 19.9217, trip: 'Grecia en barco', entry: 'La llegada a Grecia', date: '7 Julio 2023', href: '/grecia/2', done: true, image: 'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9867.jpg' },
  { name: 'Paleros',           lat: 38.7833, lng: 20.8667, trip: 'Grecia en barco', entry: 'De camino al lugar donde vive Mr. Bojangles', date: '8 Julio 2023', href: '/grecia/3', done: true, image: 'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9892-edited.jpg' },
  { name: 'Meganisi',          lat: 38.6436, lng: 20.7742, trip: 'Grecia en barco', entry: 'El encuentro con Mr. Bojangles', date: 'Verano 2023', href: '/grecia/4', done: true, image: 'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_9951.jpg' },
  { name: 'Sivota (Lefkada)',  lat: 38.5833, lng: 20.5667, trip: 'Grecia en barco', entry: 'Sivota', date: 'Verano 2023', href: '/grecia/5', done: true, image: 'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/img_0001-3045918172-e1689257774541-edited.jpg' },
  { name: 'Kastos',            lat: 38.5656, lng: 20.8898, trip: 'Grecia en barco', entry: 'Kastos', date: '13 Julio 2023', href: '/grecia/6', done: true, image: 'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/dsc02754.jpg' },
  { name: 'Kalamos',           lat: 38.6194, lng: 20.9298, trip: 'Grecia en barco', entry: 'Kalamos', date: '14 Julio 2023', href: '/grecia/7', done: true, image: 'https://deaventurassevive.wordpress.com/wp-content/uploads/2023/07/dsc02781.jpg' },
  /* Spain - visited */
  { name: 'Palma de Mallorca',  lat: 39.5696, lng: 2.6502, trip: 'Palma de Mallorca', entry: 'Diario de Palma', date: '2026', href: '/palma', done: true, image: 'https://media.hustlegotreal.com/affymiguelpalma.webp' },
  { name: 'Murcia',             lat: 37.9922, lng: -1.1307, trip: 'Murcia', entry: 'Murcia empieza en casa de María', date: '6 Mayo 2026', href: '/viaje/murcia/2026-05-06', done: true, image: 'https://japon.amurasoftware.com/uploads/photos/2026-05-07/10a0ecf0-d3ef-45be-a764-9dc23d93820f..jpg' },
  /* Japan — upcoming */
  { name: 'Tokio',    lat: 35.6762, lng: 139.6503, trip: 'Japón 2026', entry: 'Diario de Japón', date: 'Primavera 2026', href: '/feed', done: false },
  { name: 'Kioto',    lat: 35.0116, lng: 135.7681, trip: 'Japón 2026', entry: 'Diario de Japón', date: 'Primavera 2026', href: '/feed', done: false },
  { name: 'Osaka',    lat: 34.6937, lng: 135.5023, trip: 'Japón 2026', entry: 'Diario de Japón', date: 'Primavera 2026', href: '/feed', done: false },
  { name: 'Nara',     lat: 34.6851, lng: 135.8048, trip: 'Japón 2026', entry: 'Diario de Japón', date: 'Primavera 2026', href: '/feed', done: false },
  { name: 'Hiroshima',lat: 34.3853, lng: 132.4553, trip: 'Japón 2026', entry: 'Diario de Japón', date: 'Primavera 2026', href: '/feed', done: false },
];

const BRAND  = '#669bbc';
const FUTURE = '#b0b0b0';
const VISITED_COUNTRIES = ['España', 'Grecia'];
const WORLD_COUNTRIES = 195;
const VISITED_PERCENT = ((VISITED_COUNTRIES.length / WORLD_COUNTRIES) * 100).toFixed(1);

/* ─── WorldMap ───────────────────────────────────────────── */
export default function WorldMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<ReturnType<typeof import('leaflet')['map']> | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    (async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      const map = L.map(containerRef.current!, {
        center:          [36, 60],
        zoom:            2,
        zoomControl:     false,
        scrollWheelZoom: true,
        attributionControl: true,
        worldCopyJump:   true,
      });

      mapRef.current = map;

      /* Google Maps color tiles */
      L.tileLayer(
        'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
        {
          attribution: '&copy; Google Maps',
          maxZoom: 18,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }
      ).addTo(map);

      /* Custom pin icon */
      const makeIcon = (done: boolean) =>
        L.divIcon({
          html: `
            <div style="
              width:12px;height:12px;border-radius:50%;
              background:${done ? BRAND : FUTURE};
              border:2px solid white;
              box-shadow:0 2px 6px rgba(0,0,0,0.25);
            "></div>`,
          className: '',
          iconSize:   [12, 12],
          iconAnchor: [6, 6],
          popupAnchor:[0, -10],
        });

      /* Add markers */
      LOCATIONS.forEach((loc) => {
        const marker = L.marker([loc.lat, loc.lng], {
          icon: makeIcon(loc.done),
          title: `${loc.name} - ${loc.trip}`,
        }).addTo(map);

        marker.bindPopup(
          `<div style="
             font-family:sans-serif;
             width:190px;
             color:#0c0c0c;
           ">
             ${loc.image ? `<img src="${loc.image}" alt="" style="width:100%;height:74px;object-fit:cover;border-radius:8px;margin-bottom:8px;" />` : ''}
             <strong style="display:block;font-size:13px;line-height:1.25;margin-bottom:3px;">${loc.name}</strong>
             <span style="display:block;color:#6b6760;font-size:11px;line-height:1.35;margin-bottom:3px;">${loc.trip}</span>
             <span style="display:block;color:#6b6760;font-size:11px;line-height:1.35;margin-bottom:5px;">${loc.date}</span>
             <span style="display:block;color:#0c0c0c;font-size:12px;line-height:1.35;margin-bottom:9px;">${loc.entry}</span>
             <a href="${loc.href}" style="
               display:inline-flex;
               align-items:center;
               justify-content:center;
               padding:7px 10px;
               border-radius:999px;
               background:${loc.done ? BRAND : '#777'};
               color:white;
               font-size:11px;
               font-weight:700;
               text-decoration:none;
             ">Ir al blog &rarr;</a>
           </div>`,
          { closeButton: true, maxWidth: 220 }
        );
      });

      setTimeout(() => map.invalidateSize(), 80);

      /* Fix tile gap on resize */
      window.addEventListener('resize', () => map.invalidateSize());
    })();

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_220px] items-center gap-8 lg:gap-10">
      <div className="relative mx-auto w-full max-w-[520px] aspect-square rounded-full overflow-hidden bg-[#d8e7ef]
                      shadow-[0_24px_80px_rgba(11,24,38,0.18)] ring-1 ring-black/10">
        <div
          ref={containerRef}
          className="absolute inset-0"
        />
        <div className="pointer-events-none absolute inset-0 rounded-full ring-[18px] ring-white/20 shadow-[inset_0_0_42px_rgba(8,30,48,0.30)]" />
      </div>

      <div className="text-center lg:text-left">
        <p className="text-[10px] tracking-label uppercase font-medium text-ink-soft mb-3">
          Mundo visitado
        </p>
        <p className="font-display font-bold text-ink leading-none text-[clamp(3.5rem,9vw,5.8rem)]">
          {VISITED_PERCENT}%
        </p>
        <p className="font-sans text-sm text-ink-soft leading-relaxed mt-4 max-w-[16rem] mx-auto lg:mx-0">
          {VISITED_COUNTRIES.length} de {WORLD_COUNTRIES} países guardados en el diario.
        </p>
      </div>
    </div>
  );
}
