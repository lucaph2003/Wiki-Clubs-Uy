import { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { AudioToggle } from '@/components/media/AudioToggle';
import { useSkinStore } from '@/stores/skinStore';

export function RootLayout(): React.ReactElement {
  const { pathname } = useLocation();
  const resetSkin = useSkinStore((s) => s.reset);
  const isFallbackTransitioning = useSkinStore((s) => s.isFallbackTransitioning);

  useLayoutEffect(() => {
    if (!pathname.startsWith('/club/')) {
      resetSkin();
      document.title = 'Garra — Atlas emocional del fútbol uruguayo';
    }
  }, [pathname, resetSkin]);

  return (
    <div className={`min-h-dvh bg-club-surface text-club-ink ${isFallbackTransitioning ? 'portal-fallback' : ''}`}>
      <Outlet />
      <AudioToggle />
    </div>
  );
}
