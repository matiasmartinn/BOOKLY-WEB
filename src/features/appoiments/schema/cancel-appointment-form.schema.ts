import { z } from 'zod';

export const cancelAppointmentFormSchema = z.object({
  reason: z
    .string()
    .trim()
    .max(300, 'El motivo no puede superar los 300 caracteres.')
    .optional()
    .or(z.literal('')),
});

export type CancelAppointmentFormValues = z.infer<typeof cancelAppointmentFormSchema>;
