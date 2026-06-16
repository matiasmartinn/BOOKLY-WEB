import { z } from 'zod';

import { ATTENDANCE_CLOSING_MODE } from '../constants/attendance-closing-mode';
import { createBusinessSchema } from '../business-wizard/schema';

export const updateBusinessProfileSchema = z.object({
  name: createBusinessSchema.shape.name,
  description: createBusinessSchema.shape.description,
  phoneNumber: createBusinessSchema.shape.phoneNumber,
  durationMinutes: z
    .number('Ingresa una duracion')
    .int()
    .min(1, 'La duracion debe ser mayor a 0')
    .max(1440, 'La duracion no puede superar 1440 minutos'),
  price: createBusinessSchema.shape.price,
  placeName: z.string().optional(),
  address: z.string().optional(),
  attendanceClosingMode: z.union(
    [
      z.literal(ATTENDANCE_CLOSING_MODE.MANUAL),
      z.literal(ATTENDANCE_CLOSING_MODE.AUTO_MARK_AS_ATTENDED),
    ],
    'Selecciona una opcion valida',
  ),
});

export type UpdateBusinessProfileFormValues = z.infer<typeof updateBusinessProfileSchema>;
