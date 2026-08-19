import { useSearchParams } from 'react-router';
import type { ClubSummary } from '@/domain/types';

export type SortKey = 'grandeza' | 'alfabetico' | 'antiguedad' | 'division';

const SORTERS: Record<SortKey, (a: ClubSummary, b: ClubSummary) => number> = {
  grandeza: (a, b) => b.stature.score - a.stature.score,
  alfabetico: (a, b) => a.shortName.localeCompare(b.shortName, 'es'),
  antiguedad: (a, b) => a.foundedYear - b.foundedYear,
  division: (a, b) => a.division.localeCompare(b.division),
};

function isSortKey(value: string | null): value is SortKey {
  return value === 'grandeza' || value === 'alfabetico' || value === 'antiguedad' || value === 'division';
}

export function useClubSort(): [SortKey, (key: SortKey) => void] {
  const [params, setParams] = useSearchParams();
  const raw = params.get('sort');
  const sort: SortKey = isSortKey(raw) ? raw : 'grandeza';

  const setSort = (key: SortKey): void => {
    const next = new URLSearchParams(params);
    next.set('sort', key);
    setParams(next, { replace: true });
  };

  return [sort, setSort];
}

export function sortClubs(clubs: ClubSummary[], sort: SortKey): ClubSummary[] {
  return [...clubs].sort(SORTERS[sort]);
}
