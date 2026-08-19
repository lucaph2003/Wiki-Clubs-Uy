import type { Kit } from '@/domain/types';

/** Fallback 2D siempre presente (§10.2). El visor 3D se agrega cuando existan modelos .glb reales. */
export function KitGallery({ kits }: { kits: Kit[] }): React.ReactElement {
  if (kits.length === 0) {
    return <p className="text-sm text-club-ink-muted">Aún no hay camisetas cargadas para este club.</p>;
  }

  return (
    <ul className="flex flex-wrap gap-4">
      {kits.map((kit) => (
        <li key={kit.id} className="w-40 rounded-2xl border border-club-border bg-club-surface-2 p-4 text-center">
          <img src={kit.flat.src} alt={kit.flat.alt} width={96} height={96} loading="lazy" className="mx-auto h-24 w-24" />
          <p className="mt-2 text-sm font-medium">{kit.season}</p>
          <p className="text-xs text-club-ink-muted">{kit.type}</p>
        </li>
      ))}
    </ul>
  );
}
