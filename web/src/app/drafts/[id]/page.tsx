import { fetchDraft } from '@/lib/api';
import NavBar from '@/components/NavBar';
import MediaGrid from '@/components/MediaGrid';
import DraftActions from '@/components/DraftActions';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DraftDetailPage({ params }: { params: { id: string } }) {
  let entry;
  try {
    entry = await fetchDraft(params.id);
  } catch {
    notFound();
  }

  const dateLabel = new Date(entry.date + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <div className="min-h-screen bg-cream">
      <NavBar title="Borrador" backHref="/drafts" />

      <main className="max-w-2xl mx-auto px-4 py-5 pb-24">

        {/* Date chip */}
        <p className="text-xs text-gold font-medium tracking-wider uppercase mb-3 capitalize">
          {dateLabel}
        </p>

        {/* Title */}
        <h1 className="font-serif text-2xl font-bold text-ink leading-tight mb-2">
          {entry.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap gap-3 text-sm text-ink-soft mb-4">
          {entry.location && <span>📍 {entry.location}</span>}
          {entry.city     && entry.city !== entry.location && <span>🏙 {entry.city}</span>}
          {entry.mood     && <span>{entry.mood}</span>}
        </div>

        {/* Media */}
        {entry.media?.length > 0 && (
          <div className="mb-5 -mx-4 sm:mx-0 sm:rounded-2xl overflow-hidden">
            <MediaGrid media={entry.media} />
          </div>
        )}

        {/* Body */}
        <div className="prose prose-sm max-w-none text-ink-soft leading-relaxed mb-6">
          {entry.body.split('\n').map((p, i) => (
            <p key={i} className="mb-3 last:mb-0">{p}</p>
          ))}
        </div>

        {/* Tags */}
        {entry.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {entry.tags.map((t) => (
              <span key={t} className="text-xs bg-paper text-ink-soft px-2.5 py-1 rounded-full">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Places */}
        {entry.places?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-soft mb-2">
              Lugares
            </h2>
            <div className="flex flex-col gap-2">
              {entry.places.map((p) => (
                <div key={p.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-black/5">
                  <span className="text-xl">
                    {p.type === 'restaurant' ? '🍜' :
                     p.type === 'temple'     ? '⛩️' :
                     p.type === 'park'       ? '🌳' : '📍'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-ink truncate">{p.name}</p>
                    {p.name_jp && <p className="text-xs text-ink-soft">{p.name_jp}</p>}
                    {p.city    && <p className="text-xs text-ink-soft">{p.city}</p>}
                  </div>
                  {p.rating && (
                    <span className="text-xs text-gold font-semibold shrink-0">★ {p.rating}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Source */}
        {entry.source_message_id && (
          <p className="text-[10px] text-ink-soft/50 mb-6">
            vía {entry.source_channel ?? 'whatsapp'} · {entry.source_message_id}
          </p>
        )}

        {/* Actions — sticky at bottom */}
        <div className="fixed bottom-0 inset-x-0 bg-cream/95 backdrop-blur border-t border-black/5 p-4 safe-bottom">
          <div className="max-w-2xl mx-auto">
            <DraftActions id={entry.id} status={entry.status} />
          </div>
        </div>

      </main>
    </div>
  );
}
