'use client';

/**
 * Animated sakura petals — pure CSS, no canvas.
 * Each petal has a different position, size, delay and duration
 * so they feel organic rather than mechanical.
 */

const PETALS = [
  { id:  0, left:  '4%', size: 11, delay:  0.0, dur: 13 },
  { id:  1, left: '13%', size:  8, delay:  1.8, dur: 10 },
  { id:  2, left: '22%', size: 14, delay:  3.4, dur: 15 },
  { id:  3, left: '33%', size:  9, delay:  0.7, dur: 11 },
  { id:  4, left: '42%', size: 12, delay:  5.2, dur: 14 },
  { id:  5, left: '51%', size:  7, delay:  2.1, dur:  9 },
  { id:  6, left: '61%', size: 13, delay:  6.0, dur: 16 },
  { id:  7, left: '70%', size:  9, delay:  1.3, dur: 12 },
  { id:  8, left: '79%', size: 10, delay:  7.5, dur: 13 },
  { id:  9, left: '88%', size: 14, delay:  4.0, dur: 11 },
  { id: 10, left: '95%', size:  8, delay:  2.8, dur:  8 },
  { id: 11, left:  '8%', size: 10, delay:  8.5, dur: 14 },
  { id: 12, left: '57%', size:  7, delay:  9.2, dur: 10 },
  { id: 13, left: '38%', size: 12, delay:  5.8, dur: 12 },
] as const;

export default function SakuraPetals() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {PETALS.map((p) => (
        <span
          key={p.id}
          className="sakura-petal"
          style={{
            left:              p.left,
            width:             p.size,
            height:            Math.round(p.size * 0.7),
            animationDelay:    `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}
    </div>
  );
}
