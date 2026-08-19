import { useEffect, useRef, useState } from 'react';

/** Progreso 0–1 de un elemento a medida que atraviesa el viewport. Base para `<ScrollScene>` (§11.2). */
export function useScrollProgress<T extends HTMLElement>(): { ref: React.RefObject<T | null>; progress: number } {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const update = (): void => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const raw = (vh - rect.top) / (vh + rect.height);
      setProgress(Math.min(1, Math.max(0, raw)));
    };
    const onScroll = (): void => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return { ref, progress };
}
