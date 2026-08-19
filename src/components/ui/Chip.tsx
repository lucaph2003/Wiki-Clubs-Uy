import type { ButtonHTMLAttributes } from 'react';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function Chip({ active = false, className = '', ...props }: ChipProps): React.ReactElement {
  const base =
    'inline-flex min-h-11 items-center justify-center rounded-full border px-4 text-sm transition-colors duration-[var(--motion-fast)] ease-club';
  const state = active
    ? 'border-club-primary-readable bg-club-surface-2 text-club-primary-readable'
    : 'border-club-border bg-transparent text-club-ink-muted hover:text-club-ink';

  return <button type="button" className={`${base} ${state} ${className}`} aria-pressed={active} {...props} />;
}
