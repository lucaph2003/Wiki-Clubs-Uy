import { useEffect, useState } from 'react';
import type { Poll } from '@/domain/types';

function storageKey(derbySlug: string, pollId: string): string {
  return `garra:poll:${derbySlug}:${pollId}`;
}

/** Votación local; resultados mock rotulados como muestra (§11.3). Presentarlos como reales es una violación grave. */
export function PollCard({ derbySlug, poll }: { derbySlug: string; poll: Poll }): React.ReactElement {
  const [voted, setVoted] = useState<string | null>(null);

  useEffect(() => {
    setVoted(window.localStorage.getItem(storageKey(derbySlug, poll.id)));
  }, [derbySlug, poll.id]);

  const vote = (optionId: string): void => {
    window.localStorage.setItem(storageKey(derbySlug, poll.id), optionId);
    setVoted(optionId);
  };

  const total = Object.values(poll.mockResults ?? {}).reduce((sum, v) => sum + v, 0) || 1;

  return (
    <div className="rounded-2xl border border-club-border bg-club-surface-2 p-4">
      <h4 className="font-medium">{poll.question}</h4>
      <p className="mt-1 text-xs italic text-club-ink-muted">Resultados de muestra, sin backend en esta fase.</p>
      <ul className="mt-3 space-y-2">
        {poll.options.map((option) => {
          const pct = Math.round(((poll.mockResults?.[option.id] ?? 0) / total) * 100);
          return (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => vote(option.id)}
                aria-pressed={voted === option.id}
                className="min-h-11 w-full rounded-lg border border-club-border px-3 py-2 text-left transition-colors duration-[var(--motion-fast)] ease-club hover:bg-club-surface-3"
              >
                <span className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {voted && <span className="text-club-primary-readable">{pct}%</span>}
                </span>
                {voted && (
                  <span
                    className="mt-1 block h-1 rounded-full bg-club-primary-readable"
                    style={{ width: `${pct}%` }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
