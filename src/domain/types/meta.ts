import type { ISODate, Slug } from './common';

export interface RecordMeta {
  /** Versión del esquema; se incrementa ante cambios rompientes. */
  schemaVersion: 1;
  updatedAt: ISODate;
  /** Completitud 0–1: permite a la UI ocultar secciones vacías con elegancia. */
  completeness: number;
  editorialStatus: 'draft' | 'review' | 'published';
}

export interface Skin {
  clubSlug: Slug;
  scheme: 'light' | 'dark';
  /** Mapa listo para `style.setProperty`. Las claves SON los nombres de las vars. */
  tokens: Record<string, string>;
}
