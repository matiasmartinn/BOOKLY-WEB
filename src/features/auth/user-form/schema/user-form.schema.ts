import { z } from 'zod';

export const userSchema = z.object({
  firstName: z.string().min(4, 'Debe ser mayor a 3'),
  lastName: z.string().min(4, 'Debe ser mayor a 3'),
  email: z.email('El formato del email no es valido'),
  password: z.string().min(8, 'Debe ser mayor a 7'),
});

export type UserFormFields = z.infer<typeof userSchema>;
