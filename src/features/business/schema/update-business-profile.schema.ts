import { z } from 'zod';

import { createBusinessSchema } from '../business-wizard/schema';

export const updateBusinessProfileSchema = z.object({
  name: createBusinessSchema.shape.name,
  slug: createBusinessSchema.shape.slug,
  description: createBusinessSchema.shape.description,
  serviceTypeId: createBusinessSchema.shape.serviceTypeId,
  placeName: z.string().optional(),
  address: z.string().optional(),
  googleMapsUrl: z.string().optional(),
});

export type UpdateBusinessProfileFormValues = z.infer<typeof updateBusinessProfileSchema>;
