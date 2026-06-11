import { Alert, Button, Select, SimpleGrid, Stack } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { getAppointmentStatusLabel } from 'features/dashboard/utils';
import { useMemo, useState } from 'react';
import { PageCard } from 'shared/layout';
import { FilterSurface, filterFieldStyles } from 'shared/ui/components';
import { formatDateOnly, getCurrentBusinessDateOnly } from 'shared/utils';
import { useBusinessStore } from 'store/use-business-store';

import { AppointmentTable } from '../components/appointment-table';
import { buildAppointmentColumns } from '../defaults';
import {
  AppointmentCreateModal,
  AppointmentEditModal,
  AppointmentRescheduleModal,
  AppointmentCancelModal,
  AppointmentAttendedModal,
  AppointmentNoShowModal,
} from '../components/modals';
import { useAppointmentModals, useAppointmentPermissions, useAppointmentsByDay } from '../hooks';
import {
  getVisibleAppointmentDynamicColumns,
  mapAppointmentListToViewModel,
} from '../mapper/map-appointment-to-viewmodel';

export function AppointmentPageContainer() {
  const selectedService = useBusinessStore((s) => s.selectedService);
  const [selectedDate, setSelectedDate] = useState<string | null>(getCurrentBusinessDateOnly());
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const { canViewAppointments, canCreateAppointments, actionPermissions } =
    useAppointmentPermissions();

  const dayQuery = useMemo(() => {
    if (!selectedService || !selectedDate || !canViewAppointments) {
      return undefined;
    }

    return {
      serviceId: selectedService.id,
      date: selectedDate,
    };
  }, [canViewAppointments, selectedDate, selectedService]);

  const { data = [], isLoading, isFetching, refetch, isError } = useAppointmentsByDay(dayQuery);
  const dynamicColumns = useMemo(
    () => getVisibleAppointmentDynamicColumns(selectedService),
    [selectedService],
  );

  const appointmentData = useMemo(() => {
    const mappedAppointments = mapAppointmentListToViewModel(
      data,
      selectedService?.allowsExtraFields ? selectedService.fieldDefinitions : [],
    );

    if (!selectedStatus) {
      return mappedAppointments;
    }

    return mappedAppointments.filter((appointment) => appointment.status === selectedStatus);
  }, [data, selectedService, selectedStatus]);

  const appointmentColumns = useMemo(
    () => buildAppointmentColumns(dynamicColumns),
    [dynamicColumns],
  );
  const filtersKey = useMemo(
    () => [selectedService?.id ?? '', selectedDate ?? '', selectedStatus ?? ''].join('|'),
    [selectedDate, selectedService?.id, selectedStatus],
  );

  const statusOptions = useMemo(() => {
    const statuses = [...new Set(data.map((appointment) => appointment.status).filter(Boolean))];

    if (selectedStatus && !statuses.includes(selectedStatus)) {
      statuses.push(selectedStatus);
    }

    return statuses
      .map((status) => ({
        value: status,
        label: getAppointmentStatusLabel(status),
      }))
      .sort((a, b) => a.label.localeCompare(b.label, 'es-AR'));
  }, [data, selectedStatus]);

  const totalAppointments = appointmentData.length;
  const dayLabel = selectedDate ? formatDateOnly(selectedDate) : 'sin fecha';

  const refetchAppointments = () => {
    if (canViewAppointments) {
      void refetch();
    }
  };

  const modals = useAppointmentModals({ onMutationSuccess: refetchAppointments });

  return (
    <>
      <Stack gap="md">
        {!selectedService && (
          <Alert color="yellow" variant="light">
            Selecciona un servicio desde el sidebar para operar turnos del dia.
          </Alert>
        )}

        {selectedService && !canViewAppointments && (
          <Alert color="brand" variant="light">
            No cuentas con permiso para ver los turnos de este servicio. Solo se muestran las
            acciones habilitadas para tu perfil.
          </Alert>
        )}

        <FilterSurface
          title="Operacion diaria"
          description={`Mostrando ${totalAppointments} turnos para ${dayLabel}.`}
          actions={
            canCreateAppointments ? (
              <Button onClick={modals.create.open} disabled={!selectedService || !selectedDate}>
                Agregar turno
              </Button>
            ) : null
          }
        >
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            <DatePickerInput
              label="Fecha"
              placeholder="Selecciona un dia"
              value={selectedDate}
              onChange={setSelectedDate}
              valueFormat="DD/MM/YYYY"
              clearable={false}
              disabled={!selectedService}
              styles={{
                ...filterFieldStyles,
                day: {
                  color: 'var(--mantine-color-text)',
                },
                weekday: {
                  color: 'var(--mantine-color-text)',
                },
              }}
            />

            <Select
              label="Estado"
              placeholder="Todos los estados"
              data={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
              clearable
              searchable
              disabled={!selectedService || !canViewAppointments}
              styles={filterFieldStyles}
            />
          </SimpleGrid>
        </FilterSurface>

        <PageCard>
          <AppointmentTable
            appointmentData={appointmentData}
            columns={appointmentColumns}
            isError={isError}
            isLoading={isLoading}
            isFetching={isFetching}
            onRefetch={() => {
              void refetch();
            }}
            onEdit={modals.edit.open}
            onReschedule={modals.reschedule.open}
            onCancel={modals.cancel.open}
            onMarkAsAttended={modals.attended.open}
            onMarkAsNoShow={modals.noShow.open}
            permissions={actionPermissions}
            resetPageKey={filtersKey}
            emptyMessage={
              selectedService && selectedDate
                ? canViewAppointments
                  ? `No tenés turnos para ${formatDateOnly(selectedDate)}. Podés compartir tu link público o crear un turno manual.`
                  : 'No tienes permiso para ver los turnos del servicio seleccionado.'
                : 'Selecciona un servicio para ver los turnos del día.'
            }
          />
        </PageCard>
      </Stack>

      <AppointmentCreateModal
        isOpen={modals.create.opened}
        onClose={modals.create.close}
        onSuccess={modals.create.onSuccess}
        initialDate={selectedDate}
      />

      <AppointmentEditModal
        appointment={modals.selectedAppointment}
        isOpen={modals.edit.opened}
        onClose={modals.edit.close}
        onSuccess={modals.edit.onSuccess}
      />

      <AppointmentRescheduleModal
        appointment={modals.selectedAppointment}
        isOpen={modals.reschedule.opened}
        onClose={modals.reschedule.close}
        onSuccess={modals.reschedule.onSuccess}
      />

      <AppointmentCancelModal
        appointment={modals.selectedAppointment}
        isOpen={modals.cancel.opened}
        onClose={modals.cancel.close}
        onSuccess={modals.cancel.onSuccess}
      />

      <AppointmentAttendedModal
        appointment={modals.selectedAppointment}
        isOpen={modals.attended.opened}
        onClose={modals.attended.close}
        onSuccess={modals.attended.onSuccess}
      />

      <AppointmentNoShowModal
        appointment={modals.selectedAppointment}
        isOpen={modals.noShow.opened}
        onClose={modals.noShow.close}
        onSuccess={modals.noShow.onSuccess}
      />
    </>
  );
}
