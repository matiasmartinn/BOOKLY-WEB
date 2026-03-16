import { Stack, NumberInput, Text, Group, Box, SimpleGrid } from '@mantine/core';
import { useFormContext, Controller } from 'react-hook-form';
import type { CreateBusinessFormValues } from '../../schema';

const DURATION_PRESETS = [15, 30, 45, 60, 90, 120];

export function ConfigStep() {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateBusinessFormValues>();

  const duration = watch('durationMinutes');

  return (
    <Stack gap="xl">
      {/* Duration */}
      <Stack gap="sm">
        <Stack gap={2}>
          <Text size="sm" fw={500}>
            Duración del turno
          </Text>
          <Text size="xs" c="dimmed">
            ¿Cuánto dura cada turno? Esto define los slots disponibles en tu agenda.
          </Text>
        </Stack>

        {/* Quick presets */}
        <Group gap="xs" wrap="wrap">
          {DURATION_PRESETS.map((min) => (
            <Box
              key={min}
              px="sm"
              py={6}
              onClick={() => setValue('durationMinutes', min, { shouldValidate: true })}
              style={{
                borderRadius: 'var(--mantine-radius-md)',
                border: `1px solid ${
                  duration === min
                    ? 'var(--mantine-color-brand-5)'
                    : 'var(--mantine-color-default-border)'
                }`,
                backgroundColor:
                  duration === min
                    ? 'var(--mantine-color-brand-0)'
                    : 'var(--mantine-color-default)',
                cursor: 'pointer',
                transition: 'all 120ms ease',
                userSelect: 'none',
              }}
            >
              <Text
                size="xs"
                fw={duration === min ? 600 : 400}
                c={duration === min ? 'brand.6' : 'dimmed'}
              >
                {min >= 60
                  ? `${Math.floor(min / 60)}h${min % 60 > 0 ? ` ${min % 60}min` : ''}`
                  : `${min}min`}
              </Text>
            </Box>
          ))}
        </Group>

        {/* Manual input */}
        <Controller
          name="durationMinutes"
          control={control}
          render={({ field }) => (
            <NumberInput
              {...field}
              label="O ingresá manualmente (en minutos)"
              placeholder="Ej: 45"
              min={5}
              max={480}
              step={5}
              suffix=" min"
              w={200}
              error={errors.durationMinutes?.message}
              onChange={(val) => field.onChange(typeof val === 'number' ? val : undefined)}
            />
          )}
        />
      </Stack>

      {/* Price */}
      <Stack gap="sm">
        <Stack gap={2}>
          <Text size="sm" fw={500}>
            Precio por turno
          </Text>
          <Text size="xs" c="dimmed">
            Opcional. Si lo dejás vacío, el turno aparecerá como "a consultar".
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                label="Precio"
                placeholder="Ej: 5000"
                min={0}
                decimalScale={2}
                prefix="$ "
                error={errors.price?.message}
                onChange={(val) => field.onChange(typeof val === 'number' ? val : undefined)}
              />
            )}
          />
        </SimpleGrid>
      </Stack>
    </Stack>
  );
}
