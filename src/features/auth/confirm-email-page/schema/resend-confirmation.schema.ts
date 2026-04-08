import { z } from 'zod';

export const resendConfirmationSchema = z.object({
  email: z.string().trim().email('Ingresa un email valido.'),
});

export type ResendConfirmationValues = z.infer<typeof resendConfirmationSchema>;
