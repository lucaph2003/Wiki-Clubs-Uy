import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { Position, SquadPlayer, Slug } from '@/domain/types';

const FORMATION: { position: Position; label: string }[] = [
  { position: 'GK', label: 'Arquero' },
  { position: 'RB', label: 'Lateral derecho' },
  { position: 'CB', label: 'Central' },
  { position: 'CB', label: 'Central' },
  { position: 'LB', label: 'Lateral izquierdo' },
  { position: 'DM', label: 'Volante de marca' },
  { position: 'CM', label: 'Volante' },
  { position: 'AM', label: 'Enganche' },
  { position: 'RW', label: 'Extremo derecho' },
  { position: 'LW', label: 'Extremo izquierdo' },
  { position: 'ST', label: 'Delantero' },
];

export interface CombinedXIPlayer extends SquadPlayer {
  clubSlug: Slug;
  clubShortName: string;
}

function storageKey(derbySlug: string): string {
  return `garra:xi:${derbySlug}`;
}

function loadSelection(derbySlug: string): (string | null)[] {
  try {
    const raw = window.localStorage.getItem(storageKey(derbySlug));
    if (!raw) return FORMATION.map(() => null);
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === FORMATION.length) return parsed as (string | null)[];
  } catch {
    // localStorage corrupto: arrancamos vacío.
  }
  return FORMATION.map(() => null);
}

/** Cada slot es un <select> nativo: nunca depende de drag & drop (§11.3). */
export function CombinedXI({ derbySlug, players }: { derbySlug: string; players: CombinedXIPlayer[] }): React.ReactElement {
  const [selection, setSelection] = useState<(string | null)[]>(() => loadSelection(derbySlug));

  useEffect(() => {
    window.localStorage.setItem(storageKey(derbySlug), JSON.stringify(selection));
  }, [derbySlug, selection]);

  const setSlot = (index: number, playerId: string | null): void => {
    setSelection((prev) => prev.map((v, i) => (i === index ? playerId : v)));
  };

  const exportAsImage = (): void => {
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 40 + FORMATION.length * 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0b0b0c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f5f5f5';
    ctx.font = '16px sans-serif';
    ctx.fillText('Once ideal combinado', 16, 28);
    FORMATION.forEach((slot, i) => {
      const player = players.find((p) => p.id === selection[i]);
      const text = `${slot.label}: ${player ? `${player.displayName} (${player.clubShortName})` : '—'}`;
      ctx.fillText(text, 16, 56 + i * 28);
    });

    const link = document.createElement('a');
    link.download = `once-ideal-${derbySlug}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {FORMATION.map((slot, index) => {
          const usedElsewhere = new Set(selection.filter((_, i) => i !== index).filter(Boolean));
          const options = players.filter((p) => p.position === slot.position && !usedElsewhere.has(p.id));

          return (
            <li key={index} className="flex items-center gap-2">
              <label htmlFor={`xi-slot-${index}`} className="w-40 shrink-0 text-sm text-club-ink-muted">
                {slot.label}
              </label>
              <select
                id={`xi-slot-${index}`}
                value={selection[index] ?? ''}
                onChange={(e) => setSlot(index, e.target.value || null)}
                className="min-h-11 flex-1 rounded-lg border border-club-border bg-club-surface-2 px-2 text-club-ink"
              >
                <option value="">— Elegir —</option>
                {options.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.displayName} ({p.clubShortName})
                  </option>
                ))}
              </select>
            </li>
          );
        })}
      </ul>
      <Button variant="ghost" className="mt-4" onClick={exportAsImage}>
        Exportar como imagen
      </Button>
    </div>
  );
}
