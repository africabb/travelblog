'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { approveDraft, publishDraft, deleteDraft } from '@/lib/api';

interface Props {
  id:     string;
  status: 'draft' | 'approved' | 'published';
}

export default function DraftActions({ id, status }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error,   setError]   = useState<string | null>(null);

  async function handle(action: () => Promise<unknown>, label: string) {
    setLoading(label);
    setError(null);
    try {
      await action();
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(null);
    }
  }

  if (status === 'published') {
    return (
      <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
        <span>✓</span><span>Publicado</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <p className="text-xs text-red text-center">{error}</p>
      )}
      <div className="flex gap-2">
        {status === 'draft' && (
          <button
            className="flex-1 py-2 rounded-xl text-sm font-medium border border-gold text-gold
                       hover:bg-gold hover:text-white transition-colors disabled:opacity-40"
            disabled={loading !== null}
            onClick={() => handle(() => approveDraft(id), 'approve')}
          >
            {loading === 'approve' ? '…' : '✓ Aprobar'}
          </button>
        )}
        <button
          className="flex-1 py-2 rounded-xl text-sm font-medium bg-red text-white
                     hover:bg-red-deep transition-colors disabled:opacity-40"
          disabled={loading !== null}
          onClick={() => handle(() => publishDraft(id), 'publish')}
        >
          {loading === 'publish' ? '…' : '🌐 Publicar'}
        </button>
        <button
          className="py-2 px-3 rounded-xl text-sm text-ink-soft border border-stone-200
                     hover:bg-paper hover:text-red transition-colors disabled:opacity-40"
          disabled={loading !== null}
          onClick={() => handle(() => deleteDraft(id), 'delete')}
          title="Eliminar borrador"
        >
          {loading === 'delete' ? '…' : '🗑'}
        </button>
      </div>
    </div>
  );
}
