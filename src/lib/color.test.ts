import { describe, expect, it } from 'vitest';
import { bestInkOn, contrastRatio, ensureContrast, relativeLuminance } from './color';

describe('relativeLuminance', () => {
  it('negro es 0, blanco es 1', () => {
    expect(relativeLuminance('#000000')).toBeCloseTo(0, 5);
    expect(relativeLuminance('#FFFFFF')).toBeCloseTo(1, 5);
  });
});

describe('contrastRatio', () => {
  it('negro sobre blanco es 21:1', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
  });

  it('es simétrico', () => {
    expect(contrastRatio('#FFD100', '#0B0B0C')).toBeCloseTo(contrastRatio('#0B0B0C', '#FFD100'), 5);
  });
});

describe('bestInkOn', () => {
  it('elige negro sobre fondos claros', () => {
    expect(bestInkOn('#FAFAFA')).toBe('#0A0A0B');
  });

  it('elige blanco sobre fondos oscuros', () => {
    expect(bestInkOn('#0B0B0C')).toBe('#FFFFFF');
  });
});

describe('ensureContrast', () => {
  it('devuelve el mismo color si ya cumple el objetivo', () => {
    expect(ensureContrast('#FFFFFF', '#000000', 4.5)).toBe('#ffffff');
  });

  it('oscurece un amarillo puro hasta cumplir AA sobre fondo claro', () => {
    const result = ensureContrast('#FFD100', '#FAFAFA', 4.5);
    expect(contrastRatio(result, '#FAFAFA')).toBeGreaterThanOrEqual(4.5);
  });

  it('mantiene el amarillo sin cambios sobre fondo bien oscuro', () => {
    const result = ensureContrast('#FFD100', '#0B0B0C', 4.5);
    expect(contrastRatio(result, '#0B0B0C')).toBeGreaterThanOrEqual(13);
  });

  it('resuelve un gris acromático a un gris más oscuro que cumple AA', () => {
    const result = ensureContrast('#808080', '#7F7F7F', 4.5);
    expect(contrastRatio(result, '#7F7F7F')).toBeGreaterThanOrEqual(4.5);
  });
});
