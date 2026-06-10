import { motion, useReducedMotion } from 'motion/react';
import type { BitsyMood } from '../types';

interface BitsyProps {
  mood?: BitsyMood;
  /** Optional speech-bubble text. When omitted, no bubble is shown. */
  message?: string;
  /** Pixel width of the robot SVG. Height scales to match. */
  size?: number;
  className?: string;
}

/** Per-mood accent colour for the antenna light + cheeks. */
const ANTENNA: Record<BitsyMood, string> = {
  curious: '#5AB8F0',
  thinking: '#FFC94D',
  proud: '#5FD6A0',
  confused: '#FF7A6B',
};

/**
 * Bitsy the robot mascot. Her face reflects the model's state via the `mood`
 * prop. She appears on every screen, optionally with a speech bubble.
 * Motion is gated on `prefers-reduced-motion`.
 */
export default function Bitsy({
  mood = 'curious',
  message,
  size = 140,
  className,
}: BitsyProps) {
  const reduce = useReducedMotion();
  const accent = ANTENNA[mood];

  // The "thinking" wobble; disabled when the user prefers reduced motion.
  const wobble =
    mood === 'thinking' && !reduce
      ? { rotate: [-3, 3, -3], transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' as const } }
      : mood === 'confused' && !reduce
        ? { rotate: [0, -6, 0], transition: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' as const } }
        : { rotate: 0 };

  return (
    <div className={`flex flex-col items-center gap-3 ${className ?? ''}`}>
      {message && (
        <motion.div
          key={message}
          initial={reduce ? false : { opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative max-w-[16rem] rounded-2xl border-4 border-ink bg-white px-4 py-2 text-center font-display text-base font-semibold text-ink shadow-hard-sm"
          role="status"
          aria-live="polite"
        >
          {message}
          {/* Bubble tail */}
          <span
            aria-hidden
            className="absolute -bottom-[10px] left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b-4 border-r-4 border-ink bg-white"
          />
        </motion.div>
      )}

      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        animate={wobble}
        role="img"
        aria-label={`Bitsy the robot looks ${mood}`}
        style={{ originY: 0.7 }}
      >
        {/* Antenna */}
        <line x1="60" y1="20" x2="60" y2="34" stroke="#2B2545" strokeWidth="4" strokeLinecap="round" />
        <motion.circle
          cx="60"
          cy="15"
          r="6"
          fill={accent}
          stroke="#2B2545"
          strokeWidth="4"
          animate={
            mood === 'thinking' && !reduce
              ? { scale: [1, 1.35, 1], transition: { duration: 0.9, repeat: Infinity } }
              : { scale: 1 }
          }
          style={{ originX: 0.5, originY: 0.5, transformBox: 'fill-box' }}
        />

        {/* Head */}
        <rect
          x="22"
          y="32"
          width="76"
          height="62"
          rx="18"
          fill="#FFF9EF"
          stroke="#2B2545"
          strokeWidth="4"
        />
        {/* Ears / bolts */}
        <rect x="14" y="52" width="9" height="20" rx="4" fill="#5AB8F0" stroke="#2B2545" strokeWidth="4" />
        <rect x="97" y="52" width="9" height="20" rx="4" fill="#5AB8F0" stroke="#2B2545" strokeWidth="4" />

        {/* Cheeks */}
        <circle cx="36" cy="74" r="5" fill={accent} opacity="0.55" />
        <circle cx="84" cy="74" r="5" fill={accent} opacity="0.55" />

        <BitsyFace mood={mood} reduce={!!reduce} />
      </motion.svg>
    </div>
  );
}

/** Renders the eyes + mouth for the current mood. */
function BitsyFace({ mood, reduce }: { mood: BitsyMood; reduce: boolean }) {
  const eyeFill = '#2B2545';

  switch (mood) {
    case 'proud':
      // Happy closed eyes (^ ^) + big grin
      return (
        <>
          <path d="M38 60 q6 -8 12 0" fill="none" stroke={eyeFill} strokeWidth="4" strokeLinecap="round" />
          <path d="M70 60 q6 -8 12 0" fill="none" stroke={eyeFill} strokeWidth="4" strokeLinecap="round" />
          <path d="M44 76 q16 16 32 0" fill="none" stroke={eyeFill} strokeWidth="4" strokeLinecap="round" />
          {/* sparkles */}
          <g fill="#FFC94D" stroke="#2B2545" strokeWidth="2">
            <path d="M30 44 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2 z" />
            <path d="M90 42 l1.5 3 3 1.5 -3 1.5 -1.5 3 -1.5 -3 -3 -1.5 3 -1.5 z" />
          </g>
        </>
      );
    case 'thinking':
      // Eyes glancing up + a small thinking "o"
      return (
        <>
          <circle cx="44" cy="62" r="6" fill={eyeFill} />
          <circle cx="76" cy="62" r="6" fill={eyeFill} />
          <circle cx="45" cy="59" r="2" fill="#FFF9EF" />
          <circle cx="77" cy="59" r="2" fill="#FFF9EF" />
          <circle cx="60" cy="80" r="4" fill="none" stroke={eyeFill} strokeWidth="4" />
          {/* thought dots */}
          {!reduce && (
            <motion.g
              fill={eyeFill}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              <circle cx="100" cy="40" r="2.5" />
              <circle cx="107" cy="34" r="3.5" />
            </motion.g>
          )}
        </>
      );
    case 'confused':
      // Mismatched eyes + wavy mouth
      return (
        <>
          <circle cx="44" cy="64" r="7" fill={eyeFill} />
          <circle cx="46" cy="62" r="2.5" fill="#FFF9EF" />
          <path d="M68 60 l14 8 M68 68 l14 -8" stroke={eyeFill} strokeWidth="4" strokeLinecap="round" />
          <path d="M44 80 q6 -8 12 0 q6 8 12 0" fill="none" stroke={eyeFill} strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'curious':
    default:
      // Wide-open curious eyes + a gentle smile
      return (
        <>
          <circle cx="44" cy="62" r="7" fill={eyeFill} />
          <circle cx="76" cy="62" r="7" fill={eyeFill} />
          <circle cx="46" cy="59" r="2.5" fill="#FFF9EF" />
          <circle cx="78" cy="59" r="2.5" fill="#FFF9EF" />
          <path d="M48 78 q12 8 24 0" fill="none" stroke={eyeFill} strokeWidth="4" strokeLinecap="round" />
        </>
      );
  }
}
