import { z } from 'zod';

export const serviceTypeFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Ingresa al menos 2 caracteres')
    .max(100, 'El nombre no puede superar los 100 caracteres'),
  description: z
    .string()
    .trim()
    .max(500, 'La descripcion no puede superar los 500 caracteres')
    .optional(),
});

export type ServiceTypeFormValues = z.infer<typeof serviceTypeFormSchema>;
