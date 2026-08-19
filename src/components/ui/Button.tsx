import type { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps): React.ReactElement {
  const base =
    'inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-5 text-sm font-medium transition-colors duration-[var(--motion-fast)] ease-club';
  const variants = {
    primary: 'bg-club-primary text-club-on-primary hover:opacity-90',
    ghost: 'bg-club-surface-2 text-club-ink hover:bg-club-surface-3',
  } as const;

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
