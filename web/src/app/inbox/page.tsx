import { fetchDrafts, fetchDays, fetchStats } from '@/lib/api';
import NavBar from '@/components/NavBar';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function InboxPage() {
  const [drafts, days, stats] = await Promise.all([
    fetchDrafts().catch(() => []),
    fetchDays().catch(() => []),
    fetchStats().catch(() => null),
  ]);

  // Hoy (zona horaria local del servidor)
  const today    = new Date().toISOString().slice(0, 10);
  const todayDrafts = drafts.filter((d) => d.date === today);
  const olderDrafts = drafts.filter((d) => d.date !== today);

  // Total fotos en draft (cuenta sumando media de cada draft)
  const photoCount = drafts.reduce(
    (n, d) => n + (d.media?.filter((m) => m.type === 'photo').length ?? 0),
    0,
  );

  // Días con drafts pendientes
  const daysWithDrafts = days.filter((d) => d.has_drafts);

  return (
    <div className="min-h-screen bg-cream">
      <NavBar
        title="Inbox"
        right={
          <Link href="/feed" className="text-xs text-ink-soft hover:text-ink transition-colors">
            Diario →
          </Link>
        }
      />

      <main className="max-w-2xl mx-auto px-4 py-5 pb-20">

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <StatCard
            n={stats?.pending_drafts ?? drafts.length}
            label="pendientes"
            tone="amber"
          />
          <StatCard
            n={photoCount}
            label="fotos"
            tone="rose"
          />
          <StatCard
            n={daysWithDrafts.length}
            label={daysWithDrafts.length === 1 ? 'día' : 'días'}
            tone="emerald"
          />
        </div>

        {/* Hoy */}
        {todayDrafts.length > 0 && (
          <section className="mb-8">
            <h2 className="font-serif text-base font-semibold text-ink mb-3">
              Hoy
            </h2>
            <div className="flex flex-col gap-2">
              {todayDrafts.map((d) => (
                <DraftRow key={d.id} draft={d} />
              ))}
            </div>
            <Link
              href={`/drafts?date=${today}`}
              className="block text-center text-sm text-red font-medium mt-3 hover:underline"
            >
              Revisar todo de hoy →
            </Link>
          </section>
        )}

        {/* Días anteriores */}
        {daysWithDrafts.filter((d) => d.date !== today).length > 0 && (
          <section className="mb-8">
            <h2 className="font-serif text-base font-semibold text-ink mb-3">
              Días anteriores
            </h2>
            <div className="flex flex-col gap-1">
              {daysWithDrafts
                .filter((d) => d.date !== today)
                .map((d) => {
                  const label = new Date(d.date + 'T00:00:00').toLocaleDateString('es-ES', {
                    weekday: 'long', day: 'numeric', month: 'long',
                  });
                  return (
                    <Link
                      key={d.date}
                      href={`/drafts?date=${d.date}`}
                      className="flex items-center justify-between bg-white rounded-xl px-4 py-3
                                 border border-black/5 hover:border-black/15 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-ink capitalize">{label}</p>
                        <p className="text-xs text-ink-soft mt-0.5">
                          {d.entry_count} entrada{d.entry_count > 1 ? 's' : ''}
                          {d.media_count > 0 && ` · ${d.media_count} archivo${d.media_count > 1 ? 's' : ''}`}
                          {d.city && ` · ${d.city}`}
                        </p>
                      </div>
                      <span className="text-ink-soft">›</span>
                    </Link>
                  );
                })}
            </div>
          </section>
        )}

        {/* Empty */}
        {drafts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🌸</p>
            <p className="font-serif text-lg text-ink mb-1">Inbox vacío</p>
            <p className="text-sm text-ink-soft">Bert guardará aquí lo que captures.</p>
          </div>
        )}

      </main>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────
function StatCard({
  n, label, tone,
}: {
  n: number;
  label: string;
  tone: 'amber' | 'rose' | 'emerald';
}) {
  const colors = {
    amber:   'bg-amber-50  text-amber-700  border-amber-100',
    rose:    'bg-rose-50   text-rose-700   border-rose-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  }[tone];

  return (
    <div className={`rounded-2xl border ${colors} px-3 py-4 text-center`}>
      <p className="font-serif text-2xl font-bold leading-none">{n}</p>
      <p className="text-[10px] uppercase tracking-wider mt-1 opacity-80">{label}</p>
    </div>
  );
}

function DraftRow({ draft }: { draft: Awaited<ReturnType<typeof fetchDrafts>>[number] }) {
  const cover = draft.media?.find((m) => m.type === 'photo');

  return (
    <Link
      href={`/drafts/${draft.id}`}
      className="flex gap-3 bg-white rounded-xl p-3 border border-black/5
                 hover:border-black/15 transition-colors"
    >
      {cover ? (
        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-stone-100">
          <Image src={cover.url} alt="" fill className="object-cover" sizes="64px" />
        </div>
      ) : (
        <div className="w-16 h-16 rounded-lg bg-paper shrink-0 flex items-center justify-center text-2xl">
          📝
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-ink truncate">{draft.title}</p>
        {draft.location && (
          <p className="text-xs text-ink-soft mt-0.5">📍 {draft.location}</p>
        )}
        <p className="text-xs text-ink-soft/70 mt-1 line-clamp-2">{draft.body}</p>
      </div>
    </Link>
  );
}
