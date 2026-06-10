import { motion, useReducedMotion } from 'motion/react';

interface PolaroidCardProps {
  src: string;
  /** Accessible description, e.g. the bucket name. */
  label: string;
  onDelete: () => void;
  /** Small deterministic tilt for the playful polaroid look. */
  tilt?: number;
}

/** A chunky polaroid-style photo card with a delete button. */
export default function PolaroidCard({ src, label, onDelete, tilt = 0 }: PolaroidCardProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, rotate: reduce ? 0 : tilt }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.8 }}
      className="relative rounded-xl border-4 border-ink bg-white p-1.5 pb-3 shadow-hard-sm"
    >
      <img
        src={src}
        alt={`A ${label} example`}
        className="h-24 w-24 rounded-md object-cover sm:h-28 sm:w-28"
        draggable={false}
      />
      <button
        onClick={onDelete}
        aria-label={`Delete this ${label} picture`}
        className="absolute -right-2.5 -top-2.5 flex h-7 w-7 items-center justify-center rounded-full border-4 border-ink bg-coral font-display text-sm font-bold text-white shadow-hard-sm transition-transform hover:scale-110 active:scale-95"
      >
        <span aria-hidden>✕</span>
      </button>
    </motion.div>
  );
}
