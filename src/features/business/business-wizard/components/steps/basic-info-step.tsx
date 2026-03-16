import { Stack, TextInput, Textarea, Select, Text, Box } from '@mantine/core';
import { useFormContext } from 'react-hook-form';
import type { CreateServiceFormValues } from '../schema';

// Tipos de servicio hardcodeados por ahora.
// Cuando tengas un endpoint GET /service-types, reemplazá con un useQuery.
const SERVICE_TYPES = [
  { value: '1', label: 'Peluquería & Barbería' },
  { value: '2', label: 'Manicura & Pedicura' },
  { value: '3', label: 'Centro de Estética' },
  { value: '4', label: 'Profesional de la Salud' },
  { value: '5', label: 'Psicología' },
  { value: '6', label: 'Otro' },
];

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
  } = useFormContext<CreateServiceFormValues>();

  const name = watch('name') ?? '';

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue('name', value);
    setValue('slug', toSlug(value));
  };

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
        data={SERVICE_TYPES}
        error={errors.serviceTypeId?.message}
        onChange={(val) =>
          setValue('serviceTypeId', val ? parseInt(val) : (undefined as unknown as number), {
            shouldValidate: true,
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
      {name.length > 1 && (
        <Box>
          <Text size="xs" c="dimmed" mb={4}>
            URL pública de tu servicio
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
