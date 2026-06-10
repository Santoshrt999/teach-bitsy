import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Optional tint for the card background. Defaults to white. */
  tint?: 'white' | 'paper' | 'yellow' | 'blue' | 'coral' | 'mint';
}

const TINTS: Record<NonNullable<CardProps['tint']>, string> = {
  white: 'bg-white',
  paper: 'bg-paper',
  yellow: 'bg-yellow/30',
  blue: 'bg-blue/25',
  coral: 'bg-coral/25',
  mint: 'bg-mint/25',
};

/** Chunky card: 4px ink border, big rounded corners, hard offset shadow. */
export default function Card({ children, tint = 'white', className, ...props }: CardProps) {
  return (
    <div
      className={[
        'rounded-[var(--radius-chunky)] border-4 border-ink p-5 shadow-hard',
        TINTS[tint],
        className ?? '',
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}
