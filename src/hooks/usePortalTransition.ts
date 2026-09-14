import { useNavigate } from 'react-router';
import { useSkinStore } from '@/stores/skinStore';
import { buildSkin } from '@/domain/logic/skin';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';
import type { ClubSummary } from '@/domain/types';

interface ViewTransition {
  finished: Promise<void>;
}

const FALLBACK_HALF_DURATION_MS = 60;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function usePortalTransition(): (club: ClubSummary) => Promise<void> {
  const navigate = useNavigate();
  const applySkin = useSkinStore((s) => s.apply);
  const setTransitioning = useSkinStore((s) => s.setTransitioning);
  const setFallbackTransitioning = useSkinStore((s) => s.setFallbackTransitioning);
  const reduced = usePrefersReducedMotion();

  return async function enterClub(club: ClubSummary): Promise<void> {
    const skin = buildSkin(club);
    const go = (): void => {
      applySkin(skin);
      navigate(`/club/${club.slug}`);
    };

    const startViewTransition = (
      document as Document & { startViewTransition?: (cb: () => void) => ViewTransition }
    ).startViewTransition;

    if (reduced || !startViewTransition) {
      setFallbackTransitioning(true);
      await wait(FALLBACK_HALF_DURATION_MS);
      go();
      await wait(FALLBACK_HALF_DURATION_MS);
      setFallbackTransitioning(false);
      return;
    }

    setTransitioning(true);
    const transition = startViewTransition.call(document, go);
    await transition.finished.catch(() => {});
    setTransitioning(false);
  };
}
