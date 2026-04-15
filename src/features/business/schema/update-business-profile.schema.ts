import { z } from 'zod';

import { createBusinessSchema } from '../business-wizard/schema';

export const updateBusinessProfileSchema = z.object({
  name: createBusinessSchema.shape.name,
  slug: z
    .string()
    .trim()
    .min(1, 'Ingresa el slug del enlace publico')
    .regex(/^[a-z0-9-]+$/, 'Solo letras minusculas, numeros y guiones'),
  description: createBusinessSchema.shape.description,
  phoneNumber: createBusinessSchema.shape.phoneNumber,
  serviceTypeId: createBusinessSchema.shape.serviceTypeId,
  placeName: z.string().optional(),
  address: z.string().optional(),
  googleMapsUrl: z.string().optional(),
});

export type UpdateBusinessProfileFormValues = z.infer<typeof updateBusinessProfileSchema>;
