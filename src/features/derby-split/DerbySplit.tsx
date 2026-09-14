import type { CSSProperties } from 'react';
import { buildSkin } from '@/domain/logic/skin';
import { contrastRatio } from '@/lib/color';
import type { Derby, DerbySide } from '@/domain/types';

function sideSkinTokens(side: DerbySide): Record<string, string> {
  const skin = buildSkin({
    slug: side.clubSlug,
    crest: side.crest,
    identity: { colors: side.colors },
  });
  return skin.tokens;
}

export function DerbySplit({ derby }: { derby: Derby }): React.ReactElement {
  const [left, right] = derby.sides;
  const leftTokens = sideSkinTokens(left);
  const rightTokens = sideSkinTokens(right);

  const needsDivider =
    contrastRatio(leftTokens['--club-surface']!, rightTokens['--club-surface']!) < 3;

  return (
    <div className="derby flex min-h-[60vh] flex-col md:flex-row" data-derby={derby.slug}>
      <DerbyHalf side={left} tokens={leftTokens} thickBorder={needsDivider} wins={derby.headToHead.winsBySlug[left.clubSlug] ?? 0} />
      <DerbyHalf side={right} tokens={rightTokens} thickBorder={false} wins={derby.headToHead.winsBySlug[right.clubSlug] ?? 0} />
    </div>
  );
}

function DerbyHalf({
  side,
  tokens,
  thickBorder,
  wins,
}: {
  side: DerbySide;
  tokens: Record<string, string>;
  thickBorder: boolean;
  wins: number;
}): React.ReactElement {
  const style: CSSProperties = {
    ...(tokens as CSSProperties),
    backgroundColor: 'var(--club-surface)',
    color: 'var(--club-ink)',
    borderRight: thickBorder ? '3px solid var(--club-ink)' : undefined,
  };

  return (
    <section style={style} className="derby__side flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center" aria-label={side.shortName}>
      <img src={side.crest.src} alt={side.crest.alt} width={64} height={64} className="h-16 w-16" />
      <h3 className="text-lg font-semibold">{side.shortName}</h3>
      <p className="text-sm" style={{ color: 'var(--club-ink-muted)' }}>
        {wins} victorias
      </p>
    </section>
  );
}
