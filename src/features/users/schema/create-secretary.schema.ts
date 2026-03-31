import { z } from 'zod';

export const createSecretarySchema = z.object({
  firstName: z.string().trim().min(2, 'Ingresa al menos 2 caracteres'),
  lastName: z.string().trim().min(2, 'Ingresa al menos 2 caracteres'),
  email: z.email('El formato del email no es valido'),
});

export type CreateSecretaryFormValues = z.infer<typeof createSecretarySchema>;
