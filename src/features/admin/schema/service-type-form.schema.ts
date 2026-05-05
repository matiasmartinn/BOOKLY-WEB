import { z } from 'zod';
import { SERVICE_TYPE_ICON_KEYS } from 'shared/utils';

export const serviceTypeFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Ingresa al menos 2 caracteres')
    .max(100, 'El nombre no puede superar los 100 caracteres'),
  description: z
    .string()
    .trim()
    .max(500, 'La descripcion no puede superar los 500 caracteres')
    .optional(),
  colorHex: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Usa formato HEX #RRGGBB'),
  iconKey: z.enum(SERVICE_TYPE_ICON_KEYS).nullable().optional(),
});

export type ServiceTypeFormValues = z.infer<typeof serviceTypeFormSchema>;
