import { z } from 'zod';

export const recordMetaSchema = z.object({
  schemaVersion: z.literal(1),
  updatedAt: z.string(),
  completeness: z.number().min(0).max(1),
  editorialStatus: z.enum(['draft', 'review', 'published']),
});
