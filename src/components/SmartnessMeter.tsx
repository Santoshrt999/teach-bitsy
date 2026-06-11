import { motion } from 'motion/react';

interface SmartnessMeterProps {
  /** Accuracy in [0, 1]. */
  value: number;
  grownUpMode: boolean;
}

/** The "Smartness" meter — a chunky bar showing live training accuracy. */
export default function SmartnessMeter({ value, grownUpMode }: SmartnessMeterProps) {
  const pct = Math.round(value * 100);
  const label = grownUpMode ? 'Accuracy' : 'Smartness';

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between font-display font-bold">
        <span>{grownUpMode ? '🎯 Accuracy' : '🌟 Smartness'}</span>
        <span className="tabular-nums">{pct}%</span>
      </div>
      <div
        className="h-7 w-full overflow-hidden rounded-full border-4 border-ink bg-white"
        role="progressbar"
        aria-label={label}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full rounded-full bg-mint"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        />
      </div>
    </div>
  );
}
