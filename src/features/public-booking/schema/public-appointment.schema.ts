import { z } from 'zod';

const publicAppointmentBaseSchema = z.object({
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
    .min(1, 'El email es obligatorio')
    .max(255, 'El email no puede superar 255 caracteres')
    .email('Ingresa un email valido'),

  date: z.string().nullable().refine((value) => value !== null, {
    message: 'Selecciona una fecha',
  }),

  slot: z.string().min(1, 'Debes seleccionar un horario'),

  clientNotes: z.string().max(1000, 'Las notas no pueden superar 1000 caracteres').optional(),
});

export type PublicAppointmentFormValues = z.infer<typeof publicAppointmentBaseSchema>;

export const createPublicAppointmentSchema = publicAppointmentBaseSchema;

export const createPublicAppointmentDefaultValues = (): PublicAppointmentFormValues => ({
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  clientNotes: '',
  date: null,
  slot: '',
});
