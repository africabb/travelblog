'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { publishDay } from '@/lib/api';

export default function PublishDayButton({ date }: { date: string }) {
  const router  = useRouter();
  const [busy,  setBusy]  = useState(false);
  const [done,  setDone]  = useState(false);

  async function handle() {
    if (!confirm(`¿Publicar todas las entradas del ${date}?`)) return;
    setBusy(true);
    try {
      await publishDay(date);
      setDone(true);
      router.refresh();
    } catch {
      alert('No se pudo publicar. Comprueba que hay entradas en borrador.');
    } finally {
      setBusy(false);
    }
  }

  if (done) return <span className="text-xs text-emerald-600 font-medium">✓ Publicado</span>;

  return (
    <button
      onClick={handle}
      disabled={busy}
      className="text-xs font-medium text-red border border-red/30 px-3 py-1.5 rounded-full
                 hover:bg-red hover:text-white transition-colors disabled:opacity-40"
    >
      {busy ? '…' : 'Publicar día'}
    </button>
  );
}
