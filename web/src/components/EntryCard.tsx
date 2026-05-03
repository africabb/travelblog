import Link from 'next/link';
import MediaGrid from './MediaGrid';
import type { Entry, Place } from '@/lib/types';

interface Props {
  entry:    Entry;
  showDate?: boolean;
  linkTo?:  string;
}

const STATUS_PILL: Record<string, string> = {
  draft:     'bg-amber-100 text-amber-700',
  approved:  'bg-blue-100  text-blue-700',
  published: 'bg-emerald-100 text-emerald-700',
};

const STATUS_LABEL: Record<string, string> = {
  draft:     'Borrador',
  approved:  'Aprobado',
  published: 'Publicado',
};

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}

export default function EntryCard({ entry, showDate = false, linkTo }: Props) {
  const card = (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5 transition-shadow hover:shadow-md">
      {entry.media?.length > 0 && (
        <div className="overflow-hidden">
          <MediaGrid media={entry.media} compact />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            {showDate && (
              <p className="text-xs text-gold font-medium tracking-wider uppercase mb-1">
                {formatDate(entry.date)}
              </p>
            )}
            <h3 className="font-serif text-base font-semibold text-ink leading-snug">
              {entry.title}
            </h3>
          </div>
          <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_PILL[entry.status]}`}>
            {STATUS_LABEL[entry.status]}
          </span>
        </div>

        {(entry.location || entry.mood) && (
          <div className="flex flex-wrap gap-2 mb-2 text-xs text-ink-soft">
            {entry.location && <span>Mapa: {entry.location}</span>}
            {entry.mood     && <span>{entry.mood}</span>}
          </div>
        )}

        <p className="text-sm text-ink-soft leading-relaxed line-clamp-3">{entry.body}</p>

        {entry.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {entry.tags.map((t) => (
              <span key={t} className="text-[10px] bg-paper text-ink-soft px-2 py-0.5 rounded-full">
                {t}
              </span>
            ))}
          </div>
        )}

        {entry.places?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {entry.places.map((p) => (
              linkTo ? (
                <span key={p.id} className="text-[10px] bg-sakura-soft text-red-deep px-2 py-0.5 rounded-full">
                  {placeLabel(p)}: {p.name}
                </span>
              ) : (
                <PlaceLinks key={p.id} place={p} />
              )
            ))}
          </div>
        )}
      </div>
    </article>
  );

  if (linkTo) {
    return <Link href={linkTo} className="block">{card}</Link>;
  }
  return card;
}

function PlaceLinks({ place }: { place: Place }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] bg-sakura-soft text-red-deep px-2 py-0.5 rounded-full">
      <span>{placeLabel(place)}: {place.name}</span>
      {place.google_maps_url && (
        <a href={place.google_maps_url} target="_blank" rel="noreferrer" className="font-semibold underline-offset-2 hover:underline">
          Maps
        </a>
      )}
      {place.official_url && (
        <a href={place.official_url} target="_blank" rel="noreferrer" className="font-semibold underline-offset-2 hover:underline">
          Web
        </a>
      )}
    </span>
  );
}

function placeLabel(place: Place) {
  return place.type === 'restaurant' ? 'Restaurante' : 'Lugar';
}
