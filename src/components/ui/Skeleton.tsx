export function Skeleton({ className = '' }: { className?: string }): React.ReactElement {
  return <div className={`animate-pulse rounded-lg bg-club-surface-2 ${className}`} aria-hidden="true" />;
}
