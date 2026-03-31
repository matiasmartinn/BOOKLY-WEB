import { z } from 'zod';

export const secretaryOnboardingSchema = z
  .object({
    password: z
      .string()
      .min(8, 'La contrasena debe tener al menos 8 caracteres.')
      .regex(/^(?=.*[A-Z])(?=.*\d).+$/, 'La contrasena debe contener al menos una mayuscula y un numero.'),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Las contrasenas no coinciden.',
    path: ['confirmPassword'],
  });

export type SecretaryOnboardingValues = z.infer<typeof secretaryOnboardingSchema>;
