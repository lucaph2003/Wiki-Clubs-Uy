import { useEffect, useMemo, useRef, useState } from 'react';
import { Chip } from '@/components/ui/Chip';
import { usePortalTransition } from '@/hooks/usePortalTransition';
import type { ClubSummary } from '@/domain/types';
import { ClubCard } from './ClubCard';
import { sortClubs, useClubSort, type SortKey } from './useClubSort';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'grandeza', label: 'Grandeza' },
  { key: 'alfabetico', label: 'Alfabético' },
  { key: 'antiguedad', label: 'Antigüedad' },
  { key: 'division', label: 'División' },
];

export function ClubGrid({ clubs }: { clubs: ClubSummary[] }): React.ReactElement {
  const [sort, setSort] = useClubSort();
  const [query, setQuery] = useState('');
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const enterClub = usePortalTransition();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';
      if (event.key === '/' && !isTyping) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const filtered = useMemo(() => {
    const sorted = sortClubs(clubs, sort);
    if (!query.trim()) return sorted;
    const q = query.trim().toLowerCase();
    return sorted.filter((c) => c.name.toLowerCase().includes(q) || c.nickname.toLowerCase().includes(q));
  }, [clubs, sort, query]);

  return (
    <section aria-label="Grilla de clubes del fútbol uruguayo">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label className="sr-only" htmlFor="club-search">
          Buscar club
        </label>
        <input
          ref={searchRef}
          id="club-search"
          type="search"
          placeholder="Buscar club… (/)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-11 flex-1 rounded-full border border-club-border bg-club-surface-2 px-4 text-club-ink placeholder:text-club-ink-muted"
        />
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((opt) => (
            <Chip key={opt.key} active={sort === opt.key} onClick={() => setSort(opt.key)}>
              {opt.label}
            </Chip>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {filtered.length} clubes encontrados
      </p>

      <div
        className="grid auto-rows-[152px] grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6"
        style={{ gridAutoFlow: 'dense' }}
        onMouseLeave={() => setActiveSlug(null)}
      >
        {filtered.map((club) => (
          <div
            key={club.slug}
            onMouseEnter={() => setActiveSlug(club.slug)}
            onFocus={() => setActiveSlug(club.slug)}
            onBlur={() => setActiveSlug(null)}
            style={{
              filter: activeSlug && activeSlug !== club.slug ? 'saturate(.65)' : undefined,
              transition: 'filter var(--motion-base) var(--motion-ease)',
            }}
          >
            <ClubCard club={club} isActive={activeSlug === club.slug} onEnter={enterClub} />
          </div>
        ))}
      </div>
    </section>
  );
}
