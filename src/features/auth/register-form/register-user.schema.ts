import { z } from 'zod';

export const registerUserSchema = z
  .object({
    firstName: z.string().min(2, 'Mínimo 2 caracteres'),
    lastName: z.string().min(2, 'Mínimo 2 caracteres'),
    email: z.email('El formato del email no es válido'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres.')
      .max(128, 'La contraseña no puede superar 128 caracteres.')
      .regex(/^(?=.*[A-Z])(?=.*\d).+$/, 'La contraseña debe contener al menos una mayúscula y un número.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type RegisterUserRequst = z.infer<typeof registerUserSchema>;
