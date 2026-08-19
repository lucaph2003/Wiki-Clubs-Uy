import { z } from 'zod';

const tierSchema = z.enum(['colosal', 'grande', 'historico', 'clasico', 'emergente']);

export const clubStatureSchema = z.object({
  score: z.number().min(0).max(100),
  tier: tierSchema,
  breakdown: z.object({
    nationalTitles: z.number(),
    continentalTitles: z.number(),
    yearsInTopFlight: z.number(),
    culturalWeight: z.number().min(0).max(100),
    activeSupportBase: z.number().min(0).max(100),
  }),
  manualOverride: z.object({ tier: tierSchema, reason: z.string() }).optional(),
});
