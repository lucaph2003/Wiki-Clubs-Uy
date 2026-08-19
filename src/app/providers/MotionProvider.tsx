import type { ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';

/** Respeta `prefers-reduced-motion` en toda la app vía framer-motion (§12.4). */
export function MotionProvider({ children }: { children: ReactNode }): ReactNode {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.34 }}>
      {children}
    </MotionConfig>
  );
}
