import { formatCurrency } from '@/lib/format';
import type { Transfer } from '@/domain/types';

/** Ranking de ventas históricas. Sin fuente ⇒ "cifra no confirmada", nunca un número duro (§10.3). */
export function TransfersRanking({ transfers }: { transfers: Transfer[] }): React.ReactElement | null {
  const sales = transfers
    .filter((t) => t.direction === 'out')
    .sort((a, b) => (b.feeUsd?.value ?? 0) - (a.feeUsd?.value ?? 0));

  if (sales.length === 0) return null;

  return (
    <ol className="space-y-2">
      {sales.map((transfer) => (
        <li key={transfer.id} className="flex items-center justify-between rounded-xl border border-club-border bg-club-surface-2 p-3">
          <div>
            <p className="font-medium">{transfer.playerName}</p>
            <p className="text-sm text-club-ink-muted">
              a {transfer.counterpartClub} · {transfer.year}
            </p>
          </div>
          <p className="text-sm font-medium" title={transfer.feeUsd?.source ?? undefined}>
            {transfer.feeUsd?.verified ? formatCurrency(transfer.feeUsd.value, 'USD') : 'cifra no confirmada'}
          </p>
        </li>
      ))}
    </ol>
  );
}
