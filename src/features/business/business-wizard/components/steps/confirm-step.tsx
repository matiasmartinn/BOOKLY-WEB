import { Stack, Text, Group, Box, ThemeIcon, Divider } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore, faClock } from '@fortawesome/free-solid-svg-icons';
import { useFormContext } from 'react-hook-form';
import type { CreateServiceFormValues } from '../schema';

const SERVICE_TYPE_LABELS: Record<number, string> = {
  1: 'Peluquería & Barbería',
  2: 'Manicura & Pedicura',
  3: 'Centro de Estética',
  4: 'Profesional de la Salud',
  5: 'Psicología',
  6: 'Otro',
};

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
    <Group justify="space-between" wrap="nowrap" gap={16}>
      <Text size="sm" c="dimmed" style={{ flexShrink: 0 }}>
        {label}
      </Text>
      <Text size="sm" fw={500} ta="right">
        {value}
      </Text>
    </Group>
  );
}

interface SummaryCardProps {
  icon: typeof faStore;
  title: string;
  rows: { label: string; value: string }[];
}

function SummaryCard({ icon, title, rows }: SummaryCardProps) {
  return (
    <Box
      p="lg"
      style={{
        borderRadius: 'var(--mantine-radius-lg)',
        border: '1px solid var(--mantine-color-default-border)',
        backgroundColor: 'var(--mantine-color-default)',
      }}
    >
      <Group gap={8} mb="md">
        <ThemeIcon size={28} radius="md" variant="light" color="brand">
          <FontAwesomeIcon icon={icon} style={{ fontSize: 12 }} />
        </ThemeIcon>
        <Text size="sm" fw={600}>
          {title}
        </Text>
      </Group>
      <Divider mb="md" />
      <Stack gap={10}>
        {rows.map((row) => (
          <SummaryRow key={row.label} label={row.label} value={row.value} />
        ))}
      </Stack>
    </Box>
  );
}

export function ConfirmStep() {
  const { watch } = useFormContext<CreateServiceFormValues>();
  const values = watch();

  return (
    <Stack gap="lg">
      <Text size="sm" c="dimmed">
        Revisá los datos antes de publicar. Podés volver a cualquier paso para editarlos.
      </Text>

      <SummaryCard
        icon={faStore}
        title="Información básica"
        rows={[
          { label: 'Nombre', value: values.name ?? '—' },
          {
            label: 'Tipo',
            value: values.serviceTypeId ? (SERVICE_TYPE_LABELS[values.serviceTypeId] ?? '—') : '—',
          },
          { label: 'Descripción', value: values.description || 'Sin descripción' },
          { label: 'URL', value: values.slug ? `bookly.app/${values.slug}` : '—' },
        ]}
      />

      <SummaryCard
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
    </Stack>
  );
}
