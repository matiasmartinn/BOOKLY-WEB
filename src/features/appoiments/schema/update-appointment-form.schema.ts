import { z } from 'zod';

const emptyToUndefined = (value: string) => {
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
};

export const updateAppointmentFormSchema = z.object({
  clientName: z
    .string()
    .trim()
    .min(1, 'El nombre del cliente es obligatorio.')
    .max(100, 'El nombre no puede superar los 100 caracteres.'),

  clientPhone: z
    .string()
    .trim()
    .min(1, 'El teléfono es obligatorio.')
    .max(30, 'El teléfono no puede superar los 30 caracteres.'),

  clientEmail: z
    .string()
    .trim()
    .transform(emptyToUndefined)
    .pipe(z.email('El email no es válido.')),

  clientNotes: z
    .string()
    .trim()
    .max(500, 'Las notas no pueden superar los 500 caracteres.')
    .optional()
    .or(z.literal('')),
});

export type UpdateAppointmentFormValues = z.infer<typeof updateAppointmentFormSchema>;
