import { useOutletContext } from 'react-router';
import type { Club } from '@/domain/types';
import { Timeline } from '@/features/club-identity/Timeline';
import { KitGallery } from '@/features/club-identity/KitGallery';
import { ChantList } from '@/features/club-identity/ChantList';

export function IdentidadRoute(): React.ReactElement {
  const club = useOutletContext<Club>();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="mb-4 text-xl font-bold">Línea de tiempo</h2>
      <Timeline events={club.timeline} />

      <h2 className="mb-4 mt-10 text-xl font-bold">Camisetas</h2>
      <KitGallery kits={club.identity.kits} />

      {club.identity.chants.length > 0 && (
        <>
          <h2 className="mb-4 mt-10 text-xl font-bold">Cánticos</h2>
          <ChantList chants={club.identity.chants} />
        </>
      )}

      {club.identity.mottos.length > 0 && (
        <p className="mt-10 text-club-ink-muted italic">"{club.identity.mottos[0]}"</p>
      )}
    </main>
  );
}
