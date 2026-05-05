import { Alert, Badge, Box, Button, Divider, Group, Stack, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { isApiError } from 'app/api';
import { PATHS } from 'app/router/PATHS';
import {
  useActivateBusiness,
  useBusiness,
  useDeactivateBusiness,
  useDeleteBusiness,
} from 'features/business/hooks';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenericModal } from 'shared/components';
import { PageCard } from 'shared/layout';
import { useAppToast } from 'shared/ui/toast';
import { useAuthStore } from 'store/use-auth-store';
import { useBusinessStore } from 'store/use-business-store';

export function BusinessStatusPageContainer() {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.user);
  const selectedService = useBusinessStore((state) => state.selectedService);
  const selectService = useBusinessStore((state) => state.selectService);
  const refreshServices = useBusinessStore((state) => state.refreshServices);
  const toast = useAppToast();
  const [deactivateModalOpened, deactivateModalHandlers] = useDisclosure(false);
  const [deleteModalOpened, deleteModalHandlers] = useDisclosure(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const { data: serviceData } = useBusiness(selectedService?.id);

  const currentService = serviceData ?? selectedService;

  const ownerId = currentService?.ownerId ?? authUser?.id;
  const activateMutation = useActivateBusiness(currentService?.id ?? 0, ownerId);
  const deactivateMutation = useDeactivateBusiness(currentService?.id ?? 0, ownerId);
  const deleteMutation = useDeleteBusiness(currentService?.id ?? 0, ownerId);

  const isStatusMutating = activateMutation.isPending || deactivateMutation.isPending;
  const isDeletePending = deleteMutation.isPending;
  const deleteConfirmationMatches =
    currentService != null && deleteConfirmation.trim() === currentService.name;

  const syncSelectedService = async () => {
    if (currentService) {
      await selectService(currentService.id);
    }
  };

  const handleDeactivate = async () => {
    if (!currentService) return;

    try {
      await deactivateMutation.mutateAsync();
      await syncSelectedService();
      deactivateModalHandlers.close();
      toast.success('El servicio quedo inactivo.');
    } catch (error) {
      toast.error(getActionErrorMessage(error, 'Ocurrio un error. Intenta nuevamente.'));
    }
  };

  const handleActivate = async () => {
    if (!currentService) return;

    try {
      await activateMutation.mutateAsync();
      await syncSelectedService();
      toast.success('El servicio quedo activo nuevamente.');
    } catch (error) {
      toast.error(getActionErrorMessage(error, 'Ocurrio un error. Intenta nuevamente.'));
    }
  };

  const closeDeleteModal = () => {
    if (isDeletePending) return;

    deleteMutation.reset();
    setDeleteConfirmation('');
    deleteModalHandlers.close();
  };

  const openDeleteModal = () => {
    deleteMutation.reset();
    setDeleteConfirmation('');
    deleteModalHandlers.open();
  };

  const getActionErrorMessage = (error: unknown, fallback: string) =>
    isApiError(error)
      ? error.detail
      : fallback;

  const getDeleteErrorMessage = (error: unknown) =>
    getActionErrorMessage(error, 'No se pudo eliminar el servicio. Intenta nuevamente.');

  const handleDelete = async () => {
    if (!currentService) return;

    try {
      await deleteMutation.mutateAsync();

      if (authUser) {
        await refreshServices(authUser);
      }

      setDeleteConfirmation('');
      deleteModalHandlers.close();
      toast.success('El servicio fue eliminado.');
      navigate(PATHS.dashboard.service, { replace: true });
    } catch (error) {
      toast.error(getDeleteErrorMessage(error));
    }
  };

  return (
    <Stack gap="md">
      {!currentService && (
        <Alert color="yellow" variant="light">
          Selecciona un servicio para revisar su estado operativo.
        </Alert>
      )}

      {currentService && (
        <PageCard>
          <Stack gap="lg">
            <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
              <Stack gap={4}>
                <Text fw={600}>Estado actual</Text>
                <Text size="sm" c="dimmed">
                  Controla si el servicio puede recibir nuevas reservas.
                </Text>
              </Stack>

              <Badge
                color={currentService.isActive ? 'green' : 'yellow'}
                variant="light"
                size="lg"
                radius="sm"
              >
                {currentService.isActive ? 'ACTIVO' : 'INACTIVO'}
              </Badge>
            </Group>

            <Box
              p="md"
              style={{
                borderRadius: 'var(--mantine-radius-lg)',
                backgroundColor: currentService.isActive
                  ? 'rgba(34, 197, 94, 0.08)'
                  : 'rgba(245, 158, 11, 0.1)',
                border: currentService.isActive
                  ? '1px solid rgba(34, 197, 94, 0.22)'
                  : '1px solid rgba(245, 158, 11, 0.24)',
              }}
            >
              <Stack gap={4}>
                <Text fw={600}>
                  {currentService.isActive
                    ? 'El servicio esta disponible.'
                    : 'El servicio esta inactivo.'}
                </Text>
                <Text size="sm" c="dimmed">
                  {currentService.isActive
                    ? 'Los clientes pueden agendar nuevos turnos segun la configuracion vigente.'
                    : 'No se pueden agendar nuevos turnos hasta que vuelvas a activarlo.'}
                </Text>
              </Stack>
            </Box>

            {currentService.isActive ? (
              <Group gap="sm">
                <Button
                  color="red"
                  variant="light"
                  onClick={deactivateModalHandlers.open}
                  disabled={isStatusMutating || isDeletePending}
                >
                  Desactivar servicio
                </Button>
              </Group>
            ) : (
              <Group gap="sm">
                <Button
                  color="green"
                  onClick={() => void handleActivate()}
                  disabled={isStatusMutating || isDeletePending}
                >
                  Reactivar servicio
                </Button>
              </Group>
            )}
          </Stack>
        </PageCard>
      )}

      {currentService && (
        <PageCard>
          <Stack gap="md">
            <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
              <Stack gap={4}>
                <Text fw={700} c="red.7">
                  Eliminar servicio
                </Text>
                <Text size="sm" c="dimmed" maw={720}>
                  Solo puedes eliminar un servicio si no tiene turnos asociados. Si ya existen
                  turnos, desactivalo para conservar el historial.
                </Text>
              </Stack>

              <Button
                color="red"
                variant="filled"
                onClick={openDeleteModal}
                disabled={isStatusMutating || isDeletePending}
              >
                Eliminar servicio
              </Button>
            </Group>

            <Divider />

            <Text size="sm" c="dimmed">
              Esta accion elimina la configuracion propia del servicio, como horarios, excepciones y
              secretarios asignados.
            </Text>
          </Stack>
        </PageCard>
      )}

      <GenericModal
        opened={deactivateModalOpened}
        onClose={deactivateModalHandlers.close}
        title="Desactivar servicio"
        size="md"
        loading={isStatusMutating}
        footer={
          <>
            <Button
              variant="default"
              onClick={deactivateModalHandlers.close}
              disabled={isStatusMutating}
            >
              Cancelar
            </Button>
            <Button
              color="red"
              onClick={() => {
                void handleDeactivate();
              }}
              loading={isStatusMutating}
            >
              Confirmar deshabilitacion
            </Button>
          </>
        }
      >
        <Stack gap="sm">
          <Alert color="red" variant="light">
            Vas a deshabilitar el servicio, impidiendo agendar turnos sobre el mismo.
          </Alert>

          <Text size="sm" c="dimmed">
            Luego podras reactivarlo desde esta misma pantalla.
          </Text>
        </Stack>
      </GenericModal>

      <GenericModal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Eliminar servicio"
        size="md"
        loading={isDeletePending}
        footer={
          <>
            <Button variant="default" onClick={closeDeleteModal} disabled={isDeletePending}>
              Cancelar
            </Button>
            <Button
              color="red"
              onClick={() => {
                void handleDelete();
              }}
              loading={isDeletePending}
              disabled={!deleteConfirmationMatches}
            >
              Eliminar definitivamente
            </Button>
          </>
        }
      >
        <Stack gap="sm">
          <Text size="sm">
            Esta accion no se puede deshacer. Se eliminara el servicio y su configuracion propia.
          </Text>

          <Text size="sm" c="dimmed">
            Si existen turnos asociados, el sistema bloqueara la eliminacion para conservar el
            historial.
          </Text>

          {currentService ? (
            <TextInput
              label={`Escribe "${currentService.name}" para confirmar`}
              value={deleteConfirmation}
              onChange={(event) => setDeleteConfirmation(event.currentTarget.value)}
              disabled={isDeletePending}
            />
          ) : null}

          {deleteMutation.isError && deleteMutation.error ? (
            <Alert color="red" variant="light">
              {getDeleteErrorMessage(deleteMutation.error)}
            </Alert>
          ) : null}
        </Stack>
      </GenericModal>
    </Stack>
  );
}
