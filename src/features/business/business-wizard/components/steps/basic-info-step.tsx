import { Stack, TextInput, Textarea, Select, Text, Box, Group, ThemeIcon } from '@mantine/core';
import { useServiceTypes } from 'features/service-types/hooks';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { getServiceTypeColor, getServiceTypeIcon } from 'shared/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { CreateBusinessFormValues } from '../../schema';

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function BasicInfoStep() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CreateBusinessFormValues>();

  const name = watch('name') ?? '';
  const serviceTypeId = watch('serviceTypeId');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue('name', value);
    setValue('slug', toSlug(value));
  };

  const { data: businessTypesData, isLoading } = useServiceTypes();

  const businessTypeOptions = useMemo(
    () =>
      businessTypesData?.map((type) => ({
        value: String(type.id),
        label: type.name,
        iconKey: type.iconKey,
        colorHex: type.colorHex,
      })) ?? [],
    [businessTypesData],
  );

  return (
    <Stack gap="lg">
      <TextInput
        label="Nombre del servicio"
        placeholder="Ej: Peluquería Nico"
        description="Así lo verán tus clientes al reservar un turno."
        {...register('name')}
        onChange={handleNameChange}
        error={errors.name?.message}
      />

      <Select
        label="Tipo de servicio"
        placeholder="Seleccioná un rubro"
        description="Ayuda a categorizar tu negocio."
        data={businessTypeOptions}
        value={serviceTypeId ? String(serviceTypeId) : null}
        disabled={isLoading}
        error={errors.serviceTypeId?.message}
        renderOption={({ option }) => {
          const item = option as (typeof businessTypeOptions)[number];

          const icon = getServiceTypeIcon(item.iconKey);
          const color = getServiceTypeColor(item.colorHex);

          return (
            <Group gap="sm" wrap="nowrap">
              <ThemeIcon
                size="sm"
                radius="xl"
                variant="light"
                style={{
                  color,
                  backgroundColor: `${color}1A`,
                }}
              >
                <FontAwesomeIcon icon={icon} size="xs" />
              </ThemeIcon>

              <Text size="sm">{item.label}</Text>
            </Group>
          );
        }}
        onChange={(val) =>
          setValue('serviceTypeId', val ? Number(val) : undefined!, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
      />

      <Textarea
        label="Descripción"
        placeholder="Contá brevemente en qué consiste tu servicio..."
        description="Opcional. Máximo 500 caracteres."
        autosize
        minRows={3}
        maxRows={6}
        maxLength={500}
        {...register('description')}
        error={errors.description?.message}
      />

      {/* Slug — readonly, generado desde el nombre */}
      <TextInput
        label="Telefono de contacto"
        placeholder="Ej: +54 9 3364 000000"
        description="Opcional. Se mostrara en el booking publico si lo completas."
        {...register('phoneNumber')}
        error={errors.phoneNumber?.message}
      />

      {name.length > 1 && (
        <Box>
          <Text size="xs" c="dimmed" mb={4}>
            URL publica sugerida
          </Text>
          <Box
            px="sm"
            py={8}
            style={{
              borderRadius: 'var(--mantine-radius-md)',
              backgroundColor: 'var(--mantine-color-default-hover)',
              border: '1px solid var(--mantine-color-default-border)',
            }}
          >
            <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }}>
              bookly.app/
              <Text span fw={600} c="brand.6">
                {toSlug(name)}
              </Text>
            </Text>
          </Box>
        </Box>
      )}
    </Stack>
  );
}
