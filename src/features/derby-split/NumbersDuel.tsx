import { ScrollScene } from '@/components/motion/ScrollScene';
import type { Derby } from '@/domain/types';

export function NumbersDuel({ derby }: { derby: Derby }): React.ReactElement {
  const [left, right] = derby.sides;
  const leftWins = derby.headToHead.winsBySlug[left.clubSlug] ?? 0;
  const rightWins = derby.headToHead.winsBySlug[right.clubSlug] ?? 0;
  const leader = leftWins === rightWins ? null : leftWins > rightWins ? left.clubSlug : right.clubSlug;

  return (
    <ScrollScene className="flex items-center justify-center gap-16 py-16">
      {({ progress }) => (
        <>
          <NumberColumn label={left.shortName} value={Math.round(leftWins * progress)} highlighted={leader === left.clubSlug} />
          <span className="text-club-ink-muted">victorias</span>
          <NumberColumn label={right.shortName} value={Math.round(rightWins * progress)} highlighted={leader === right.clubSlug} />
        </>
      )}
    </ScrollScene>
  );
}

function NumberColumn({ label, value, highlighted }: { label: string; value: number; highlighted: boolean }): React.ReactElement {
  return (
    <div className="text-center">
      <p
        className="text-4xl font-bold tabular-nums"
        style={{ color: highlighted ? 'var(--club-primary-readable)' : 'var(--club-ink)' }}
      >
        {value}
      </p>
      <p className="text-sm text-club-ink-muted">{label}</p>
    </div>
  );
}
