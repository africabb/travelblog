import { fetchDrafts, fetchDays } from '@/lib/api';
import NavBar from '@/components/NavBar';
import EntryCard from '@/components/EntryCard';
import DraftActions from '@/components/DraftActions';
import Link from 'next/link';
import { publishDay } from '@/lib/api';
import PublishDayButton from './PublishDayButton';
import type { Entry } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function DraftsPage({
  searchParams,
}: {
  searchParams: { date?: string };
}) {
  const { date } = searchParams;

  const [drafts, days] = await Promise.all([
    fetchDrafts(date).catch(() => [] as Entry[]),
    fetchDays().catch(() => []),
  ]);

  // Agrupar drafts por fecha
  const byDate = drafts.reduce<Record<string, Entry[]>>((acc, entry) => {
    acc[entry.date] = acc[entry.date] ?? [];
    acc[entry.date].push(entry);
    return acc;
  }, {});

  const sortedDates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

  // Fechas con actividad para el selector
  const activeDays = days.filter((d) => d.has_drafts);

  return (
    <div className="min-h-screen bg-cream">
      <NavBar
        title="Borradores"
        right={
          <Link href="/feed" className="text-xs text-ink-soft hover:text-ink transition-colors">
            Ver diario →
          </Link>
        }
      />

      <main className="max-w-2xl mx-auto px-4 py-4 pb-20">

        {/* Selector de fecha */}
        {activeDays.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            <Link
              href="/drafts"
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                ${!date ? 'bg-ink text-white' : 'bg-paper text-ink-soft hover:bg-stone-200'}`}
            >
              Todos
            </Link>
            {activeDays.map((d) => (
              <Link
                key={d.date}
                href={`/drafts?date=${d.date}`}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                  ${date === d.date ? 'bg-ink text-white' : 'bg-paper text-ink-soft hover:bg-stone-200'}`}
              >
                {new Date(d.date + 'T00:00:00').toLocaleDateString('es-ES', {
                  day: 'numeric', month: 'short',
                })}
                {d.entry_count > 0 && (
                  <span className="ml-1 opacity-60">·{d.entry_count}</span>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Empty state */}
        {drafts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🌸</p>
            <p className="font-serif text-lg text-ink mb-1">Sin borradores pendientes</p>
            <p className="text-sm text-ink-soft">
              {date ? 'No hay nada de ese día.' : 'Bert guardará aquí lo que captures.'}
            </p>
          </div>
        )}

        {/* Agrupado por fecha */}
        {sortedDates.map((d) => {
          const entries = byDate[d];
          const label   = new Date(d + 'T00:00:00').toLocaleDateString('es-ES', {
            weekday: 'long', day: 'numeric', month: 'long',
          });

          return (
            <section key={d} className="mb-8">
              {/* Cabecera del día */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-serif text-base font-semibold text-ink capitalize">{label}</h2>
                  <p className="text-xs text-ink-soft">
                    {entries.length} entrada{entries.length > 1 ? 's' : ''}
                  </p>
                </div>
                <PublishDayButton date={d} />
              </div>

              <div className="flex flex-col gap-3">
                {entries.map((entry) => (
                  <div key={entry.id} className="flex flex-col gap-2">
                    <EntryCard entry={entry} linkTo={`/drafts/${entry.id}`} />
                    <DraftActions id={entry.id} status={entry.status} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
