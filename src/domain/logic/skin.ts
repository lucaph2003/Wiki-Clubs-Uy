import { bestInkOn, ensureContrast, mixToward, relativeLuminance } from '@/lib/color';
import type { ClubSummary, Skin } from '@/domain/types';

/** Datos mínimos para derivar un skin, también disponibles en cada lado de un clásico. */
export type SkinSource = Pick<ClubSummary, 'slug' | 'crest' | 'identity'>;

/** Umbrales WCAG AA. Texto grande (≥24px o ≥19px bold) puede usar LARGE. */
export const AA_TEXT = 4.5;
export const AA_LARGE = 3;
export const AA_UI = 3; // bordes, iconos, estados de foco

/** Acepta datos mínimos para que la grilla y los clásicos no carguen un club completo. */
export function buildSkin(club: SkinSource): Skin {
  const { primary, secondary, accent, preferredScheme } = club.identity.colors;

  const scheme = preferredScheme ?? (relativeLuminance(primary) < 0.35 ? 'dark' : 'light');
  const surface =
    scheme === 'dark'
      ? mixToward(primary, '#08080A', 0.86) // fondo oscuro teñido de marca
      : mixToward(primary, '#FAFAFA', 0.9);

  const ink = bestInkOn(surface);

  return {
    clubSlug: club.slug,
    scheme,
    favicon: club.crest.src,
    tokens: {
      '--club-primary': primary,
      '--club-secondary': secondary,
      '--club-accent': accent ?? secondary,
      '--club-surface': surface,
      '--club-surface-2': mixToward(surface, ink, 0.06),
      '--club-surface-3': mixToward(surface, ink, 0.12),
      '--club-ink': ink,
      '--club-on-primary': bestInkOn(primary),
      '--club-on-secondary': bestInkOn(secondary),
      '--club-on-accent': bestInkOn(accent ?? secondary),
      '--club-primary-readable': ensureContrast(primary, surface, AA_TEXT),
      '--club-accent-readable': ensureContrast(accent ?? secondary, surface, AA_TEXT),
      '--club-focus': ensureContrast(primary, surface, AA_UI),
      '--club-scheme': scheme,
    },
  };
}
