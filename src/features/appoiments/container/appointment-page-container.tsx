import { Alert, Button, Select, SimpleGrid, Stack } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { buildServicePermissions } from 'app/layouts/dashboard-navigation';
import { getAppointmentStatusLabel } from 'features/dashboard/utils';
import { useMemo, useState } from 'react';
import { PageCard } from 'shared/layout';
import { FilterSurface, filterFieldStyles } from 'shared/ui/components';
import { useAppToast } from 'shared/ui/toast';
import { formatDateOnly, getCurrentBusinessDateOnly } from 'shared/utils';
import { useAuthStore } from 'store/use-auth-store';
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
import { useAppointmentsByDay } from '../hooks';
import {
  getVisibleAppointmentDynamicColumns,
  mapAppointmentListToViewModel,
} from '../mapper/map-appointment-to-viewmodel';
import type { AppointmentViewModel } from '../viewmodel';

export function AppointmentPageContainer() {
  const authUser = useAuthStore((s) => s.user);
  const selectedService = useBusinessStore((s) => s.selectedService);
  const [selectedDate, setSelectedDate] = useState<string | null>(getCurrentBusinessDateOnly());
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const servicePermissions = useMemo(
    () => buildServicePermissions(authUser, selectedService),
    [authUser, selectedService],
  );
  const canViewAppointments = servicePermissions.viewAppointments;
  const canCreateAppointments = servicePermissions.createAppointments;
  const actionPermissions = useMemo(
    () => ({
      canEdit: servicePermissions.editAppointments,
      canReschedule: servicePermissions.rescheduleAppointments,
      canCancel: servicePermissions.cancelAppointments,
      canMarkAttendance: servicePermissions.markAttendance,
    }),
    [servicePermissions],
  );

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

  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentViewModel | null>(null);
  const toast = useAppToast();

  const [createOpened, createHandlers] = useDisclosure(false);
  const [editOpened, editHandlers] = useDisclosure(false);
  const [rescheduleOpened, rescheduleHandlers] = useDisclosure(false);
  const [cancelOpened, cancelHandlers] = useDisclosure(false);
  const [attendedOpened, attendedHandlers] = useDisclosure(false);
  const [noShowOpened, noShowHandlers] = useDisclosure(false);

  const clearSelection = () => setSelectedAppointment(null);
  const refetchAppointments = () => {
    if (canViewAppointments) {
      void refetch();
    }
  };

  const handleCreateSuccess = () => {
    createHandlers.close();
    refetchAppointments();
    toast.success('Turno creado correctamente.');
  };

  const handleEdit = (row: AppointmentViewModel) => {
    setSelectedAppointment(row);
    editHandlers.open();
  };

  const handleReschedule = (row: AppointmentViewModel) => {
    setSelectedAppointment(row);
    rescheduleHandlers.open();
  };

  const handleCancel = (row: AppointmentViewModel) => {
    setSelectedAppointment(row);
    cancelHandlers.open();
  };

  const handleAttended = (row: AppointmentViewModel) => {
    setSelectedAppointment(row);
    attendedHandlers.open();
  };

  const handleNoShow = (row: AppointmentViewModel) => {
    setSelectedAppointment(row);
    noShowHandlers.open();
  };

  const handleEditSuccess = () => {
    editHandlers.close();
    clearSelection();
    refetchAppointments();
    toast.success('Turno actualizado correctamente.');
  };

  const handleRescheduleSuccess = () => {
    rescheduleHandlers.close();
    clearSelection();
    refetchAppointments();
    toast.success('Turno reprogramado correctamente.');
  };

  const handleCancelSuccess = () => {
    cancelHandlers.close();
    clearSelection();
    refetchAppointments();
    toast.success('Turno cancelado correctamente.');
  };

  const handleAttendedSuccess = () => {
    attendedHandlers.close();
    clearSelection();
    refetchAppointments();
    toast.success('Turno marcado como asistido.');
  };

  const handleNoShowSuccess = () => {
    noShowHandlers.close();
    clearSelection();
    refetchAppointments();
    toast.success('Turno marcado como no asistido.');
  };

  const handleCloseEdit = () => {
    editHandlers.close();
    clearSelection();
  };

  const handleCloseReschedule = () => {
    rescheduleHandlers.close();
    clearSelection();
  };

  const handleCloseCancel = () => {
    cancelHandlers.close();
    clearSelection();
  };

  const handleCloseAttended = () => {
    attendedHandlers.close();
    clearSelection();
  };

  const handleCloseNoShow = () => {
    noShowHandlers.close();
    clearSelection();
  };

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
              <Button onClick={createHandlers.open} disabled={!selectedService || !selectedDate}>
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
            onEdit={handleEdit}
            onReschedule={handleReschedule}
            onCancel={handleCancel}
            onMarkAsAttended={handleAttended}
            onMarkAsNoShow={handleNoShow}
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
        isOpen={createOpened}
        onClose={createHandlers.close}
        onSuccess={handleCreateSuccess}
        initialDate={selectedDate}
      />

      <AppointmentEditModal
        appointment={selectedAppointment}
        isOpen={editOpened}
        onClose={handleCloseEdit}
        onSuccess={handleEditSuccess}
      />

      <AppointmentRescheduleModal
        appointment={selectedAppointment}
        isOpen={rescheduleOpened}
        onClose={handleCloseReschedule}
        onSuccess={handleRescheduleSuccess}
      />

      <AppointmentCancelModal
        appointment={selectedAppointment}
        isOpen={cancelOpened}
        onClose={handleCloseCancel}
        onSuccess={handleCancelSuccess}
      />

      <AppointmentAttendedModal
        appointment={selectedAppointment}
        isOpen={attendedOpened}
        onClose={handleCloseAttended}
        onSuccess={handleAttendedSuccess}
      />

      <AppointmentNoShowModal
        appointment={selectedAppointment}
        isOpen={noShowOpened}
        onClose={handleCloseNoShow}
        onSuccess={handleNoShowSuccess}
      />
    </>
  );
}
