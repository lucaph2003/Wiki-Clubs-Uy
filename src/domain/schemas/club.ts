import { z } from 'zod';
import { hexColorSchema, mediaAssetSchema, sourcedSchema } from './common';
import { recordMetaSchema } from './meta';
import { clubStatureSchema } from './stature';
import { clubSpacesSchema } from './spaces';
import { clubInstitutionSchema, squadPlayerSchema, transferSchema } from './institution';
import { timelineEventSchema, honourSchema } from './timeline';

export const clubIdentityColorsSchema = z.object({
  primary: hexColorSchema,
  secondary: hexColorSchema,
  accent: hexColorSchema.optional(),
  preferredScheme: z.enum(['light', 'dark']).optional(),
  note: z.string().optional(),
});

export const crestVersionSchema = z.object({
  id: z.string(),
  fromYear: z.number(),
  toYear: z.number().nullable(),
  asset: mediaAssetSchema,
  description: z.string(),
});

export const kitSchema = z.object({
  id: z.string(),
  season: z.string(),
  type: z.enum(['home', 'away', 'third', 'goalkeeper', 'special']),
  manufacturer: z.string().optional(),
  mainSponsor: z.string().optional(),
  model3d: mediaAssetSchema.optional(),
  flat: mediaAssetSchema,
  palette: z.array(hexColorSchema),
  story: sourcedSchema(z.string()).optional(),
  iconic: z.boolean(),
});

export const chantSchema = z.object({
  id: z.string(),
  title: z.string(),
  lyrics: z.string().optional(),
  audio: mediaAssetSchema,
  kind: z.enum(['cantico', 'murga', 'ambiente', 'himno']),
  loopable: z.boolean(),
});

export const clubIdentitySchema = z.object({
  colors: clubIdentityColorsSchema,
  crestHistory: z.array(crestVersionSchema),
  kits: z.array(kitSchema),
  anthem: mediaAssetSchema.optional(),
  chants: z.array(chantSchema),
  supporterVideos: z.array(mediaAssetSchema),
  mottos: z.array(z.string()),
});

export const clubSummarySchema = z.object({
  slug: z.string(),
  name: z.string(),
  shortName: z.string(),
  nickname: z.string(),
  foundedYear: z.number(),
  city: z.string(),
  crest: mediaAssetSchema,
  identity: z.object({ colors: clubIdentityColorsSchema }),
  stature: clubStatureSchema,
  division: z.enum(['primera', 'segunda', 'otra']),
});

export const clubSchema = clubSummarySchema.extend({
  identity: clubIdentitySchema,
  spaces: clubSpacesSchema,
  institution: clubInstitutionSchema,
  squad: z.array(squadPlayerSchema),
  transfers: z.array(transferSchema),
  timeline: z.array(timelineEventSchema),
  honours: z.array(honourSchema),
  derbies: z.array(z.string()),
  meta: recordMetaSchema,
});
