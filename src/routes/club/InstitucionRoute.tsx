import { useOutletContext } from 'react-router';
import type { Club } from '@/domain/types';
import { TransfersRanking } from '@/features/club-institution/TransfersRanking';
import { FinancesTable } from '@/features/club-institution/FinancesTable';
import { OfficialsList } from '@/features/club-institution/OfficialsList';

export function InstitucionRoute(): React.ReactElement {
  const club = useOutletContext<Club>();

  if (club.meta.completeness < 0.4) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border border-club-border bg-club-surface-2 p-8 text-center">
          <p className="text-club-ink-muted">Estamos completando esta información.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="mb-4 text-xl font-bold">Plantel</h2>
      <ul className="grid gap-3 sm:grid-cols-3">
        {club.squad.map((player) => (
          <li key={player.id} className="rounded-xl border border-club-border bg-club-surface-2 p-3">
            <p className="font-medium">{player.displayName}</p>
            <p className="text-sm text-club-ink-muted">
              {player.position}
              {player.homegrown ? ' · canterano' : ''}
            </p>
          </li>
        ))}
      </ul>

      <h2 className="mb-4 mt-10 text-xl font-bold">Mejores ventas históricas</h2>
      <TransfersRanking transfers={club.transfers} />

      <h2 className="mb-4 mt-10 text-xl font-bold">Balances</h2>
      <FinancesTable finances={club.institution.finances} />

      <h2 className="mb-4 mt-10 text-xl font-bold">Autoridades</h2>
      <OfficialsList president={club.institution.president} boardMembers={club.institution.boardMembers} />
    </main>
  );
}
