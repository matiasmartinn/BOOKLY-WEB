import { z } from 'zod';

export const recoverAccountSchema = z.object({
  email: z.string().trim().email('Ingresa un email valido.'),
});

export type RecoverAccountValues = z.infer<typeof recoverAccountSchema>;
