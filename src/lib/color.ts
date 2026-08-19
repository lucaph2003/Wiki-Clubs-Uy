import { converter, formatHex, parse } from 'culori';

const toRgb = converter('rgb');
const toOklch = converter('oklch');

const LIGHT_INK = '#FFFFFF';
const DARK_INK = '#0A0A0B';

/** WCAG 2.1 — canal sRGB a lineal. */
const linearize = (c: number): number => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

/** Luminancia relativa WCAG 2.1 (0 = negro, 1 = blanco). */
export function relativeLuminance(color: string): number {
  const rgb = toRgb(parse(color));
  if (!rgb) throw new Error(`Color inválido: ${color}`);
  return 0.2126 * linearize(rgb.r) + 0.7152 * linearize(rgb.g) + 0.0722 * linearize(rgb.b);
}

/** Ratio de contraste WCAG 2.1: de 1 (idéntico) a 21 (negro/blanco). */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Elige blanco o casi-negro: el que más contraste dé sobre `bg`. */
export function bestInkOn(bg: string): string {
  return contrastRatio(bg, LIGHT_INK) >= contrastRatio(bg, DARK_INK) ? LIGHT_INK : DARK_INK;
}

/**
 * Devuelve una variante de `color` que cumple `target` de contraste sobre `bg`,
 * ajustando ÚNICAMENTE la luminosidad en OKLCH para preservar el tono de marca.
 * Si el tono es irrecuperable (ej. amarillo puro sobre blanco), cae a blanco/negro.
 */
export function ensureContrast(color: string, bg: string, target = 4.5): string {
  const currentHex = formatHex(parse(color));
  if (!currentHex) return bestInkOn(bg);
  if (contrastRatio(color, bg) >= target) return currentHex;

  const base = toOklch(parse(color));
  if (!base) return bestInkOn(bg);

  // Fondo claro → oscurecemos la marca. Fondo oscuro → la aclaramos.
  const darken = relativeLuminance(bg) > 0.18;
  const STEP = 0.01;

  for (let i = 1; i <= 100; i++) {
    const l = darken ? base.l - i * STEP : base.l + i * STEP;
    if (l <= 0 || l >= 1) break;
    const candidate = formatHex({ ...base, l });
    if (candidate && contrastRatio(candidate, bg) >= target) return candidate;
  }
  return bestInkOn(bg);
}

/** Interpola dos colores en espacio OKLab. `t` en [0, 1]: 0 = `a`, 1 = `b`. */
export function mixToward(a: string, b: string, t: number): string {
  const toOklab = converter('oklab');
  const ca = toOklab(parse(a));
  const cb = toOklab(parse(b));
  if (!ca || !cb) throw new Error(`Color inválido al mezclar: ${a} / ${b}`);
  const mixed = formatHex({
    mode: 'oklab',
    l: ca.l + (cb.l - ca.l) * t,
    a: (ca.a ?? 0) + ((cb.a ?? 0) - (ca.a ?? 0)) * t,
    b: (ca.b ?? 0) + ((cb.b ?? 0) - (ca.b ?? 0)) * t,
  });
  if (!mixed) throw new Error(`No se pudo mezclar ${a} / ${b}`);
  return mixed;
}
