import type { HexColor, ISODate, MediaAsset, Slug, Sourced } from './common';
import type { RecordMeta } from './meta';

export interface Derby {
  slug: Slug; // 'clasico-de-los-medianos'
  name: string;
  aka?: string[];
  /** SIEMPRE dos, en orden estable [izquierda, derecha] del split screen. */
  sides: [DerbySide, DerbySide];
  intensity: 1 | 2 | 3 | 4 | 5;
  origin: Sourced<string>;
  headToHead: HeadToHead;
  /** Jugadores que jugaron en ambos clubes. */
  crossovers: Crossover[];
  memorableMatches: DerbyMatch[];
  /** Módulos de gamificación habilitados para este clásico. */
  games: DerbyGameConfig;
  media: MediaAsset[];
  meta: RecordMeta;
}

export interface DerbySide {
  clubSlug: Slug;
  /** Denormalizado para que el split screen renderice sin cargar el club entero. */
  shortName: string;
  crest: MediaAsset;
  colors: { primary: HexColor; secondary: HexColor };
  /** 'left' | 'right' explícito: nunca depender del índice del array en el CSS. */
  side: 'left' | 'right';
}

export interface HeadToHead {
  totalMatches: Sourced<number>;
  winsBySlug: Record<Slug, number>;
  draws: number;
  goalsBySlug: Record<Slug, number>;
  biggestWin?: { clubSlug: Slug; score: string; date: ISODate };
  currentStreak?: { clubSlug: Slug | null; count: number };
  /** Rango de la estadística: importante para la honestidad del número. */
  coverage: { fromYear: number; toYear: number; competitions: string[] };
}

export interface Crossover {
  playerId: string;
  displayName: string;
  photo?: MediaAsset;
  spells: { clubSlug: Slug; fromYear: number; toYear: number; appearances?: number }[];
  /** 'lo quisieron en los dos lados' vs 'traición' — tono siempre deportivo. */
  note?: Sourced<string>;
}

export interface DerbyMatch {
  id: string;
  date: ISODate;
  competition: string;
  score: string; // '2-1' en el orden de `sides`
  venue: string;
  story: Sourced<string>;
  media?: MediaAsset[];
}

export interface DerbyGameConfig {
  combinedXI: boolean; // armar el 11 ideal combinado
  polls: Poll[];
  quiz?: boolean;
}

export interface Poll {
  id: string;
  question: string;
  options: { id: string; label: string; clubSlug?: Slug }[];
  /** Resultados mock en Fase 1; en Fase 2 vienen del backend. */
  mockResults?: Record<string, number>;
  closesAt?: ISODate;
}
