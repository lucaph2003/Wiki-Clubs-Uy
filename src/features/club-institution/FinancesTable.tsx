import { formatCurrency } from '@/lib/format';
import type { FinancialSnapshot } from '@/domain/types';

const CHART_HEIGHT = 120;
const BAR_WIDTH = 28;
const GAP = 16;

/** Balances simplificados. Prohibido inferir, proyectar o redondear cifras (§10.3). */
export function FinancesTable({ finances }: { finances: FinancialSnapshot[] }): React.ReactElement | null {
  if (finances.length === 0) return null;

  const max = Math.max(1, ...finances.flatMap((f) => [f.revenue?.value ?? 0, f.expenses?.value ?? 0]));
  const chartWidth = finances.length * (BAR_WIDTH * 2 + GAP);

  return (
    <div>
      <p className="mb-3 text-sm text-club-ink-muted">Cifras simplificadas, ver fuente al pasar el cursor.</p>

      <svg viewBox={`0 0 ${chartWidth} ${CHART_HEIGHT + 24}`} width={chartWidth} height={CHART_HEIGHT + 24} role="img" aria-label="Ingresos y gastos por año">
        {finances.map((f, i) => {
          const x = i * (BAR_WIDTH * 2 + GAP);
          const revenueH = ((f.revenue?.value ?? 0) / max) * CHART_HEIGHT;
          const expensesH = ((f.expenses?.value ?? 0) / max) * CHART_HEIGHT;
          return (
            <g key={f.year}>
              <rect
                x={x}
                y={CHART_HEIGHT - revenueH}
                width={BAR_WIDTH}
                height={revenueH}
                fill="var(--club-primary-readable)"
              >
                <title>Ingresos {f.year}: {f.revenue?.verified ? formatCurrency(f.revenue.value, f.currency) : 'no confirmado'}</title>
              </rect>
              <rect
                x={x + BAR_WIDTH}
                y={CHART_HEIGHT - expensesH}
                width={BAR_WIDTH}
                height={expensesH}
                fill="var(--club-ink-muted)"
              >
                <title>Gastos {f.year}: {f.expenses?.verified ? formatCurrency(f.expenses.value, f.currency) : 'no confirmado'}</title>
              </rect>
              <text x={x + BAR_WIDTH} y={CHART_HEIGHT + 16} fontSize={11} textAnchor="middle" fill="var(--club-ink-muted)">
                {f.year}
              </text>
            </g>
          );
        })}
      </svg>

      <table className="mt-4 w-full text-sm">
        <caption className="sr-only">Balances por año</caption>
        <thead>
          <tr className="text-left text-club-ink-muted">
            <th scope="col" className="py-1 pr-4">Año</th>
            <th scope="col" className="py-1 pr-4">Ingresos</th>
            <th scope="col" className="py-1 pr-4">Gastos</th>
          </tr>
        </thead>
        <tbody>
          {finances.map((f) => (
            <tr key={f.year} className="border-t border-club-border">
              <td className="py-1 pr-4">{f.year}</td>
              <td className="py-1 pr-4">{f.revenue?.verified ? formatCurrency(f.revenue.value, f.currency) : 'cifra no confirmada'}</td>
              <td className="py-1 pr-4">{f.expenses?.verified ? formatCurrency(f.expenses.value, f.currency) : 'cifra no confirmada'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
