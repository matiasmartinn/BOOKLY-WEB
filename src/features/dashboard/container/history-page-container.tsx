import { Button, Group, Paper, Select, SimpleGrid, Stack, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useSearchAppointments } from 'features/appoiments/hooks';
import { useOwnerBusinesses } from 'features/business/hooks';
import { useOwnerSecretaries } from 'features/users/hooks';
import { useMemo, useState } from 'react';
import { compareDateOnly, getCurrentBusinessDateOnly } from 'shared/utils';
import { useAuthStore } from 'store/use-auth-store';

import { CompactHistoryStat, HistoryTable } from '../components';
import { appointmentStatusIncludes, getAppointmentStatusLabel } from '../utils';
import type { HistoryAppointmentViewModel } from '../viewmodel/history-appointment-view-model';

const compactFieldStyles = {
  label: {
    color: 'var(--mantine-color-dimmed)',
    fontSize: 'var(--mantine-font-size-xs)',
    marginBottom: 4,
  },
} as const;

const actorRoleLabelByRole: Record<string, string> = {
  Admin: 'Administrador/a',
  Owner: 'Owner',
  Secretary: 'Secretario/a',
};

const resolveCreatedByLabel = (
  userDisplayName?: string | null,
  userRole?: string | null,
  userId?: number | null,
) => {
  if (userId == null) {
    return 'Cliente';
  }

  const roleLabel = userRole ? (actorRoleLabelByRole[userRole] ?? userRole) : null;

  if (userDisplayName && roleLabel) {
    return `${userDisplayName} (${roleLabel})`;
  }

  if (userDisplayName) {
    return userDisplayName;
  }

  if (roleLabel) {
    return roleLabel;
  }

  return `Usuario #${userId}`;
};

export function HistoryPageContainer() {
  const authUser = useAuthStore((s) => s.user);
  const todayDate = useMemo(() => getCurrentBusinessDateOnly(), []);

  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(todayDate);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedSecretaryId, setSelectedSecretaryId] = useState<string | null>(null);

  const { data: services = [] } = useOwnerBusinesses(authUser?.id);
  const { data: secretaries = [] } = useOwnerSecretaries(authUser?.id);

  const hasInvalidRange = Boolean(fromDate && toDate && compareDateOnly(fromDate, toDate) > 0);
  const filtersKey = useMemo(
    () =>
      [
        fromDate ?? '',
        toDate ?? '',
        selectedStatus ?? '',
        selectedServiceId ?? '',
        selectedSecretaryId ?? '',
      ].join('|'),
    [fromDate, selectedSecretaryId, selectedServiceId, selectedStatus, toDate],
  );

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
    };
  }, [authUser, fromDate, hasInvalidRange, selectedServiceId, selectedStatus, toDate]);

  const {
    data: appointments = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useSearchAppointments(searchQuery);

  const historyRows = useMemo<HistoryAppointmentViewModel[]>(() => {
    const mapped = appointments.map((appointment) => ({
      id: appointment.id,
      serviceId: appointment.serviceId,
      serviceName: appointment.serviceName,
      assignedSecretaryId: appointment.assignedSecretaryId ?? null,
      createdByUserId: appointment.createdByUserId ?? null,
      createdByUserDisplayName: appointment.createdByUserDisplayName ?? null,
      createdByUserRole: appointment.createdByUserRole ?? null,
      createdByLabel: resolveCreatedByLabel(
        appointment.createdByUserDisplayName,
        appointment.createdByUserRole,
        appointment.createdByUserId,
      ),
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
  }, [appointments, selectedSecretaryId]);

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
  const attended = historyRows.filter((item) =>
    appointmentStatusIncludes(item.status, 'ATTEND', 'CONFIRM'),
  ).length;
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
  };

  return (
    <Stack gap="sm">
      {authUser && (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="sm">
          <CompactHistoryStat
            label="Registros"
            value={isLoading ? '...' : String(totalResults)}
            accentColor="var(--mantine-color-gray-4)"
            backgroundColor="var(--mantine-color-gray-0)"
          />
          <CompactHistoryStat
            label="Asistieron"
            value={isLoading ? '...' : String(attended)}
            accentColor="var(--mantine-color-green-5)"
            backgroundColor="var(--mantine-color-green-0)"
          />
          <CompactHistoryStat
            label="Cancelado"
            value={isLoading ? '...' : String(cancellations)}
            accentColor="var(--mantine-color-orange-5)"
            backgroundColor="var(--mantine-color-orange-0)"
          />
          <CompactHistoryStat
            label="No asistio"
            value={isLoading ? '...' : String(noShow)}
            accentColor="var(--mantine-color-red-5)"
            backgroundColor="var(--mantine-color-red-0)"
          />
        </SimpleGrid>
      )}

      <Paper
        radius="lg"
        p="sm"
        withBorder
        style={{
          background: 'white',
        }}
      >
        <Stack gap="xs">
          <Group justify="space-between" align="center" wrap="wrap" gap="xs">
            <Text size="sm" fw={600}>
              Filtros
            </Text>

            <Button variant="default" size="xs" onClick={resetFilters}>
              Limpiar filtros
            </Button>
          </Group>

          <SimpleGrid
            cols={{ base: 1, md: 2, lg: secretaryOptions.length > 0 ? 5 : 4 }}
            spacing="xs"
          >
            <DatePickerInput
              label="Desde"
              placeholder="Fecha inicial"
              value={fromDate}
              onChange={setFromDate}
              valueFormat="DD/MM/YYYY"
              clearable
              size="sm"
              styles={compactFieldStyles}
            />

            <DatePickerInput
              label="Hasta"
              placeholder="Fecha final"
              value={toDate}
              onChange={setToDate}
              valueFormat="DD/MM/YYYY"
              clearable
              size="sm"
              styles={compactFieldStyles}
            />

            <Select
              label="Servicio"
              placeholder="Todos los servicios"
              data={serviceOptions}
              value={selectedServiceId}
              onChange={setSelectedServiceId}
              clearable
              searchable
              size="sm"
              styles={compactFieldStyles}
            />

            <Select
              label="Estado"
              placeholder="Todos los estados"
              data={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
              clearable
              searchable
              size="sm"
              styles={compactFieldStyles}
            />

            {secretaryOptions.length > 0 && (
              <Select
                label="Secretario/a"
                placeholder="Todo el equipo"
                data={secretaryOptions}
                value={selectedSecretaryId}
                onChange={setSelectedSecretaryId}
                clearable
                searchable
                size="sm"
                styles={compactFieldStyles}
              />
            )}
          </SimpleGrid>
        </Stack>
      </Paper>

      <Paper
        radius="lg"
        p="sm"
        withBorder
        style={{
          background: 'white',
        }}
      >
        <HistoryTable
          data={historyRows}
          loading={isLoading}
          fetching={isFetching}
          isError={isError}
          onRefetch={refetch}
          filtersKey={filtersKey}
        />
      </Paper>
    </Stack>
  );
}
