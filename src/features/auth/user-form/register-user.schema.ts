import { z } from 'zod';

export const registerUserSchema = z.object({
  firstName: z.string().min(3, 'Minimo 3'),
  lastName: z.string().min(3, 'Minimo 3'),
  email: z.email('El formato del email no es valido'),
  password: z.string().min(8, 'Minimo 8 caracteres'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword,   {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

  export type RegisterUserRequst =  z.infer<typeof registerUserSchema>