import { motion, useReducedMotion } from 'motion/react';

const COLORS = ['#FFC94D', '#5AB8F0', '#FF7A6B', '#5FD6A0'];
const PIECES = 28;

/**
 * A one-shot confetti burst. Renders nothing when the user prefers reduced
 * motion. `aria-hidden` — it's purely decorative.
 */
export default function Confetti() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {Array.from({ length: PIECES }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.3;
        const duration = 1.6 + Math.random() * 1.2;
        const size = 8 + Math.random() * 8;
        return (
          <motion.span
            key={i}
            initial={{ y: -40, opacity: 1, rotate: 0 }}
            animate={{ y: '105vh', opacity: [1, 1, 0], rotate: 360 + Math.random() * 360 }}
            transition={{ duration, delay, ease: 'easeIn' }}
            style={{
              position: 'absolute',
              left: `${left}%`,
              width: size,
              height: size,
              borderRadius: i % 2 ? '50%' : '3px',
              background: COLORS[i % COLORS.length],
            }}
          />
        );
      })}
    </div>
  );
}
