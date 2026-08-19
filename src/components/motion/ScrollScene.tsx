import type { ReactNode } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export interface ScrollSceneRenderProps {
  /** 0–1. Con `prefers-reduced-motion` siempre es 1 (estado final, sin animación). */
  progress: number;
}

/**
 * Solo anima `transform` y `opacity` (§11.2). Con reduced motion, el contenido aparece
 * directamente en su estado final: el contenido nunca depende de que la animación ocurra.
 */
export function ScrollScene({
  children,
  className = '',
}: {
  children: (props: ScrollSceneRenderProps) => ReactNode;
  className?: string;
}): React.ReactElement {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();

  return (
    <div ref={ref} className={className}>
      {children({ progress: reduced ? 1 : progress })}
    </div>
  );
}
