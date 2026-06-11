import { motion } from 'motion/react';
import type { EpochLog } from '../types';
import { LEARNING_RATE, EPOCHS } from '../lib/ml/config';

interface OopsMeterProps {
  log: EpochLog[];
  grownUpMode: boolean;
  backend: string | null;
}

const W = 320;
const H = 140;
const PAD = 16;

/**
 * The "Oops meter": an animated SVG line of the loss per epoch — literally the
 * cost function J decreasing as Bitsy learns. In grown-up mode it relabels to
 * "Loss J(w,b)" and surfaces the learning rate, epoch count, and backend.
 */
export default function OopsMeter({ log, grownUpMode, backend }: OopsMeterProps) {
  const losses = log.map((l) => l.loss);
  const points = buildPoints(losses);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const last = points.at(-1);

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between font-display font-bold">
        <span>{grownUpMode ? '📉 Loss J(w,b)' : '😅 Oops meter'}</span>
        {losses.length > 0 && (
          <span className="tabular-nums text-ink/70">{losses.at(-1)!.toFixed(3)}</span>
        )}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full rounded-2xl border-4 border-ink bg-white"
        role="img"
        aria-label={
          grownUpMode
            ? `Loss curve over ${losses.length} epochs`
            : 'How much Bitsy is still confused, going down as she learns'
        }
      >
        {/* baseline */}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#2B2545" strokeWidth="2" opacity="0.25" />

        {points.length >= 2 && (
          <motion.path
            d={path}
            fill="none"
            stroke="#FF7A6B"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          />
        )}

        {last && (
          <motion.circle
            cx={last.x}
            cy={last.y}
            r="5"
            fill="#FF7A6B"
            stroke="#2B2545"
            strokeWidth="3"
            initial={false}
            animate={{ cx: last.x, cy: last.y }}
            transition={{ type: 'spring', stiffness: 120, damping: 16 }}
          />
        )}

        {points.length === 0 && (
          <text x={W / 2} y={H / 2} textAnchor="middle" className="fill-ink/40" fontSize="13">
            Press Teach to watch this go down ↓
          </text>
        )}
      </svg>

      {grownUpMode && (
        <p className="mt-1 text-center font-body text-xs text-ink/60">
          Adam · learning rate {LEARNING_RATE} · {EPOCHS} epochs
          {backend ? ` · backend: ${backend}` : ''}
        </p>
      )}
    </div>
  );
}

function buildPoints(losses: number[]): { x: number; y: number }[] {
  if (losses.length === 0) return [];
  const innerW = W - PAD * 2;
  const innerH = H - PAD * 2;
  const max = Math.max(...losses);
  const min = Math.min(...losses);
  const span = max - min || 1; // avoid divide-by-zero when flat

  return losses.map((loss, i) => {
    const x = PAD + (losses.length === 1 ? innerW / 2 : (i / (losses.length - 1)) * innerW);
    // Higher loss → higher on screen (smaller y).
    const y = PAD + (1 - (loss - min) / span) * innerH;
    return { x, y };
  });
}
