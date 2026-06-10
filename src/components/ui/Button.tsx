import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'yellow' | 'blue' | 'coral' | 'mint' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  yellow: 'bg-yellow text-ink',
  blue: 'bg-blue text-ink',
  coral: 'bg-coral text-white',
  mint: 'bg-mint text-ink',
  ghost: 'bg-white text-ink',
};

const SIZES: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-lg',
  lg: 'px-8 py-4 text-2xl',
};

/** Chunky pill button: 4px ink border + hard offset shadow that "presses" on click. */
export default function Button({
  variant = 'yellow',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 rounded-full border-4 border-ink font-display font-semibold',
        'shadow-hard transition-transform duration-100',
        'hover:-translate-y-0.5 active:translate-y-1.5 active:shadow-none',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:active:translate-y-0 disabled:active:shadow-hard',
        VARIANTS[variant],
        SIZES[size],
        className ?? '',
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
