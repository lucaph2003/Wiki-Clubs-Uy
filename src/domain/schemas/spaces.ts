import { z } from 'zod';
import { geoPointSchema, mediaAssetSchema, sourcedSchema } from './common';

export const panoramaSpotSchema = z.object({
  id: z.string(),
  label: z.string(),
  asset: mediaAssetSchema,
  links: z.array(z.object({ toSpotId: z.string(), yawDeg: z.number() })).optional(),
  initialYawDeg: z.number().optional(),
});

export const venueSchema = z.object({
  id: z.string(),
  name: z.string(),
  officialName: z.string().optional(),
  neighborhood: z.string(),
  city: z.string(),
  location: geoPointSchema,
  openedYear: z.number().optional(),
  capacity: sourcedSchema(z.number()).optional(),
  gallery: z.array(mediaAssetSchema),
  hinchada: z.array(mediaAssetSchema),
  trapos: z.array(mediaAssetSchema),
  panoramas: z.array(panoramaSpotSchema),
  externalTour: z
    .object({
      provider: z.enum(['google-street-view', 'matterport', 'other']),
      embedUrl: z.string(),
      requiresConsent: z.literal(true),
    })
    .optional(),
  description: sourcedSchema(z.string()),
});

export const landmarkSchema = z.object({
  id: z.string(),
  kind: z.enum(['mural', 'bar', 'previa', 'monumento', 'sede-historica', 'otro']),
  name: z.string(),
  location: geoPointSchema,
  description: sourcedSchema(z.string()),
  media: z.array(mediaAssetSchema),
});

export const neighborhoodRouteSchema = z.object({
  id: z.string(),
  name: z.string(),
  distanceKm: z.number(),
  durationMin: z.number(),
  stops: z.array(z.string()),
  path: z.array(geoPointSchema),
  description: z.string(),
});

export const clubSpacesSchema = z.object({
  stadium: venueSchema,
  altStadiums: z.array(venueSchema).optional(),
  headquarters: venueSchema.optional(),
  trainingGround: venueSchema.optional(),
  landmarks: z.array(landmarkSchema),
  routes: z.array(neighborhoodRouteSchema),
});
