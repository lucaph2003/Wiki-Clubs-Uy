import { lazy, Suspense, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import type { NeighborhoodMapProps } from './NeighborhoodMap';

const NeighborhoodMap = lazy(() => import('./NeighborhoodMap'));

/** MapLibre es pesado: se carga en un chunk propio, recién tras interacción del usuario (§13). */
export function MapLoader(props: NeighborhoodMapProps): React.ReactElement {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    return (
      <div className="flex h-80 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-club-border bg-club-surface-2">
        <p className="text-sm text-club-ink-muted">Mapa del barrio</p>
        <Button variant="ghost" onClick={() => setLoaded(true)}>
          Cargar mapa
        </Button>
      </div>
    );
  }

  return (
    <Suspense fallback={<Skeleton className="h-80 w-full" />}>
      <NeighborhoodMap {...props} />
    </Suspense>
  );
}
