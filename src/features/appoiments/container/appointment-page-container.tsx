import { useMemo, useState } from 'react';
import { Alert, Button, Group, Select, SimpleGrid, Stack, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { PageCard, PageShell } from 'shared/layout';
import { useAppToast } from 'shared/ui/toast';
import { formatDateOnly, getCurrentBusinessDateOnly } from 'shared/utils';
import { useBusinessStore } from 'store/use-buisness-store';
import { AppointmentTable } from '../components/appointment-table';
import {
  AppointmentCreateModal,
  AppointmentEditModal,
  AppointmentRescheduleModal,
  AppointmentCancelModal,
  AppointmentAttendedModal,
  AppointmentNoShowModal,
} from '../components/modals';
import { useAppointmentsByDay } from '../hooks';
import { mapAppointmentListToViewModel } from '../mapper/map-appointment-to-viewmodel';
import type { AppointmentViewModel } from '../viewmodel';
import { getAppointmentStatusLabel } from 'features/dashboard/utils';

export function AppointmentPageContainer() {
  const selectedService = useBusinessStore((s) => s.selectedService);
  const [selectedDate, setSelectedDate] = useState<string | null>(getCurrentBusinessDateOnly());
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const dayQuery = useMemo(() => {
    if (!selectedService || !selectedDate) {
      return undefined;
    }

    return {
      serviceId: selectedService.id,
      date: selectedDate,
    };
  }, [selectedDate, selectedService]);

  const { data = [], isLoading, isFetching, refetch, isError } = useAppointmentsByDay(dayQuery);

  const appointmentData = useMemo(() => {
    const mappedAppointments = mapAppointmentListToViewModel(data);

    if (!selectedStatus) {
      return mappedAppointments;
    }

    return mappedAppointments.filter((appointment) => appointment.status === selectedStatus);
  }, [data, selectedStatus]);

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

  const handleCreateSuccess = () => {
    createHandlers.close();
    void refetch();
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
    void refetch();
    toast.success('Turno actualizado correctamente.');
  };

  const handleRescheduleSuccess = () => {
    rescheduleHandlers.close();
    clearSelection();
    void refetch();
    toast.success('Turno reprogramado correctamente.');
  };

  const handleCancelSuccess = () => {
    cancelHandlers.close();
    clearSelection();
    void refetch();
    toast.success('Turno cancelado correctamente.');
  };

  const handleAttendedSuccess = () => {
    attendedHandlers.close();
    clearSelection();
    void refetch();
    toast.success('Turno marcado como asistido.');
  };

  const handleNoShowSuccess = () => {
    noShowHandlers.close();
    clearSelection();
    void refetch();
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
      <PageShell
        title="Turnos"
        description="Operacion diaria del servicio seleccionado, centrada en el dia y en acciones rapidas sobre cada turno."
        actions={
          <Button
            onClick={() => {
              createHandlers.open();
            }}
            disabled={!selectedService || !selectedDate}
          >
            Agregar turno
          </Button>
        }
      >
        <Stack gap="md">
          {!selectedService && (
            <Alert color="yellow" variant="light">
              Selecciona un servicio desde el sidebar para operar turnos del dia.
            </Alert>
          )}

          <PageCard>
            <Stack gap="md">
              <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
                <Stack gap={4}>
                  <Text fw={600}>Operacion diaria</Text>
                  <Text size="sm" c="dimmed">
                    Mostrando {totalAppointments} turnos para {dayLabel}.
                  </Text>
                </Stack>
              </Group>

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
                  disabled={!selectedService}
                />
              </SimpleGrid>
            </Stack>
          </PageCard>

          <PageCard>
            <AppointmentTable
              appointmentData={appointmentData}
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
              emptyMessage={
                selectedService && selectedDate
                  ? `No hay turnos para ${formatDateOnly(selectedDate)}.`
                  : 'Selecciona un servicio para ver los turnos del dia.'
              }
            />
          </PageCard>
        </Stack>
      </PageShell>

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
