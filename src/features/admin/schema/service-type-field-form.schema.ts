import { z } from 'zod';
import type { ServiceTypeFieldDefinitionDto } from 'shared/models';

interface CreateServiceTypeFieldFormSchemaOptions {
  existingFields: ServiceTypeFieldDefinitionDto[];
  mode: 'create' | 'edit';
}

const ALLOWED_FIELD_TYPES = ['1', '2', '3', '4', '5', '6'] as const;

export const createServiceTypeFieldFormSchema = ({
  existingFields,
  mode,
}: CreateServiceTypeFieldFormSchemaOptions) =>
  z
    .object({
      label: z
        .string()
        .trim()
        .min(2, 'Ingresa al menos 2 caracteres')
        .max(40, 'El label no puede superar los 40 caracteres'),
      key: z
        .string()
        .trim()
        .min(2, 'Ingresa al menos 2 caracteres')
        .max(60, 'La key no puede superar los 60 caracteres')
        .regex(
          /^[a-z0-9_]+$/,
          'La key solo puede contener letras minusculas, numeros y guion bajo',
        ),
      fieldType: z.enum(ALLOWED_FIELD_TYPES, {
        message: 'Selecciona un tipo de campo valido',
      }),
      isRequired: z.boolean(),
    })
    .superRefine((values, context) => {
      if (mode !== 'create') {
        return;
      }

      const normalizedKey = values.key.trim().toLowerCase();
      const keyAlreadyExists = existingFields.some(
        (field) => field.key.trim().toLowerCase() === normalizedKey,
      );

      if (keyAlreadyExists) {
        context.addIssue({
          code: 'custom',
          path: ['key'],
          message: 'Ya existe un campo con esa key para este tipo de servicio',
        });
      }
    });

export type ServiceTypeFieldFormValues = z.infer<
  ReturnType<typeof createServiceTypeFieldFormSchema>
>;
