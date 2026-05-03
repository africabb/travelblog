import { fetchDay } from '@/lib/api';
import NavBar from '@/components/NavBar';
import EntryCard from '@/components/EntryCard';
import PublishDayButton from '@/app/drafts/PublishDayButton';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DayPage({ params }: { params: { date: string } }) {
  let day;
  try {
    day = await fetchDay(params.date);
  } catch {
    notFound();
  }

  const { date, entries, places } = day;

  const dateLabel = new Date(date + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const hasDrafts = entries.some((e) => e.status !== 'published');
  const cities    = [...new Set(entries.map((e) => e.city).filter(Boolean))];

  return (
    <div className="min-h-screen bg-cream">
      <NavBar
        title={dateLabel}
        backHref="/drafts"
        right={hasDrafts ? <PublishDayButton date={date} /> : undefined}
      />

      <main className="max-w-2xl mx-auto px-4 py-5 pb-10">

        {/* Day header */}
        <div className="mb-6">
          {cities.length > 0 && (
            <p className="text-sm text-ink-soft mb-1">📍 {cities.join(' · ')}</p>
          )}
          <div className="flex gap-4 text-xs text-ink-soft">
            <span>{entries.length} entrada{entries.length > 1 ? 's' : ''}</span>
            <span>{entries.reduce((n, e) => n + (e.media?.length ?? 0), 0)} fotos</span>
            {places.length > 0 && <span>{places.length} lugar{places.length > 1 ? 'es' : ''}</span>}
          </div>
        </div>

        {/* Entries */}
        <div className="flex flex-col gap-4 mb-8">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              linkTo={entry.status !== 'published' ? `/drafts/${entry.id}` : undefined}
            />
          ))}
        </div>

        {/* Places visited */}
        {places.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-soft mb-3">
              Lugares del día
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {places.map((p) => (
                <div key={p.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-black/5">
                  <span className="text-2xl">
                    {p.type === 'restaurant' ? '🍜' :
                     p.type === 'temple'     ? '⛩️' :
                     p.type === 'park'       ? '🌳' :
                     p.type === 'museum'     ? '🏛️' :
                     p.type === 'shop'       ? '🛍️' : '📍'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <p className="font-medium text-sm text-ink">{p.name}</p>
                      {p.name_jp && (
                        <span className="text-xs text-ink-soft font-serif">{p.name_jp}</span>
                      )}
                    </div>
                    <div className="flex gap-2 text-xs text-ink-soft mt-0.5">
                      {p.city     && <span>{p.city}</span>}
                      {p.category && <span>{p.category}</span>}
                      {p.price_range && <span>{p.price_range}</span>}
                    </div>
                    {p.description && (
                      <p className="text-xs text-ink-soft mt-1 line-clamp-2">{p.description}</p>
                    )}
                  </div>
                  {p.rating && (
                    <div className="text-right shrink-0">
                      <span className="text-gold font-semibold text-sm">★{p.rating}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
