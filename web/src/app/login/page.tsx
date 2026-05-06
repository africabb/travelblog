import { login } from './actions';
import { Globe } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string; error?: string };
}) {
  const next  = searchParams.next  ?? '/feed';
  const error = searchParams.error;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-cream">
      <div className="w-full max-w-xs">
        <div className="text-center mb-8">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: '#669bbc' }}
          >
            <Globe size={24} strokeWidth={1.6} />
          </div>
          <h1 className="font-serif text-2xl font-bold text-ink">Diario privado</h1>
        </div>

        <form action={login} className="flex flex-col gap-3">
          <input type="hidden" name="next" value={next} />

          <input
            type="password"
            name="pin"
            autoFocus
            inputMode="numeric"
            placeholder="PIN"
            required
            className="w-full px-4 py-3 text-center text-lg tracking-[0.3em] font-mono
                       bg-white rounded-xl border border-stone-200
                       focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20
                       transition-all"
          />

          {error && (
            <p className="text-xs text-red text-center -mt-1">PIN incorrecto</p>
          )}

          <button
            type="submit"
            className="w-full py-3 text-white rounded-xl font-medium text-sm
                       transition-colors shadow-lg"
            style={{ backgroundColor: '#669bbc', boxShadow: '0 18px 35px rgba(102, 155, 188, 0.22)' }}
          >
            Entrar
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-ink-soft/60">
          <a href="/feed" className="hover:text-ink-soft">Ver diario público →</a>
        </p>
      </div>
    </div>
  );
}
