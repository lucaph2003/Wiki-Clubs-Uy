import { useLayoutEffect, type ReactNode } from 'react';
import { useSkinStore } from '@/stores/skinStore';

function setFavicon(src: string): void {
  const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!icon) return;
  icon.href = src;
  icon.type = src.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
}

/** Único lugar del código que toca `document.documentElement.style` (§6.6). */
export function SkinProvider({ children }: { children: ReactNode }): ReactNode {
  const skin = useSkinStore((s) => s.skin);

  useLayoutEffect(() => {
    const root = document.documentElement;

    if (!skin) {
      root.dataset.skin = 'neutral';
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#0b0b0c');
      setFavicon('/favicon.svg');
      return;
    }

    root.dataset.skin = skin.clubSlug;
    for (const [key, value] of Object.entries(skin.tokens)) {
      root.style.setProperty(key, value);
    }

    const themeColor = document.querySelector('meta[name="theme-color"]');
    themeColor?.setAttribute('content', skin.tokens['--club-surface'] ?? '#0b0b0c');
    setFavicon(skin.favicon);

    return () => {
      for (const key of Object.keys(skin.tokens)) {
        root.style.removeProperty(key);
      }
      root.dataset.skin = 'neutral';
      themeColor?.setAttribute('content', '#0b0b0c');
      setFavicon('/favicon.svg');
    };
  }, [skin]);

  return children;
}
