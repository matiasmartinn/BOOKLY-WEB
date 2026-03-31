import { useState } from 'react';
import { Alert, Button, Group, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { isApiError } from 'app/api';
import { GenericModal } from 'shared/components';
import { PageCard, PageShell } from 'shared/layout';
import { useBusinessStore } from 'store/use-buisness-store';
import { UnavailabilitiesForm, UnavailabilityTable } from './components';
import { useRemoveUnavailability } from './hooks';
import type { UnavailabilityViewModel } from './viewmodel';

export function UnavailabilitiesPage() {
  const selectedService = useBusinessStore((s) => s.selectedService);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedUnavailability, setSelectedUnavailability] =
    useState<UnavailabilityViewModel | null>(null);

  const [createOpened, createHandlers] = useDisclosure(false);
  const [deleteOpened, deleteHandlers] = useDisclosure(false);

  const removeMutation = useRemoveUnavailability(selectedUnavailability?.id ?? 0);

  const handleOpenCreate = () => {
    setSuccessMessage(null);
    createHandlers.open();
  };

  const handleCreateSuccess = () => {
    createHandlers.close();
    setSuccessMessage('Excepcion agregada correctamente.');
  };

  const handleOpenDelete = (row: UnavailabilityViewModel) => {
    setSuccessMessage(null);
    setSelectedUnavailability(row);
    removeMutation.reset();
    deleteHandlers.open();
  };

  const handleCloseDelete = () => {
    removeMutation.reset();
    deleteHandlers.close();
    setSelectedUnavailability(null);
  };

  const handleDelete = () => {
    if (!selectedUnavailability) {
      return;
    }

    removeMutation.mutate(undefined, {
      onSuccess: () => {
        handleCloseDelete();
        setSuccessMessage('Excepcion eliminada correctamente.');
      },
    });
  };

  return (
    <>
      <PageShell
        title="Excepciones"
        description="Bloqueos, vacaciones e indisponibilidades que modifican la operacion base del servicio."
        actions={
          <Button onClick={handleOpenCreate} disabled={!selectedService}>
            Agregar excepcion
          </Button>
        }
      >
        <Stack gap="md">
          {!selectedService && (
            <Alert color="yellow" variant="light">
              Selecciona un servicio desde el sidebar para cargar o eliminar excepciones.
            </Alert>
          )}

          {successMessage && (
            <Alert color="green" variant="light">
              {successMessage}
            </Alert>
          )}

          <PageCard>
            <UnavailabilityTable onDelete={handleOpenDelete} />
          </PageCard>
        </Stack>
      </PageShell>

      <GenericModal
        opened={createOpened}
        onClose={createHandlers.close}
        title="Agregar excepcion"
        size="lg"
      >
        {createOpened ? (
          <UnavailabilitiesForm
            onCancel={createHandlers.close}
            onSuccess={handleCreateSuccess}
          />
        ) : null}
      </GenericModal>

      <GenericModal
        opened={deleteOpened}
        onClose={handleCloseDelete}
        title="Eliminar excepcion"
        size="sm"
        loading={removeMutation.isPending}
      >
        {selectedUnavailability ? (
          <Stack gap="lg">
            <Stack gap={4}>
              <Text fw={600}>Confirma la eliminacion</Text>
              <Text size="sm" c="dimmed">
                Se eliminara la excepcion configurada para {selectedUnavailability.dateLabel}.
              </Text>
              <Text size="sm" c="dimmed">
                Horario: {selectedUnavailability.timeLabel}
              </Text>
            </Stack>

            {removeMutation.isError && removeMutation.error && (
              <Alert color="red" variant="light">
                {isApiError(removeMutation.error)
                  ? removeMutation.error.detail
                  : 'No se pudo eliminar la excepcion.'}
              </Alert>
            )}

            <Group justify="flex-end">
              <Button
                type="button"
                variant="default"
                onClick={handleCloseDelete}
                disabled={removeMutation.isPending}
              >
                Cancelar
              </Button>
              <Button color="red" onClick={handleDelete} loading={removeMutation.isPending}>
                Eliminar
              </Button>
            </Group>
          </Stack>
        ) : null}
      </GenericModal>
    </>
  );
}
