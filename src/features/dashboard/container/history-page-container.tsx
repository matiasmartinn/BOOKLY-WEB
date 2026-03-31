import { useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDebouncedValue } from '@mantine/hooks';
import { useSearchAppointments } from 'features/appoiments/hooks';
import { useOwnerBusinesses } from 'features/business/hooks';
import { useOwnerSecretaries } from 'features/users/hooks';
import { PageCard, PageShell } from 'shared/layout';
import { getCurrentBusinessDateOnly } from 'shared/utils';
import { useAuthStore } from 'store/use-auth-store';
import { HistoryTable } from '../components';
import { appointmentStatusIncludes, getAppointmentStatusLabel } from '../utils';
import type { HistoryAppointmentViewModel } from '../viewmodel/history-appointment-view-model';

interface CompactHistoryStatProps {
  label: string;
  value: string;
}

function CompactHistoryStat({ label, value }: CompactHistoryStatProps) {
  return (
    <Paper
      withBorder
      radius="md"
      px="sm"
      py={8}
      style={{
        flex: '1 1 160px',
      }}
    >
      <Group justify="space-between" align="baseline" gap="xs" wrap="nowrap">
        <Text size="lg" fw={700}>
          {value}
        </Text>
        <Text size="xs" fw={700} c="dimmed" tt="uppercase" style={{ letterSpacing: '0.05em' }}>
          {label}
        </Text>
      </Group>
    </Paper>
  );
}

export function HistoryPageContainer() {
  const authUser = useAuthStore((s) => s.user);
  const todayDate = useMemo(() => getCurrentBusinessDateOnly(), []);

  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(todayDate);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedSecretaryId, setSelectedSecretaryId] = useState<string | null>(null);
  const [clientSearch, setClientSearch] = useState('');

  const [debouncedClientSearch] = useDebouncedValue(clientSearch, 300);

  const { data: services = [] } = useOwnerBusinesses(authUser?.id);
  const { data: secretaries = [] } = useOwnerSecretaries(authUser?.id);

  const hasInvalidRange = Boolean(fromDate && toDate && fromDate > toDate);

  const searchQuery = useMemo(() => {
    if (!authUser || hasInvalidRange) {
      return undefined;
    }

    return {
      ownerId: authUser.id,
      serviceId: selectedServiceId ? Number(selectedServiceId) : undefined,
      from: fromDate ?? undefined,
      to: toDate ?? undefined,
      status: selectedStatus ?? undefined,
      clientSearch: debouncedClientSearch.trim() || undefined,
    };
  }, [
    authUser,
    debouncedClientSearch,
    fromDate,
    hasInvalidRange,
    selectedServiceId,
    selectedStatus,
    toDate,
  ]);

  const {
    data: appointments = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useSearchAppointments(searchQuery);

  const secretaryNameById = useMemo(
    () =>
      new Map(
        secretaries.map((secretary) => [
          secretary.id,
          secretary.fullName || `${secretary.firstName} ${secretary.lastName}`,
        ]),
      ),
    [secretaries],
  );

  const historyRows = useMemo<HistoryAppointmentViewModel[]>(() => {
    const mapped = appointments.map((appointment) => ({
      id: appointment.id,
      serviceId: appointment.serviceId,
      serviceName: appointment.serviceName,
      assignedSecretaryId: appointment.assignedSecretaryId ?? null,
      secretaryName:
        appointment.assignedSecretaryId != null
          ? (secretaryNameById.get(appointment.assignedSecretaryId) ?? 'Secretario/a asignado')
          : 'Sin asignar',
      clientName: appointment.clientName,
      clientPhone: appointment.clientPhone,
      clientEmail: appointment.clientEmail,
      startDateTime: appointment.startDateTime,
      endDateTime: appointment.endDateTime,
      createdOn: appointment.createdOn,
      status: appointment.status,
      detail: appointment.cancelReason || appointment.clientNotes || 'Sin observaciones',
    }));

    if (!selectedSecretaryId) {
      return mapped;
    }

    return mapped.filter(
      (appointment) => String(appointment.assignedSecretaryId ?? '') === selectedSecretaryId,
    );
  }, [appointments, secretaryNameById, selectedSecretaryId]);

  const serviceOptions = useMemo(
    () =>
      services
        .map((service) => ({
          value: String(service.id),
          label: service.name,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, 'es-AR')),
    [services],
  );

  const secretaryOptions = useMemo(
    () =>
      secretaries
        .map((secretary) => ({
          value: String(secretary.id),
          label: secretary.fullName,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, 'es-AR')),
    [secretaries],
  );

  const statusOptions = useMemo(() => {
    const entries = new Map<string, string>();

    appointments.forEach((appointment) => {
      if (appointment.status) {
        entries.set(appointment.status, getAppointmentStatusLabel(appointment.status));
      }
    });

    if (selectedStatus && !entries.has(selectedStatus)) {
      entries.set(selectedStatus, getAppointmentStatusLabel(selectedStatus));
    }

    return [...entries.entries()]
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label, 'es-AR'));
  }, [appointments, selectedStatus]);

  const totalResults = historyRows.length;
  const servicesInvolved = new Set(historyRows.map((item) => item.serviceId)).size;
  const cancellations = historyRows.filter((item) =>
    appointmentStatusIncludes(item.status, 'CANCEL'),
  ).length;
  const noShow = historyRows.filter((item) =>
    appointmentStatusIncludes(item.status, 'NO_SHOW', 'NOSHOW'),
  ).length;

  const resetFilters = () => {
    setFromDate(null);
    setToDate(todayDate);
    setSelectedStatus(null);
    setSelectedServiceId(null);
    setSelectedSecretaryId(null);
    setClientSearch('');
  };

  return (
    <PageShell
      title="Historico"
      description="Consulta Historica de turnos del negocio con filtros."
    >
      <Stack gap="md">
        {!authUser && (
          <Alert color="red" variant="light">
            No se pudo identificar la cuenta para consultar el historico.
          </Alert>
        )}

        {authUser && (
          <Stack gap="xs">
            <Group gap="xs" wrap="wrap">
              <CompactHistoryStat
                label="Registros"
                value={isLoading ? '...' : String(totalResults)}
              />
              <CompactHistoryStat
                label="Cancelado"
                value={isLoading ? '...' : String(cancellations)}
              />
              <CompactHistoryStat label="No asistio" value={isLoading ? '...' : String(noShow)} />
              <CompactHistoryStat
                label="Servicios"
                value={isLoading ? '...' : String(servicesInvolved)}
              />
            </Group>
          </Stack>
        )}

        <PageCard>
          <Stack gap="md">
            <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
              <Stack gap={4}>
                <Text fw={600}>Filtros de consulta</Text>
              </Stack>

              <Button variant="default" onClick={resetFilters}>
                Limpiar filtros
              </Button>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
              <DatePickerInput
                label="Desde"
                placeholder="Fecha inicial"
                value={fromDate}
                onChange={setFromDate}
                valueFormat="DD/MM/YYYY"
                clearable
              />

              <DatePickerInput
                label="Hasta"
                placeholder="Fecha final"
                value={toDate}
                onChange={setToDate}
                valueFormat="DD/MM/YYYY"
                clearable
              />

              <Select
                label="Estado"
                placeholder="Todos los estados"
                data={statusOptions}
                value={selectedStatus}
                onChange={setSelectedStatus}
                clearable
                searchable
              />

              <Select
                label="Servicio"
                placeholder="Todos los servicios"
                data={serviceOptions}
                value={selectedServiceId}
                onChange={setSelectedServiceId}
                clearable
                searchable
              />

              <Select
                label="Secretario/a"
                placeholder="Todo el equipo"
                data={secretaryOptions}
                value={selectedSecretaryId}
                onChange={setSelectedSecretaryId}
                clearable
                searchable
              />

              <TextInput
                label="Cliente"
                placeholder="Buscar por nombre, telefono o email"
                value={clientSearch}
                onChange={(event) => setClientSearch(event.currentTarget.value)}
              />
            </SimpleGrid>
          </Stack>
        </PageCard>

        <PageCard>
          <HistoryTable
            data={historyRows}
            loading={isLoading}
            fetching={isFetching}
            isError={isError}
            onRefetch={refetch}
          />
        </PageCard>
      </Stack>
    </PageShell>
  );
}
