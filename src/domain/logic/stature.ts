import type { ClubStature } from '@/domain/types';

const W = {
  nationalTitles: 0.3,
  continentalTitles: 0.25,
  yearsInTopFlight: 0.15,
  culturalWeight: 0.2,
  activeSupportBase: 0.1,
} as const;

/** Normaliza un conteo de títulos a 0–100 con un techo razonable (evita que un solo club domine la escala). */
function normalizeCount(count: number, ceiling: number): number {
  return Math.min(100, (count / ceiling) * 100);
}

export interface StatureInput {
  nationalTitles: number;
  continentalTitles: number;
  yearsInTopFlight: number;
  /** 0–100, curado editorialmente. */
  culturalWeight: number;
  /** 0–100, curado editorialmente. */
  activeSupportBase: number;
}

/** Calcula el score 0–100 y el tier visual. Ver agents.md §8.6: la fórmula es la fuente de verdad, no el criterio del agente. */
export function computeStature(input: StatureInput): Pick<ClubStature, 'score' | 'tier' | 'breakdown'> {
  const nationalScore = normalizeCount(input.nationalTitles, 50);
  const continentalScore = normalizeCount(input.continentalTitles, 10);
  const topFlightScore = normalizeCount(input.yearsInTopFlight, 100);

  const score =
    nationalScore * W.nationalTitles +
    continentalScore * W.continentalTitles +
    topFlightScore * W.yearsInTopFlight +
    input.culturalWeight * W.culturalWeight +
    input.activeSupportBase * W.activeSupportBase;

  const tier: ClubStature['tier'] =
    score >= 70 ? 'colosal' : score >= 50 ? 'grande' : score >= 30 ? 'historico' : score >= 15 ? 'clasico' : 'emergente';

  return {
    score: Math.round(score * 100) / 100,
    tier,
    breakdown: {
      nationalTitles: input.nationalTitles,
      continentalTitles: input.continentalTitles,
      yearsInTopFlight: input.yearsInTopFlight,
      culturalWeight: input.culturalWeight,
      activeSupportBase: input.activeSupportBase,
    },
  };
}
