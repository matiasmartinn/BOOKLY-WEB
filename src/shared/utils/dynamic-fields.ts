import { z } from 'zod';

import type { DynamicFieldDefinitionDto } from 'shared/models';
import { ServiceTypeFieldType } from 'shared/models';

export interface BuildAppointmentSchemaOptions {
  canUseDynamicFields: boolean;
  fieldDefinitions: DynamicFieldDefinitionDto[];
}

export interface DynamicAppointmentFieldValueDto {
  fieldDefinitionId: number;
  value: string;
}

export const getActiveDynamicFieldDefinitions = (
  fieldDefinitions: DynamicFieldDefinitionDto[],
): DynamicFieldDefinitionDto[] =>
  fieldDefinitions
    .filter((fieldDefinition) => fieldDefinition.isActive !== false)
    .map((fieldDefinition) => ({
      ...fieldDefinition,
      options: fieldDefinition.options.filter((option) => option.isActive !== false),
    }));

const appointmentBaseSchema = z.object({
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

  additionalFields: z.record(z.string(), z.unknown()),
});

export type AppointmentFormValuesBase = z.infer<typeof appointmentBaseSchema>;

export const createAppointmentFormDefaultValues = (): AppointmentFormValuesBase => ({
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  clientNotes: '',
  date: null,
  slot: '',
  additionalFields: {},
});

export const buildAppointmentSchema = ({
  canUseDynamicFields,
  fieldDefinitions,
}: BuildAppointmentSchemaOptions) =>
  appointmentBaseSchema.superRefine((values, context) => {
    if (!canUseDynamicFields) {
      return;
    }

    for (const fieldDefinition of fieldDefinitions) {
      const rawValue = values.additionalFields[fieldDefinition.key];
      const hasValue = hasDynamicFieldValue(fieldDefinition, rawValue);

      if (fieldDefinition.isRequired && !hasValue) {
        context.addIssue({
          code: 'custom',
          path: ['additionalFields', fieldDefinition.key],
          message: `${fieldDefinition.label} es obligatorio.`,
        });
        continue;
      }

      if (!hasValue) {
        continue;
      }

      if (!isDynamicFieldValueValid(fieldDefinition, rawValue)) {
        context.addIssue({
          code: 'custom',
          path: ['additionalFields', fieldDefinition.key],
          message: buildInvalidDynamicFieldValueMessage(fieldDefinition),
        });
      }
    }
  });

export const mapAdditionalFieldsToFieldValues = (
  additionalFields: Record<string, unknown> | undefined,
  fieldDefinitions: DynamicFieldDefinitionDto[],
): DynamicAppointmentFieldValueDto[] => {
  if (!additionalFields) {
    return [];
  }

  return fieldDefinitions.reduce<DynamicAppointmentFieldValueDto[]>((accumulator, fieldDefinition) => {
    const rawValue = additionalFields[fieldDefinition.key];

    if (!hasDynamicFieldValue(fieldDefinition, rawValue)) {
      return accumulator;
    }

    accumulator.push({
      fieldDefinitionId: fieldDefinition.id,
      value: serializeDynamicFieldValue(rawValue),
    });

    return accumulator;
  }, []);
};

const hasDynamicFieldValue = (fieldDefinition: DynamicFieldDefinitionDto, rawValue: unknown) => {
  if (fieldDefinition.fieldType === ServiceTypeFieldType.Checkbox) {
    return typeof rawValue === 'boolean';
  }

  if (fieldDefinition.fieldType === ServiceTypeFieldType.Number) {
    return typeof rawValue === 'number' || isFilledString(rawValue);
  }

  return isFilledString(rawValue);
};

const isDynamicFieldValueValid = (
  fieldDefinition: DynamicFieldDefinitionDto,
  rawValue: unknown,
) => {
  const availableOptions = fieldDefinition.options.filter((option) => option.isActive !== false);

  switch (fieldDefinition.fieldType) {
    case ServiceTypeFieldType.Text:
    case ServiceTypeFieldType.MultilineText:
      return isFilledString(rawValue);

    case ServiceTypeFieldType.Number:
      return (
        (typeof rawValue === 'number' && Number.isFinite(rawValue)) ||
        (isFilledString(rawValue) && Number.isFinite(Number(rawValue.trim())))
      );

    case ServiceTypeFieldType.Date:
      return isFilledString(rawValue) && /^\d{4}-\d{2}-\d{2}$/.test(rawValue.trim());

    case ServiceTypeFieldType.Select:
      return (
        isFilledString(rawValue) &&
        availableOptions.some(
          (option) => option.value.toLowerCase() === rawValue.trim().toLowerCase(),
        )
      );

    case ServiceTypeFieldType.Checkbox:
      return typeof rawValue === 'boolean';

    default:
      return false;
  }
};

const buildInvalidDynamicFieldValueMessage = (fieldDefinition: DynamicFieldDefinitionDto) => {
  switch (fieldDefinition.fieldType) {
    case ServiceTypeFieldType.Number:
      return `${fieldDefinition.label} debe contener un numero valido.`;
    case ServiceTypeFieldType.Date:
      return `${fieldDefinition.label} debe contener una fecha valida.`;
    case ServiceTypeFieldType.Select:
      return `${fieldDefinition.label} debe seleccionar una opcion valida.`;
    case ServiceTypeFieldType.Checkbox:
      return `${fieldDefinition.label} debe indicar verdadero o falso.`;
    default:
      return `${fieldDefinition.label} contiene un valor invalido.`;
  }
};

const serializeDynamicFieldValue = (rawValue: unknown) => {
  if (typeof rawValue === 'boolean') {
    return String(rawValue);
  }

  if (typeof rawValue === 'number') {
    return String(rawValue);
  }

  return String(rawValue).trim();
};

const isFilledString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;
