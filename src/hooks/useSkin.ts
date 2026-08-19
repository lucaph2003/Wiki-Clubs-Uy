import { useSkinStore } from '@/stores/skinStore';
import type { Skin } from '@/domain/types';

export function useSkin(): Skin | null {
  return useSkinStore((s) => s.skin);
}
