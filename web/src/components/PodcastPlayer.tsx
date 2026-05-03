'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Play, Pause } from 'lucide-react';

export default function PodcastPlayer() {
  const [playing,  setPlaying]  = useState(false);
  const [progress, setProgress] = useState(0);       // 0-100
  const [current,  setCurrent]  = useState(0);       // seconds
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  /* sync state when audio events fire */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime  = () => {
      setCurrent(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onMeta  = () => setDuration(audio.duration);
    const onEnded = () => { setPlaying(false); setProgress(0); setCurrent(0); };

    audio.addEventListener('timeupdate',     onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended',          onEnded);
    return () => {
      audio.removeEventListener('timeupdate',     onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended',          onEnded);
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else         { await audio.play(); setPlaying(true); }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  };

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-8 mb-2 border border-black/[0.08] rounded-2xl p-4 bg-white
                    shadow-sm hover:shadow-md transition-shadow max-w-sm">
      <audio
        ref={audioRef}
        src="https://media.hustlegotreal.com/Vivir-viajando-mientras-Bert-escribe-el-blog.mp3"
        preload="metadata"
      />

      {/* Header row */}
      <div className="flex items-center gap-3 mb-3">
        {/* Play / pause button */}
        <button
          onClick={toggle}
          aria-label={playing ? 'Pausar' : 'Reproducir'}
          className="w-10 h-10 rounded-full flex items-center justify-center
                     shrink-0 transition-opacity duration-200 hover:opacity-80"
          style={{ backgroundColor: '#669bbc' }}
        >
          {playing
            ? <Pause  size={14} fill="white" color="white" strokeWidth={0} />
            : <Play   size={14} fill="white" color="white" strokeWidth={0} />
          }
        </button>

        {/* Title + meta */}
        <div className="min-w-0 flex-1">
          <p className="font-sans font-semibold text-ink text-xs leading-tight truncate">
            Vivir viajando mientras Bert escribe el blog
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <Mic size={9} className="text-ink-soft shrink-0" strokeWidth={2} />
            <p className="font-sans text-[10px] text-ink-soft">Nuestro podcast · en español</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="h-1 rounded-full bg-black/8 cursor-pointer relative mb-1.5"
        onClick={seek}
      >
        <div
          className="h-full rounded-full transition-none"
          style={{ width: `${progress}%`, backgroundColor: '#669bbc' }}
        />
      </div>

      {/* Time */}
      <div className="flex justify-between">
        <span className="font-sans text-[9px] text-ink-muted">{fmt(current)}</span>
        <span className="font-sans text-[9px] text-ink-muted">{fmt(duration)}</span>
      </div>
    </div>
  );
}
