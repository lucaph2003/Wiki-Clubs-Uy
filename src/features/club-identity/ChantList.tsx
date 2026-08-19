import type { Chant } from '@/domain/types';

/** Letras solo si son publicables (§14 moderación). */
export function ChantList({ chants }: { chants: Chant[] }): React.ReactElement | null {
  if (chants.length === 0) return null;

  return (
    <ul className="space-y-2">
      {chants.map((chant) => (
        <li key={chant.id} className="rounded-xl border border-club-border bg-club-surface-2 p-3">
          <p className="font-medium">{chant.title}</p>
          <p className="text-xs uppercase tracking-wide text-club-ink-muted">{chant.kind}</p>
          {chant.lyrics && <p className="mt-2 whitespace-pre-line text-sm text-club-ink-muted">{chant.lyrics}</p>}
        </li>
      ))}
    </ul>
  );
}
