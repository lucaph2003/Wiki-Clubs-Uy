import { lazy, Suspense, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import type { PanoramaSpot } from '@/domain/types';

const PanoViewer = lazy(() => import('@/components/media/PanoViewer').then((m) => ({ default: m.PanoViewer })));

/** three.js es pesado: se carga en un chunk propio, recién tras click en el poster (§10.1, §13). */
export function PanoLoader({ spot }: { spot: PanoramaSpot }): React.ReactElement {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    return (
      <div className="relative flex h-80 w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-club-border">
        <img src={spot.asset.src} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <Button variant="ghost" className="relative" onClick={() => setLoaded(true)}>
          Ver {spot.label} en 360°
        </Button>
      </div>
    );
  }

  return (
    <Suspense fallback={<Skeleton className="h-80 w-full" />}>
      <PanoViewer spot={spot} />
    </Suspense>
  );
}
