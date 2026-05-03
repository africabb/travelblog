'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Media } from '@/lib/types';

interface Props {
  media: Media[];
  compact?: boolean;
}

export default function MediaGrid({ media, compact = false }: Props) {
  const [lightbox, setLightbox] = useState<Media | null>(null);

  const photos = media.filter((m) => m.type === 'photo');
  const audios  = media.filter((m) => m.type === 'audio');

  if (!media.length) return null;

  const gridClass =
    photos.length === 1 ? 'grid-cols-1' :
    photos.length === 2 ? 'grid-cols-2' :
    photos.length === 3 ? 'grid-cols-2' :
    'grid-cols-2';

  return (
    <>
      {photos.length > 0 && (
        <div className={`grid ${gridClass} gap-1 rounded-2xl overflow-hidden`}>
          {photos.slice(0, compact ? 4 : undefined).map((m, i) => {
            const isLast = compact && i === 3 && photos.length > 4;
            const tall   = photos.length === 3 && i === 0;
            return (
              <div
                key={m.id}
                className={`relative bg-stone-200 cursor-pointer group
                  ${tall ? 'row-span-2' : ''}
                  ${compact ? 'aspect-square' : 'aspect-[4/3]'}`}
                onClick={() => setLightbox(m)}
              >
                <Image
                  src={m.url}
                  alt={m.caption ?? ''}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
                {isLast && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      +{photos.length - 4}
                    </span>
                  </div>
                )}
                {m.caption && !compact && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs">{m.caption}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {audios.map((a) => (
        <div key={a.id} className="flex items-center gap-3 bg-paper rounded-xl p-3 mt-2">
          <span className="text-xl">🎙️</span>
          <div className="flex-1 min-w-0">
            <audio controls className="w-full h-8" src={a.url} />
            {a.caption && <p className="text-xs text-ink-soft mt-1 truncate">{a.caption}</p>}
          </div>
        </div>
      ))}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative w-full max-w-2xl max-h-[80vh]">
            <Image
              src={lightbox.url}
              alt={lightbox.caption ?? ''}
              width={800}
              height={600}
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          {lightbox.caption && (
            <p className="mt-3 text-white/60 text-sm text-center font-serif italic">
              {lightbox.caption}
            </p>
          )}
          <button
            className="mt-4 text-white/40 text-sm hover:text-white/80 transition-colors"
            onClick={() => setLightbox(null)}
          >
            Cerrar
          </button>
        </div>
      )}
    </>
  );
}
