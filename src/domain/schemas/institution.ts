import { z } from 'zod';
import { mediaAssetSchema, sourcedSchema } from './common';

export const officialSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  role: z.string(),
  sinceYear: z.number().optional(),
  untilYear: z.number().nullable().optional(),
  photo: mediaAssetSchema.optional(),
});

export const financialSnapshotSchema = z.object({
  year: z.number(),
  currency: z.enum(['UYU', 'USD']),
  revenue: sourcedSchema(z.number()).optional(),
  expenses: sourcedSchema(z.number()).optional(),
  result: sourcedSchema(z.number()).optional(),
  debt: sourcedSchema(z.number()).optional(),
  note: z.string().optional(),
});

export const clubInstitutionSchema = z.object({
  president: officialSchema.nullable(),
  boardMembers: z.array(officialSchema),
  finances: z.array(financialSnapshotSchema),
  membershipCount: sourcedSchema(z.number()).optional(),
  legalName: z.string().optional(),
  website: z.string().optional(),
  socials: z.array(z.object({ platform: z.string(), url: z.string() })).optional(),
});

export const positionSchema = z.enum(['GK', 'CB', 'LB', 'RB', 'DM', 'CM', 'AM', 'LW', 'RW', 'ST']);

export const squadPlayerSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  displayName: z.string(),
  position: positionSchema,
  shirtNumber: z.number().optional(),
  birthDate: z.string().optional(),
  nationality: z.array(z.string()),
  heightCm: z.number().optional(),
  photo: mediaAssetSchema.optional(),
  homegrown: z.boolean(),
  joinedAt: z.string().optional(),
  contractUntil: z.string().optional(),
  marketValueUsd: sourcedSchema(z.number()).optional(),
});

export const transferSchema = z.object({
  id: z.string(),
  playerId: z.string(),
  playerName: z.string(),
  direction: z.enum(['in', 'out']),
  counterpartClub: z.string(),
  counterpartClubSlug: z.string().optional(),
  year: z.number(),
  feeUsd: sourcedSchema(z.number()).optional(),
  isRecordSale: z.boolean().optional(),
  note: z.string().optional(),
});
