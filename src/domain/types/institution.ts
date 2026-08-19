import type { ISODate, MediaAsset, Slug, Sourced, Year } from './common';

export interface ClubInstitution {
  president: Official | null;
  boardMembers: Official[];
  /** Balances SIMPLIFICADOS. Nunca inventar cifras. */
  finances: FinancialSnapshot[];
  membershipCount?: Sourced<number>;
  legalName?: string;
  website?: string;
  socials?: { platform: string; url: string }[];
}

export interface Official {
  id: string;
  fullName: string;
  role: string; // 'Presidente', 'Vicepresidente'
  sinceYear?: Year;
  untilYear?: Year | null;
  photo?: MediaAsset;
}

export interface FinancialSnapshot {
  year: Year;
  currency: 'UYU' | 'USD';
  /** En unidades enteras de la moneda. Presentar siempre con la fuente visible. */
  revenue?: Sourced<number>;
  expenses?: Sourced<number>;
  result?: Sourced<number>;
  debt?: Sourced<number>;
  note?: string;
}

export interface SquadPlayer {
  id: string;
  fullName: string;
  displayName: string;
  position: Position;
  shirtNumber?: number;
  birthDate?: ISODate;
  nationality: string[]; // ISO 3166-1 alpha-2
  heightCm?: number;
  photo?: MediaAsset;
  /** Canterano del club. */
  homegrown: boolean;
  joinedAt?: ISODate;
  contractUntil?: ISODate;
  marketValueUsd?: Sourced<number>;
}

export type Position = 'GK' | 'CB' | 'LB' | 'RB' | 'DM' | 'CM' | 'AM' | 'LW' | 'RW' | 'ST';

export interface Transfer {
  id: string;
  playerId: string;
  playerName: string;
  direction: 'in' | 'out';
  counterpartClub: string;
  counterpartClubSlug?: Slug;
  year: Year;
  feeUsd?: Sourced<number>;
  /** Para el ranking de "mejores ventas históricas". */
  isRecordSale?: boolean;
  note?: string;
}
