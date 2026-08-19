import { z } from 'zod';
import { mediaAssetSchema, sourcedSchema } from './common';

export const timelineEventSchema = z.object({
  id: z.string(),
  date: z.string(),
  precision: z.enum(['day', 'month', 'year']),
  title: z.string(),
  summary: z.string(),
  body: z.string().optional(),
  kind: z.enum(['fundacion', 'titulo', 'estadio', 'figura', 'hito', 'crisis', 'clasico']),
  weight: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  media: z.array(mediaAssetSchema).optional(),
  source: z.string().nullable(),
  verified: z.boolean(),
});

export const honourSchema = z.object({
  id: z.string(),
  competition: z.string(),
  scope: z.enum(['nacional', 'continental', 'intercontinental', 'regional']),
  count: sourcedSchema(z.number()),
  years: z.array(z.number()),
});
