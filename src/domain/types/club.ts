import type { HexColor, MediaAsset, Slug, Sourced, Year } from './common';
import type { RecordMeta } from './meta';
import type { ClubStature } from './stature';
import type { ClubSpaces } from './spaces';
import type { ClubInstitution, SquadPlayer, Transfer } from './institution';
import type { TimelineEvent, Honour } from './timeline';

/** Versión liviana: es lo ÚNICO que carga la grilla del index. */
export interface ClubSummary {
  slug: Slug;
  name: string; // 'Club Atlético Peñarol'
  shortName: string; // 'Peñarol'
  nickname: string; // 'Aurinegro'
  foundedYear: Year;
  city: string;
  crest: MediaAsset;
  identity: Pick<ClubIdentity, 'colors'>;
  /** Ver §8.6: NO es una opinión, es un cálculo. */
  stature: ClubStature;
  /** División actual, para filtros de la grilla. */
  division: 'primera' | 'segunda' | 'otra';
}

export interface Club extends ClubSummary {
  identity: ClubIdentity;
  spaces: ClubSpaces;
  institution: ClubInstitution;
  squad: SquadPlayer[];
  transfers: Transfer[];
  timeline: TimelineEvent[];
  honours: Honour[];
  derbies: Slug[]; // slugs de Derby en los que participa
  meta: RecordMeta;
}

export interface ClubIdentity {
  colors: {
    primary: HexColor;
    secondary: HexColor;
    accent?: HexColor;
    /** Fuerza el esquema si el cálculo automático no representa al club. */
    preferredScheme?: 'light' | 'dark';
    /** Nota para humanos: de dónde salió el color. */
    note?: string;
  };
  crestHistory: CrestVersion[];
  kits: Kit[];
  anthem?: MediaAsset;
  chants: Chant[];
  /** Videos curados de hinchada. Máximo 6 por club. */
  supporterVideos: MediaAsset[];
  mottos: string[];
}

export interface CrestVersion {
  id: string;
  fromYear: Year;
  toYear: Year | null; // null = vigente
  asset: MediaAsset;
  description: string;
}

export interface Kit {
  id: string;
  season: string; // '1966' | '2024/25'
  type: 'home' | 'away' | 'third' | 'goalkeeper' | 'special';
  manufacturer?: string;
  mainSponsor?: string;
  /** Modelo 3D interactivo. Ausente ⇒ la UI cae al render 2D. */
  model3d?: MediaAsset;
  /** Fallback 2D SIEMPRE presente. */
  flat: MediaAsset;
  /** Colores dominantes para el fondo del visor. */
  palette: HexColor[];
  story?: Sourced<string>; // 'la camiseta del quinquenio'
  iconic: boolean;
}

export interface Chant {
  id: string;
  title: string;
  /** Letra: sólo si es publicable y no ofensiva. Ver §14 (moderación). */
  lyrics?: string;
  audio: MediaAsset;
  kind: 'cantico' | 'murga' | 'ambiente' | 'himno';
  /** Se puede usar como audio ambiente de fondo del club. */
  loopable: boolean;
}
