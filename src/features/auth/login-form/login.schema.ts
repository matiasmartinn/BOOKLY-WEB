import z from 'zod';

export const loginSchema = z.object({
  email: z.email('El formato del email no es valido'),
  password: z.string().min(8, 'Debe ser mayor a 7'),
});

export type LoginRequest = z.infer<typeof loginSchema>;
