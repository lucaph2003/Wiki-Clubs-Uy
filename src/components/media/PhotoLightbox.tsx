import { useEffect, useRef } from 'react';
import type { MediaAsset } from '@/domain/types';

/** Visor a pantalla completa: Esc cierra, flechas navegan, foco atrapado en el diálogo (§10.1). */
export function PhotoLightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: MediaAsset[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}): React.ReactElement {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const photo = photos[index];

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key === 'ArrowRight') {
        onNavigate((index + 1) % photos.length);
        return;
      }
      if (event.key === 'ArrowLeft') {
        onNavigate((index - 1 + photos.length) % photos.length);
        return;
      }
      if (event.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button');
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [index, photos.length, onClose, onNavigate]);

  if (!photo) return <></>;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute right-4 top-4 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>

      {photos.length > 1 && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onNavigate((index - 1 + photos.length) % photos.length);
          }}
          aria-label="Foto anterior"
          className="absolute left-4 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m15 6-6 6 6 6" />
          </svg>
        </button>
      )}

      <img
        src={photo.src}
        alt={photo.alt}
        className="max-h-[90vh] max-w-[90vw] object-contain"
        onClick={(event) => event.stopPropagation()}
      />

      {(photo.credit || photo.license) && (
        <p className="absolute bottom-4 max-w-[90vw] rounded-full bg-black/60 px-3 py-1 text-center text-xs text-white">
          {photo.credit ?? 'Crédito pendiente'}
          {photo.license ? ` · Licencia: ${photo.license}` : ''}
        </p>
      )}

      {photos.length > 1 && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onNavigate((index + 1) % photos.length);
          }}
          aria-label="Foto siguiente"
          className="absolute right-4 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
          </svg>
        </button>
      )}
    </div>
  );
}
