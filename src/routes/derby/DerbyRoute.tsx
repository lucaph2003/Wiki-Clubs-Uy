import { Link, useLoaderData, type LoaderFunctionArgs } from 'react-router';
import { getDerby } from '@/repositories/derbiesRepository';
import { getClub } from '@/repositories/clubsRepository';
import { DerbySplit } from '@/features/derby-split/DerbySplit';
import { ClashOfCrests } from '@/features/derby-split/ClashOfCrests';
import { NumbersDuel } from '@/features/derby-split/NumbersDuel';
import { CombinedXI, type CombinedXIPlayer } from '@/features/derby-games/CombinedXI';
import { PollCard } from '@/features/derby-games/PollCard';
import { invariant } from '@/lib/invariant';
import type { Derby } from '@/domain/types';

interface DerbyRouteData {
  derby: Derby;
  players: CombinedXIPlayer[];
}

export async function derbyLoader({ params }: LoaderFunctionArgs): Promise<DerbyRouteData> {
  invariant(params.slug, 'Falta el slug del clásico en la URL');
  const derby = await getDerby(params.slug);
  const clubs = await Promise.all(derby.sides.map((side) => getClub(side.clubSlug)));
  const players: CombinedXIPlayer[] = clubs.flatMap((club) =>
    club.squad.map((player) => ({ ...player, clubSlug: club.slug, clubShortName: club.shortName })),
  );
  return { derby, players };
}

export function DerbyRoute(): React.ReactElement {
  const { derby, players } = useLoaderData<DerbyRouteData>();
  const { coverage } = derby.headToHead;

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 py-4">
        <Link to="/" className="text-sm text-club-ink-muted hover:text-club-ink">
          ← Volver a la grilla
        </Link>
        <h1 className="mt-2 text-2xl font-bold">{derby.name}</h1>
        <p className="text-sm text-club-ink-muted">
          Historial desde {coverage.fromYear} en {coverage.competitions.join(', ')}
        </p>
      </div>
      <DerbySplit derby={derby} />
      <ClashOfCrests left={derby.sides[0]} right={derby.sides[1]} />
      <NumbersDuel derby={derby} />

      <div className="mx-auto max-w-6xl px-4 py-10">
        {derby.games.polls.length > 0 && (
          <>
            <h2 className="mb-4 text-xl font-bold">Encuestas de la previa</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {derby.games.polls.map((poll) => (
                <PollCard key={poll.id} derbySlug={derby.slug} poll={poll} />
              ))}
            </div>
          </>
        )}

        {derby.games.combinedXI && (
          <>
            <h2 className="mb-4 mt-10 text-xl font-bold">Once ideal combinado</h2>
            <CombinedXI derbySlug={derby.slug} players={players} />
          </>
        )}
      </div>
    </div>
  );
}
