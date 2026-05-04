import type {
  AppointmentDto,
  AppointmentFieldValueDto,
  AppointmentListItemDto,
  DynamicFieldDefinitionDto,
  ServiceDto,
} from 'shared/models';
import { ServiceTypeFieldType } from 'shared/models';
import { formatDateOnly, formatDateTime, formatTime } from 'shared/utils';

import type {
  AppointmentDynamicColumnViewModel,
  AppointmentExtraFieldViewModel,
  AppointmentViewModel,
} from '../viewmodel';

type AppointmentLike = AppointmentDto | AppointmentListItemDto;

const EMPTY_DYNAMIC_FIELD_VALUE = '-';

export const getVisibleAppointmentDynamicColumns = (
  service?: Pick<ServiceDto, 'allowsExtraFields' | 'fieldDefinitions'> | null,
): AppointmentDynamicColumnViewModel[] => {
  if (!service?.allowsExtraFields || service.fieldDefinitions.length === 0) {
    return [];
  }

  return service.fieldDefinitions
    .filter((fieldDefinition) => fieldDefinition.isActive !== false)
    .sort((left, right) => left.sortOrder - right.sortOrder || left.id - right.id)
    .map((field) => ({
      key: field.key,
      label: field.label,
    }));
};

export const mapAppointmentListToViewModel = (
  items: AppointmentLike[],
  fieldDefinitions: DynamicFieldDefinitionDto[] = [],
): AppointmentViewModel[] => items.map((item) => mapAppointmentToViewModel(item, fieldDefinitions));

const mapAppointmentToViewModel = (
  item: AppointmentLike,
  fieldDefinitions: DynamicFieldDefinitionDto[],
): AppointmentViewModel => {
  return {
    id: item.id,
    clientName: item.clientName,
    clientPhone: item.clientPhone,
    clientEmail: item.clientEmail ?? null,
    startDateTime: item.startDateTime,
    endDateTime: item.endDateTime,
    durationMinutes: item.durationMinutes,
    status: item.status,
    clientNotes: item.clientNotes ?? null,
    createdOn: item.createdOn,
    dateLabel: formatDateTime(item.startDateTime),
    timeLabel: `${formatTime(item.startDateTime)} - ${formatTime(item.endDateTime)}`,
    extraFields: mapAppointmentExtraFields(fieldDefinitions, item.fieldValues),
  };
};

const mapAppointmentExtraFields = (
  fieldDefinitions: DynamicFieldDefinitionDto[],
  fieldValues: AppointmentFieldValueDto[] = [],
): AppointmentExtraFieldViewModel[] => {
  if (fieldDefinitions.length === 0) {
    return [];
  }

  const valuesByFieldDefinitionId = new Map(
    fieldValues.map((fieldValue) => [fieldValue.fieldDefinitionId, fieldValue.value]),
  );

  return fieldDefinitions
    .slice()
    .sort((left, right) => left.sortOrder - right.sortOrder || left.id - right.id)
    .filter(
      (fieldDefinition) =>
        fieldDefinition.isActive !== false || valuesByFieldDefinitionId.has(fieldDefinition.id),
    )
    .map((fieldDefinition) => ({
      key: fieldDefinition.key,
      label: fieldDefinition.label,
      value: resolveDynamicFieldDisplayValue(
        fieldDefinition,
        valuesByFieldDefinitionId.get(fieldDefinition.id),
      ),
    }));
};

const resolveDynamicFieldDisplayValue = (
  fieldDefinition: DynamicFieldDefinitionDto,
  rawValue?: string,
) => {
  if (rawValue == null) {
    return EMPTY_DYNAMIC_FIELD_VALUE;
  }

  const trimmedValue = rawValue.trim();
  if (!trimmedValue) {
    return EMPTY_DYNAMIC_FIELD_VALUE;
  }

  switch (fieldDefinition.fieldType) {
    case ServiceTypeFieldType.Checkbox: {
      if (trimmedValue.toLowerCase() === 'true') {
        return 'Sí';
      }

      if (trimmedValue.toLowerCase() === 'false') {
        return 'No';
      }

      return trimmedValue;
    }

    case ServiceTypeFieldType.Date:
      return formatDateOnly(trimmedValue) || trimmedValue;

    case ServiceTypeFieldType.Select:
      return (
        fieldDefinition.options.find(
          (option) => option.value.trim().toLowerCase() === trimmedValue.toLowerCase(),
        )?.label ?? trimmedValue
      );

    default:
      return trimmedValue;
  }
};
