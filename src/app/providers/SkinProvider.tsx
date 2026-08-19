import { useLayoutEffect, type ReactNode } from 'react';
import { useSkinStore } from '@/stores/skinStore';

/** Único lugar del código que toca `document.documentElement.style` (§6.6). */
export function SkinProvider({ children }: { children: ReactNode }): ReactNode {
  const skin = useSkinStore((s) => s.skin);

  useLayoutEffect(() => {
    const root = document.documentElement;

    if (!skin) {
      root.dataset.skin = 'neutral';
      return;
    }

    root.dataset.skin = skin.clubSlug;
    for (const [key, value] of Object.entries(skin.tokens)) {
      root.style.setProperty(key, value);
    }

    const themeColor = document.querySelector('meta[name="theme-color"]');
    themeColor?.setAttribute('content', skin.tokens['--club-surface'] ?? '#0b0b0c');

    return () => {
      for (const key of Object.keys(skin.tokens)) {
        root.style.removeProperty(key);
      }
      root.dataset.skin = 'neutral';
    };
  }, [skin]);

  return children;
}
