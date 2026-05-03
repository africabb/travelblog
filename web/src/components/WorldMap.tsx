'use client';

import { useEffect, useRef } from 'react';

/* ─── Visited + upcoming locations ──────────────────────── */
const LOCATIONS = [
  /* Greece — visited */
  { name: 'Corfú',            lat: 39.6243, lng: 19.9217, trip: 'Grecia en barco', href: '/grecia/2', done: true  },
  { name: 'Paleros',           lat: 38.7833, lng: 20.8667, trip: 'Grecia en barco', href: '/grecia/3', done: true  },
  { name: 'Meganisi',          lat: 38.6436, lng: 20.7742, trip: 'Grecia en barco', href: '/grecia/4', done: true  },
  { name: 'Sivota (Lefkada)',  lat: 38.5833, lng: 20.5667, trip: 'Grecia en barco', href: '/grecia/5', done: true  },
  { name: 'Kastos',            lat: 38.5656, lng: 20.8898, trip: 'Grecia en barco', href: '/grecia/8', done: true  },
  { name: 'Kalamos',           lat: 38.6194, lng: 20.9298, trip: 'Grecia en barco', href: '/grecia/9', done: true  },
  /* Japan — upcoming */
  { name: 'Tokio',    lat: 35.6762, lng: 139.6503, trip: 'Japón 2026', href: '/feed', done: false },
  { name: 'Kioto',    lat: 35.0116, lng: 135.7681, trip: 'Japón 2026', href: '/feed', done: false },
  { name: 'Osaka',    lat: 34.6937, lng: 135.5023, trip: 'Japón 2026', href: '/feed', done: false },
  { name: 'Nara',     lat: 34.6851, lng: 135.8048, trip: 'Japón 2026', href: '/feed', done: false },
  { name: 'Hiroshima',lat: 34.3853, lng: 132.4553, trip: 'Japón 2026', href: '/feed', done: false },
];

const BRAND  = '#669bbc';
const FUTURE = '#b0b0b0';

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
        zoom:            3,
        zoomControl:     true,
        scrollWheelZoom: true,
        attributionControl: true,
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
          `<a href="${loc.href}" style="
             display:block;
             font-family:sans-serif;
             font-size:12px;
             line-height:1.4;
             color:#0c0c0c;
             text-decoration:none;
           ">
             <strong>${loc.name}</strong>
             <br/><span style="color:#6b6760">${loc.trip}</span>
             <br/><span style="color:${loc.done ? BRAND : '#777'};font-weight:600">Abrir blog &rarr;</span>
           </a>`,
          { closeButton: false, maxWidth: 180 }
        );

        marker.on('click', () => {
          window.location.href = loc.href;
        });
      });

      /* Fix tile gap on resize */
      window.addEventListener('resize', () => map.invalidateSize());
    })();

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-2xl overflow-hidden
                 shadow-[0_2px_20px_rgba(0,0,0,0.08)]"
      style={{ height: '420px' }}
    />
  );
}
