import type { GeoPoint, MediaAsset, Sourced, Year } from './common';

export interface ClubSpaces {
  stadium: Venue;
  altStadiums?: Venue[];
  headquarters?: Venue;
  trainingGround?: Venue;
  /** Puntos culturales: murales, bares de previa, esquinas, monumentos. */
  landmarks: Landmark[];
  /** Recorridos a pie sugeridos por el barrio. */
  routes: NeighborhoodRoute[];
}

export interface Venue {
  id: string;
  name: string;
  officialName?: string;
  neighborhood: string;
  city: string;
  location: GeoPoint;
  openedYear?: Year;
  capacity?: Sourced<number>;
  gallery: MediaAsset[];
  /** Fotos de la hinchada: banderas, tribunas, previas, festejos. */
  hinchada: MediaAsset[];
  /** Fotos de trapos y banderas identitarias del club. */
  trapos: MediaAsset[];
  /** Recorridos inmersivos. */
  panoramas: PanoramaSpot[];
  /** Embed externo (Street View / Matterport). Se carga bajo demanda. */
  externalTour?: {
    provider: 'google-street-view' | 'matterport' | 'other';
    /** URL de embed, ya saneada. */
    embedUrl: string;
    /** Requiere consentimiento del usuario antes de cargar (cookies de terceros). */
    requiresConsent: true;
  };
  description: Sourced<string>;
}

export interface PanoramaSpot {
  id: string;
  label: string; // 'Tribuna Ámsterdam', 'Túnel de vestuarios'
  asset: MediaAsset; // kind: 'panorama', equirectangular
  /** Navegación entre spots. */
  links?: { toSpotId: string; yawDeg: number }[];
  initialYawDeg?: number;
}

export interface Landmark {
  id: string;
  kind: 'mural' | 'bar' | 'previa' | 'monumento' | 'sede-historica' | 'otro';
  name: string;
  location: GeoPoint;
  description: Sourced<string>;
  media: MediaAsset[];
}

export interface NeighborhoodRoute {
  id: string;
  name: string; // 'Del Palacio Peñarol al Campeón del Siglo'
  distanceKm: number;
  durationMin: number;
  /** Orden de paradas: ids de Landmark o Venue. */
  stops: string[];
  /** GeoJSON LineString serializado. */
  path: GeoPoint[];
  description: string;
}
