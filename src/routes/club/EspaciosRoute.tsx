import { useOutletContext } from 'react-router';
import type { Club } from '@/domain/types';
import { HinchadaGallery } from '@/features/club-spaces/HinchadaGallery';
import { MapLoader } from '@/features/club-spaces/MapLoader';
import { PanoLoader } from '@/features/club-spaces/PanoLoader';
import { TrapoGallery } from '@/features/club-spaces/TrapoGallery';

export function EspaciosRoute(): React.ReactElement {
  const club = useOutletContext<Club>();
  const { stadium, landmarks } = club.spaces;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="text-xl font-bold">{stadium.name}</h2>
      <p className="mt-1 text-club-ink-muted">
        {stadium.neighborhood}, {stadium.city}
      </p>
      <p className="mt-4 max-w-2xl">{stadium.description.value}</p>
      {!stadium.description.verified && (
        <p className="mt-2 text-xs italic text-club-ink-muted">Dato sin verificar</p>
      )}

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <MapLoader center={stadium.location} landmarks={landmarks} markerColor={club.identity.colors.primary} />
        {stadium.panoramas[0] && <PanoLoader spot={stadium.panoramas[0]} />}
      </div>

      <h3 className="mb-3 mt-10 text-lg font-semibold">Hinchada</h3>
      <HinchadaGallery photos={stadium.hinchada} />

      <h3 className="mb-3 mt-10 text-lg font-semibold">Trapos</h3>
      <TrapoGallery photos={stadium.trapos} />

      {landmarks.length > 0 && (
        <>
          <h3 className="mb-3 mt-10 text-lg font-semibold">Lugares del barrio</h3>
          <ul className="grid gap-4 sm:grid-cols-2">
            {landmarks.map((landmark) => (
              <li key={landmark.id} className="rounded-2xl border border-club-border bg-club-surface-2 p-4">
                <p className="text-xs uppercase tracking-wide text-club-ink-muted">{landmark.kind}</p>
                <h4 className="font-medium">{landmark.name}</h4>
                <p className="mt-1 text-sm text-club-ink-muted">{landmark.description.value}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
