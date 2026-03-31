import { useEffect, useState } from 'react';
import { Alert, Button, Checkbox, Group, Stack, Text } from '@mantine/core';
import { isApiError } from 'app/api';
import { useSetBusinessSecretaries } from 'features/business/hooks';
import type { BusinessDto, SecretaryDto } from 'shared/models';
import { useBusinessStore } from 'store/use-buisness-store';

interface SecretaryPermissionsFormProps {
  ownerId: number;
  secretary: SecretaryDto;
  selectedService: BusinessDto;
  onCancel: () => void;
  onSuccess: () => void;
  onServiceUpdated: (service: BusinessDto) => void;
}

export function SecretaryPermissionsForm({
  ownerId,
  secretary,
  selectedService,
  onCancel,
  onSuccess,
  onServiceUpdated,
}: SecretaryPermissionsFormProps) {
  const updateService = useBusinessStore((s) => s.updateService);
  const [hasAccess, setHasAccess] = useState(secretary.serviceIds.includes(selectedService.id));
  const { mutateAsync, isPending, isError, error } = useSetBusinessSecretaries(
    selectedService.id,
    ownerId,
  );

  useEffect(() => {
    setHasAccess(secretary.serviceIds.includes(selectedService.id));
  }, [secretary, selectedService.id]);

  const handleSubmit = async () => {
    const currentIds = selectedService.secretaryIds.filter((id): id is number => id != null);
    const nextIds = hasAccess
      ? Array.from(new Set([...currentIds, secretary.id]))
      : currentIds.filter((id) => id !== secretary.id);

    try {
      const updatedService = await mutateAsync({ secretaryIds: nextIds });
      updateService(updatedService);
      onServiceUpdated(updatedService);
      onSuccess();
    } catch {
      // El error se muestra con el estado del hook
    }
  };

  return (
    <Stack gap="lg">
      <Stack gap={4}>
        <Text fw={600}>Permisos</Text>
        <Text size="sm" c="dimmed">
          Hoy esta accion gestiona el acceso operativo del secretario/a al servicio seleccionado.
          Los permisos granulares podran ampliarse cuando exista un contrato especifico.
        </Text>
      </Stack>

      {isError && error && (
        <Alert color="red" variant="light">
          {isApiError(error) ? error.detail : 'No se pudieron actualizar los permisos.'}
        </Alert>
      )}

      <Alert color="blue" variant="light">
        Servicio actual: {selectedService.name}
      </Alert>

      <Checkbox
        checked={hasAccess}
        onChange={(event) => setHasAccess(event.currentTarget.checked)}
        label={`Puede operar en ${selectedService.name}`}
        description="Esta asignacion controla si el secretario/a queda vinculado al servicio actual."
        disabled={isPending}
      />

      <Text size="sm" c="dimmed">
        Servicios asignados actualmente: {secretary.serviceIds.length}
      </Text>

      <Group justify="flex-end">
        <Button type="button" variant="default" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button onClick={() => void handleSubmit()} loading={isPending}>
          Guardar permisos
        </Button>
      </Group>
    </Stack>
  );
}
