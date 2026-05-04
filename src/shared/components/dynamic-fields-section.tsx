import { Checkbox, Select, Stack, Text, TextInput, Textarea } from '@mantine/core';
import { useMemo } from 'react';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';

import type { DynamicFieldDefinitionDto } from 'shared/models';
import { ServiceTypeFieldType } from 'shared/models';

interface DynamicFieldsSectionProps {
  control: Control<any>;
  errors?: FieldErrors<any>;
  fieldDefinitions: DynamicFieldDefinitionDto[];
  disabled?: boolean;
  title?: string;
  description?: string;
}

export function DynamicFieldsSection({
  control,
  errors,
  fieldDefinitions,
  disabled = false,
  title = 'Campos adicionales',
  description,
}: DynamicFieldsSectionProps) {
  const orderedFields = useMemo(
    () =>
      [...fieldDefinitions].sort(
        (left, right) => left.sortOrder - right.sortOrder || left.id - right.id,
      ),
    [fieldDefinitions],
  );

  const additionalFieldErrors =
    (errors?.additionalFields as Record<string, { message?: string } | undefined> | undefined) ??
    {};

  return (
    <Stack gap="md">
      <Stack gap={4}>
        <Text fw={600}>{title}</Text>
        {description ? (
          <Text size="sm" c="dimmed">
            {description}
          </Text>
        ) : null}
      </Stack>

      {orderedFields.map((fieldDefinition) => {
        const fieldName = `additionalFields.${fieldDefinition.key}` as const;
        const fieldError = additionalFieldErrors[fieldDefinition.key]?.message;

        if (fieldDefinition.fieldType === ServiceTypeFieldType.MultilineText) {
          return (
            <Controller
              key={fieldDefinition.id}
              name={fieldName}
              control={control}
              render={({ field }) => (
                <Textarea
                  label={fieldDefinition.label}
                  description={fieldDefinition.description ?? undefined}
                  withAsterisk={fieldDefinition.isRequired}
                  value={typeof field.value === 'string' ? field.value : ''}
                  onChange={(event) => field.onChange(event.currentTarget.value)}
                  error={fieldError}
                  disabled={disabled}
                  minRows={3}
                  autosize
                />
              )}
            />
          );
        }

        if (fieldDefinition.fieldType === ServiceTypeFieldType.Select) {
          return (
            <Controller
              key={fieldDefinition.id}
              name={fieldName}
              control={control}
              render={({ field }) => (
                <Select
                  label={fieldDefinition.label}
                  description={fieldDefinition.description ?? undefined}
                  withAsterisk={fieldDefinition.isRequired}
                  data={fieldDefinition.options
                    .slice()
                    .sort((left, right) => left.sortOrder - right.sortOrder || left.id - right.id)
                    .map((option) => ({
                      value: option.value,
                      label: option.label,
                    }))}
                  value={typeof field.value === 'string' ? field.value : null}
                  onChange={(value) => field.onChange(value ?? '')}
                  error={fieldError}
                  disabled={disabled}
                  allowDeselect={!fieldDefinition.isRequired}
                />
              )}
            />
          );
        }

        if (fieldDefinition.fieldType === ServiceTypeFieldType.Checkbox) {
          return (
            <Controller
              key={fieldDefinition.id}
              name={fieldName}
              control={control}
              render={({ field }) => (
                <Checkbox
                  label={fieldDefinition.label}
                  description={fieldDefinition.description ?? undefined}
                  checked={Boolean(field.value)}
                  onChange={(event) => field.onChange(event.currentTarget.checked)}
                  error={fieldError}
                  disabled={disabled}
                />
              )}
            />
          );
        }

        return (
          <Controller
            key={fieldDefinition.id}
            name={fieldName}
            control={control}
            render={({ field }) => (
              <TextInput
                label={fieldDefinition.label}
                description={fieldDefinition.description ?? undefined}
                withAsterisk={fieldDefinition.isRequired}
                value={typeof field.value === 'string' ? field.value : ''}
                onChange={(event) => field.onChange(event.currentTarget.value)}
                error={fieldError}
                disabled={disabled}
                type={fieldDefinition.fieldType === ServiceTypeFieldType.Date ? 'date' : 'text'}
                inputMode={
                  fieldDefinition.fieldType === ServiceTypeFieldType.Number ? 'decimal' : undefined
                }
              />
            )}
          />
        );
      })}
    </Stack>
  );
}
