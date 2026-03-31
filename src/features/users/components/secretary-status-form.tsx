import { Alert, Button, Group, Stack, Text } from '@mantine/core';
import { isApiError } from 'app/api';
import type { SecretaryDto } from 'shared/models';
import { useActivateSecretary, useDeactivateSecretary } from '../hooks';

interface SecretaryStatusFormProps {
  secretary: SecretaryDto;
  onCancel: () => void;
  onSuccess: () => void;
}

export function SecretaryStatusForm({
  secretary,
  onCancel,
  onSuccess,
}: SecretaryStatusFormProps) {
  const activateMutation = useActivateSecretary(secretary.id);
  const deactivateMutation = useDeactivateSecretary(secretary.id);

  const isActive = secretary.isActive;
  const mutation = isActive ? deactivateMutation : activateMutation;

  const handleSubmit = async () => {
    try {
      await mutation.mutateAsync();
      onSuccess();
    } catch {
      // El error se muestra desde el hook
    }
  };

  return (
    <Stack gap="lg">
      <Stack gap={4}>
        <Text fw={600}>{isActive ? 'Dar de baja' : 'Reactivar'} secretario/a</Text>
        <Text size="sm" c="dimmed">
          {isActive
            ? 'La baja se resuelve con desactivacion del secretario/a, evitando borrar informacion existente.'
            : 'La reactivacion vuelve a habilitar al secretario/a dentro del sistema.'}
        </Text>
      </Stack>

      <Alert color={isActive ? 'red' : 'green'} variant="light">
        {isActive
          ? `${secretary.fullName} quedara inactivo/a hasta una reactivacion posterior.`
          : `${secretary.fullName} volvera a quedar activo/a.`}
      </Alert>

      {mutation.isError && mutation.error && (
        <Alert color="red" variant="light">
          {isApiError(mutation.error)
            ? mutation.error.detail
            : 'No se pudo actualizar el estado del secretario/a.'}
        </Alert>
      )}

      <Group justify="flex-end">
        <Button type="button" variant="default" onClick={onCancel} disabled={mutation.isPending}>
          Cancelar
        </Button>
        <Button
          color={isActive ? 'red' : 'green'}
          onClick={() => void handleSubmit()}
          loading={mutation.isPending}
        >
          {isActive ? 'Confirmar baja' : 'Confirmar reactivacion'}
        </Button>
      </Group>
    </Stack>
  );
}
