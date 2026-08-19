export interface ClubStature {
  /** Puntaje 0–100 calculado por `computeStature()`. */
  score: number;
  /** Tier visual derivado del score; define el tamaño de celda en la grilla. */
  tier: 'colosal' | 'grande' | 'historico' | 'clasico' | 'emergente';
  /** Desglose transparente: la UI puede mostrarlo en un tooltip. */
  breakdown: {
    nationalTitles: number;
    continentalTitles: number;
    yearsInTopFlight: number;
    culturalWeight: number; // 0–100, curado editorialmente y documentado
    activeSupportBase: number; // 0–100
  };
  /** Override manual EXCEPCIONAL. Requiere `reason`. */
  manualOverride?: { tier: ClubStature['tier']; reason: string };
}
