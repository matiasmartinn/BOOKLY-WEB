import { z } from 'zod';

export const appointmentSchema = z.object({
  clientName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(200, 'El nombre no puede superar 200 caracteres'),

  clientPhone: z
    .string()
    .min(6, 'El teléfono debe tener al menos 6 caracteres')
    .max(50, 'El teléfono no puede superar 50 caracteres')
    .regex(/^[0-9]+$/, 'El teléfono debe contener solo números'),

  clientEmail: z
    .email('Ingresá un email válido')
    .max(255, 'El email no puede superar 255 caracteres')
    .or(z.literal('')),

  startDateTime: z.date(),

  clientNotes: z.string().max(1000, 'Las notas no pueden superar 1000 caracteres').optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
