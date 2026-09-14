import { create } from 'zustand';
import type { Skin } from '@/domain/types';

interface SkinState {
  skin: Skin | null;
  isTransitioning: boolean;
  isFallbackTransitioning: boolean;
  apply: (skin: Skin) => void;
  reset: () => void;
  setTransitioning: (v: boolean) => void;
  setFallbackTransitioning: (v: boolean) => void;
}

export const useSkinStore = create<SkinState>((set) => ({
  skin: null,
  isTransitioning: false,
  isFallbackTransitioning: false,
  apply: (skin) => set({ skin }),
  reset: () => set({ skin: null }),
  setTransitioning: (isTransitioning) => set({ isTransitioning }),
  setFallbackTransitioning: (isFallbackTransitioning) => set({ isFallbackTransitioning }),
}));
