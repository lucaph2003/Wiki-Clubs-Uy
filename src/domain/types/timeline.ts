import type { ISODate, MediaAsset, Sourced, Year } from './common';

export interface TimelineEvent {
  id: string;
  /** Precisión variable: a veces sólo se conoce el año. */
  date: ISODate;
  precision: 'day' | 'month' | 'year';
  title: string;
  summary: string;
  body?: string;
  kind: 'fundacion' | 'titulo' | 'estadio' | 'figura' | 'hito' | 'crisis' | 'clasico';
  /** 1–5. Define el peso visual en la timeline swipeable. */
  weight: 1 | 2 | 3 | 4 | 5;
  media?: MediaAsset[];
  source: string | null;
  verified: boolean;
}

export interface Honour {
  id: string;
  competition: string;
  scope: 'nacional' | 'continental' | 'intercontinental' | 'regional';
  count: Sourced<number>;
  years: Year[];
}
