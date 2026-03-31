import { z } from 'zod';

export const appointmentFormSchema = z.object({
  clientName: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(200, 'El nombre no puede superar 200 caracteres'),

  clientPhone: z
    .string()
    .trim()
    .min(6, 'El telefono debe tener al menos 6 caracteres')
    .max(50, 'El telefono no puede superar 50 caracteres'),

  clientEmail: z
    .string()
    .trim()
    .max(255, 'El email no puede superar 255 caracteres')
    .refine((value) => value === '' || z.email().safeParse(value).success, {
      message: 'Ingresa un email valido',
    }),

  date: z
    .string()
    .nullable()
    .refine((value) => value !== null, {
      message: 'Selecciona una fecha',
    }),

  slot: z.string().min(1, 'Debes seleccionar un horario'),

  clientNotes: z.string().max(1000, 'Las notas no pueden superar 1000 caracteres').optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;
