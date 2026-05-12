import {
  faCheck,
  faClock,
  faLink,
  faStore,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { useFormContext } from 'react-hook-form';

import type { CreateBusinessFormValues } from '../../schema';

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} minutos`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h} hora${h > 1 ? 's' : ''}`;
}

interface SummaryRowProps {
  label: string;
  value: string;
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <Group justify="space-between" align="flex-start" wrap="nowrap" gap="xl">
      <Text size="sm" c="dimmed" style={{ flexShrink: 0 }}>
        {label}
      </Text>
      <Text size="sm" fw={600} ta="right" style={{ overflowWrap: 'anywhere' }}>
        {value}
      </Text>
    </Group>
  );
}

interface SummarySectionProps {
  icon: IconDefinition;
  title: string;
  rows: { label: string; value: string }[];
}

function SummarySection({ icon, title, rows }: SummarySectionProps) {
  return (
    <Stack gap="sm">
      <Group gap="sm">
        <ThemeIcon size={30} radius="md" variant="light" color="brand">
          <FontAwesomeIcon icon={icon} style={{ fontSize: 13 }} />
        </ThemeIcon>
        <Text fw={700}>{title}</Text>
      </Group>

      <Box
        style={{
          borderRadius: 'var(--mantine-radius-md)',
          backgroundColor: 'var(--mantine-color-gray-0)',
          padding: 'var(--mantine-spacing-md)',
        }}
      >
        <Stack gap="xs">
          {rows.map((row) => (
            <SummaryRow key={row.label} label={row.label} value={row.value} />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}

interface ConfirmStepProps {
  serviceTypeName?: string;
}

export function ConfirmStep({ serviceTypeName }: ConfirmStepProps) {
  const { watch } = useFormContext<CreateBusinessFormValues>();
  const values = watch();
  const serviceTypeSummary = values.serviceTypeId ? (serviceTypeName ?? 'Tipo no disponible') : '—';
  const publicUrl = values.slug ? `${window.location.origin}/${values.slug}` : '—';

  return (
    <Stack gap="xl">
      <Box
        p="lg"
        style={{
          borderRadius: 'var(--mantine-radius-lg)',
          background:
            'linear-gradient(135deg, var(--mantine-color-brand-0), var(--mantine-color-gray-0))',
          border: '1px solid var(--app-color-brand-outline)',
        }}
      >
        <Group align="flex-start" gap="md" wrap="nowrap">
          <ThemeIcon size={38} radius="xl" color="brand">
            <FontAwesomeIcon icon={faCheck} />
          </ThemeIcon>

          <Stack gap={4}>
            <Text fw={800} size="lg">
              Todo listo para publicar
            </Text>
            <Text size="sm" c="dimmed">
              Revisá la información final. Podés volver a cualquier paso antes de crear el servicio.
            </Text>
          </Stack>
        </Group>
      </Box>

      <SummarySection
        icon={faStore}
        title="Información básica"
        rows={[
          { label: 'Nombre', value: values.name ?? '—' },
          { label: 'Tipo', value: serviceTypeSummary },
          { label: 'Descripción', value: values.description || 'Sin descripción' },
          { label: 'Teléfono', value: values.phoneNumber || 'Sin teléfono' },
        ]}
      />

      <SummarySection
        icon={faClock}
        title="Configuración"
        rows={[
          {
            label: 'Duración',
            value: values.durationMinutes ? formatDuration(values.durationMinutes) : '—',
          },
          {
            label: 'Precio',
            value:
              values.price != null ? `$ ${values.price.toLocaleString('es-AR')}` : 'A consultar',
          },
        ]}
      />

      <SummarySection
        icon={faLink}
        title="Enlace"
        rows={[{ label: 'URL pública', value: publicUrl }]}
      />
    </Stack>
  );
}
