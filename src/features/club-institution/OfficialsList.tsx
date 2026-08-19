import type { Official } from '@/domain/types';

export function OfficialsList({ president, boardMembers }: { president: Official | null; boardMembers: Official[] }): React.ReactElement | null {
  const officials = [...(president ? [president] : []), ...boardMembers];
  if (officials.length === 0) return null;

  return (
    <ul className="grid gap-3 sm:grid-cols-3">
      {officials.map((official) => (
        <li key={official.id} className="rounded-xl border border-club-border bg-club-surface-2 p-3">
          <p className="font-medium">{official.fullName}</p>
          <p className="text-sm text-club-ink-muted">
            {official.role}
            {official.sinceYear ? ` · desde ${official.sinceYear}` : ''}
          </p>
        </li>
      ))}
    </ul>
  );
}
