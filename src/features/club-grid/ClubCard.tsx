import { buildSkin } from '@/domain/logic/skin';
import { prefetchClub } from '@/repositories/clubsRepository';
import { formatYear } from '@/lib/format';
import type { ClubSummary } from '@/domain/types';
import type { CSSProperties } from 'react';

const TIER_SPAN: Record<ClubSummary['stature']['tier'], string> = {
  colosal: 'col-span-2 row-span-2',
  grande: 'col-span-2 row-span-1',
  historico: 'col-span-1 row-span-1',
  clasico: 'col-span-1 row-span-1',
  emergente: 'col-span-1 row-span-1',
};

export interface ClubCardProps {
  club: ClubSummary;
  isActive: boolean;
  onEnter: (club: ClubSummary) => void;
}

export function ClubCard({ club, isActive, onEnter }: ClubCardProps): React.ReactElement {
  const skin = buildSkin(club);

  const style: CSSProperties = {
    ...(skin.tokens as CSSProperties),
    viewTransitionName: isActive ? 'club-portal' : undefined,
  };

  const handlePointer = (): void => prefetchClub(club.slug);

  return (
    <button
      type="button"
      style={style}
      data-tier={club.stature.tier}
      onClick={() => onEnter(club)}
      onPointerEnter={handlePointer}
      onTouchStart={handlePointer}
      aria-label={`Entrar a ${club.name}`}
      className={`${TIER_SPAN[club.stature.tier]} flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-club-border bg-club-surface-2 p-4 text-center shadow-sm transition-all duration-[var(--motion-base)] ease-club hover:-translate-y-1 hover:border-club-ink/25 hover:bg-club-surface-3 hover:shadow-lg focus-visible:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-club-ink`}
    >
      <img src={club.crest.src} alt={club.crest.alt} width={56} height={56} loading="lazy" className="h-14 w-14 object-contain" />
      <div className="w-full">
        <p className="line-clamp-2 font-semibold leading-tight text-club-ink">{club.shortName}</p>
        <p className="line-clamp-1 text-sm text-club-ink-muted">{formatYear(club.foundedYear)}</p>
      </div>
    </button>
  );
}
