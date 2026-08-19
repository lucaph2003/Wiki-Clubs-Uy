import { z } from 'zod';
import { hexColorSchema, mediaAssetSchema, sourcedSchema } from './common';
import { recordMetaSchema } from './meta';

export const derbySideSchema = z.object({
  clubSlug: z.string(),
  shortName: z.string(),
  crest: mediaAssetSchema,
  colors: z.object({ primary: hexColorSchema, secondary: hexColorSchema }),
  side: z.enum(['left', 'right']),
});

export const headToHeadSchema = z.object({
  totalMatches: sourcedSchema(z.number()),
  winsBySlug: z.record(z.string(), z.number()),
  draws: z.number(),
  goalsBySlug: z.record(z.string(), z.number()),
  biggestWin: z.object({ clubSlug: z.string(), score: z.string(), date: z.string() }).optional(),
  currentStreak: z.object({ clubSlug: z.string().nullable(), count: z.number() }).optional(),
  coverage: z.object({
    fromYear: z.number(),
    toYear: z.number(),
    competitions: z.array(z.string()),
  }),
});

export const crossoverSchema = z.object({
  playerId: z.string(),
  displayName: z.string(),
  photo: mediaAssetSchema.optional(),
  spells: z.array(
    z.object({
      clubSlug: z.string(),
      fromYear: z.number(),
      toYear: z.number(),
      appearances: z.number().optional(),
    }),
  ),
  note: sourcedSchema(z.string()).optional(),
});

export const derbyMatchSchema = z.object({
  id: z.string(),
  date: z.string(),
  competition: z.string(),
  score: z.string(),
  venue: z.string(),
  story: sourcedSchema(z.string()),
  media: z.array(mediaAssetSchema).optional(),
});

export const pollSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.object({ id: z.string(), label: z.string(), clubSlug: z.string().optional() })),
  mockResults: z.record(z.string(), z.number()).optional(),
  closesAt: z.string().optional(),
});

export const derbyGameConfigSchema = z.object({
  combinedXI: z.boolean(),
  polls: z.array(pollSchema),
  quiz: z.boolean().optional(),
});

export const derbySchema = z.object({
  slug: z.string(),
  name: z.string(),
  aka: z.array(z.string()).optional(),
  sides: z.tuple([derbySideSchema, derbySideSchema]),
  intensity: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  origin: sourcedSchema(z.string()),
  headToHead: headToHeadSchema,
  crossovers: z.array(crossoverSchema),
  memorableMatches: z.array(derbyMatchSchema),
  games: derbyGameConfigSchema,
  media: z.array(mediaAssetSchema),
  meta: recordMetaSchema,
});
