/** Identificador estable y legible. Nunca cambia; es la URL del club. */
export type Slug = string;

/** ISO-8601. Fecha sola: 'YYYY-MM-DD'. Año solo: 'YYYY'. */
export type ISODate = string;
export type Year = number;

export type HexColor = `#${string}`;

/** Toda afirmación factual del proyecto es Sourced o no existe. */
export interface Sourced<T> {
  value: T;
  /** URL de la fuente. `null` sólo si `verified` es false. */
  source: string | null;
  /** false ⇒ dato pendiente de verificación; la UI lo marca visualmente. */
  verified: boolean;
  /** Última revisión del dato. */
  checkedAt?: ISODate;
}

export interface MediaAsset {
  id: string;
  kind: 'image' | 'video' | 'audio' | 'panorama' | 'model3d';
  /** Ruta relativa desde /public o URL absoluta. */
  src: string;
  /** Formatos alternativos por orden de preferencia (webp→jpg, m4a→ogg…). */
  sources?: { src: string; type: string }[];
  /** Obligatorio para image/video/panorama. Descripción real, no "imagen". */
  alt: string;
  width?: number;
  height?: number;
  /** Placeholder LQIP en base64 para evitar el flash de carga. */
  blurhash?: string;
  poster?: string;
  durationSec?: number;
  credit?: string;
  license?: 'own' | 'cc-by' | 'cc-by-sa' | 'fair-use' | 'permission' | 'unknown';
}

export interface GeoPoint {
  lat: number;
  lng: number;
}
