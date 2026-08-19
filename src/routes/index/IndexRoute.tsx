import { useLoaderData } from 'react-router';
import { ClubGrid } from '@/features/club-grid';
import { getClubs } from '@/repositories/clubsRepository';
import type { ClubSummary } from '@/domain/types';

export async function indexLoader(): Promise<ClubSummary[]> {
  return getClubs();
}

export function IndexRoute(): React.ReactElement {
  const clubs = useLoaderData<ClubSummary[]>();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-1 text-3xl font-bold">Garra</h1>
      <p className="mb-8 text-club-ink-muted">Un atlas emocional del fútbol uruguayo.</p>
      <ClubGrid clubs={clubs} />
    </main>
  );
}
