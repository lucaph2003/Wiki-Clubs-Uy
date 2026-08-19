import { z } from 'zod';

export const hexColorSchema = z.string().regex(/^#[0-9a-fA-F]{3,8}$/, 'Debe ser un color hex válido');

export const sourcedSchema = <T extends z.ZodTypeAny>(value: T) =>
  z.object({
    value,
    source: z.string().nullable(),
    verified: z.boolean(),
    checkedAt: z.string().optional(),
  });

export const mediaAssetSchema = z.object({
  id: z.string(),
  kind: z.enum(['image', 'video', 'audio', 'panorama', 'model3d']),
  src: z.string(),
  sources: z.array(z.object({ src: z.string(), type: z.string() })).optional(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  blurhash: z.string().optional(),
  poster: z.string().optional(),
  durationSec: z.number().optional(),
  credit: z.string().optional(),
  license: z.enum(['own', 'cc-by', 'cc-by-sa', 'fair-use', 'permission', 'unknown']).optional(),
});

export const geoPointSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});
