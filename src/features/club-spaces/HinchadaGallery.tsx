import { useState } from 'react';
import type { MediaAsset } from '@/domain/types';
import { PhotoLightbox } from '@/components/media/PhotoLightbox';

export function HinchadaGallery({ photos }: { photos: MediaAsset[] }): React.ReactElement {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (photos.length === 0) {
    return <p className="text-sm text-club-ink-muted">Aún no hay fotos de la hinchada cargadas para este club.</p>;
  }

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {photos.map((photo, index) => (
          <li key={photo.id} className="overflow-hidden rounded-2xl border border-club-border bg-club-surface-2">
            <button type="button" onClick={() => setOpenIndex(index)} className="block w-full">
              <img src={photo.src} alt={photo.alt} loading="lazy" className="h-40 w-full object-cover" />
            </button>
          </li>
        ))}
      </ul>
      {openIndex !== null && (
        <PhotoLightbox photos={photos} index={openIndex} onClose={() => setOpenIndex(null)} onNavigate={setOpenIndex} />
      )}
    </>
  );
}
