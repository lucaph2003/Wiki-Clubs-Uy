import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';
import type { TimelineEvent } from '@/domain/types';

const WEIGHT_WIDTH: Record<TimelineEvent['weight'], string> = {
  1: 'w-48',
  2: 'w-56',
  3: 'w-64',
  4: 'w-72',
  5: 'w-80',
};

const KIND_META: Record<TimelineEvent['kind'], { label: string; icon: string }> = {
  fundacion: { label: 'Fundación', icon: '🏛️' },
  titulo: { label: 'Título', icon: '🏆' },
  estadio: { label: 'Estadio', icon: '🏟️' },
  figura: { label: 'Figura', icon: '⭐' },
  hito: { label: 'Hito', icon: '📌' },
  crisis: { label: 'Crisis', icon: '⚠️' },
  clasico: { label: 'Clásico', icon: '⚔️' },
};

export function Timeline({ events }: { events: TimelineEvent[] }): React.ReactElement {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', dragFree: true });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'ArrowLeft') scrollPrev();
    if (event.key === 'ArrowRight') scrollNext();
    if (event.key === 'Home') emblaApi?.scrollTo(0);
    if (event.key === 'End') emblaApi?.scrollTo(events.length - 1);
  };

  return (
    <div className="relative">
      <div
        ref={emblaRef}
        className="overflow-hidden"
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="group"
        aria-label="Línea de tiempo"
      >
        <div role="list" className="relative flex gap-6 px-1 pb-1 pt-3">
          <div className="pointer-events-none absolute inset-x-0 top-[1.75rem] h-px bg-club-border" aria-hidden="true" />
          {events.map((event) => {
            const meta = KIND_META[event.kind];
            return (
              <div key={event.id} role="listitem" className={`${WEIGHT_WIDTH[event.weight]} shrink-0`}>
                <div className="relative flex h-7 items-center justify-center">
                  <span
                    className="z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-club-surface bg-club-accent text-xs leading-none text-club-on-accent"
                    title={meta.label}
                    aria-hidden="true"
                  >
                    {meta.icon}
                  </span>
                </div>
                <div className="mx-auto h-4 w-px bg-club-border" aria-hidden="true" />
                <div className="rounded-2xl border border-club-border bg-club-surface-2 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-club-accent-readable">{event.date}</p>
                    <span className="rounded-full bg-club-surface-3 px-2 py-0.5 text-[10px] uppercase tracking-wide text-club-ink-muted">
                      {meta.label}
                    </span>
                  </div>
                  <h4 className="mt-1 font-semibold text-club-ink">{event.title}</h4>
                  <p className="mt-1 text-sm text-club-ink-muted">{event.summary}</p>
                  {!event.verified && (
                    <p className="mt-2 text-xs italic text-club-ink-muted" role="note">
                      Dato sin verificar
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={scrollPrev}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-club-border text-club-ink-muted transition hover:text-club-ink"
          aria-label="Evento anterior"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={scrollNext}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-club-border text-club-ink-muted transition hover:text-club-ink"
          aria-label="Evento siguiente"
        >
          ›
        </button>
      </div>
    </div>
  );
}
