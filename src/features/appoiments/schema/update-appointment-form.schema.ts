import { z } from 'zod';

export const updateAppointmentFormSchema = z.object({
  clientName: z
    .string()
    .trim()
    .min(1, 'El nombre del cliente es obligatorio.')
    .max(100, 'El nombre no puede superar los 100 caracteres.'),

  clientPhone: z
    .string()
    .trim()
    .min(1, 'El telefono es obligatorio.')
    .max(30, 'El telefono no puede superar los 30 caracteres.'),

  clientEmail: z
    .string()
    .trim()
    .min(1, 'El email es obligatorio.')
    .max(255, 'El email no puede superar los 255 caracteres.')
    .email('El email no es valido.'),

  clientNotes: z.string().max(1000, 'Las notas no pueden superar 1000 caracteres.').optional(),
});

export type UpdateAppointmentFormValues = z.infer<typeof updateAppointmentFormSchema>;
