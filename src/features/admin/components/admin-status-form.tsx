import { useEffect } from 'react';
import { Alert, Button, Group, Stack, Text } from '@mantine/core';
import { isApiError } from 'app/api';
import { useAppToast } from 'shared/ui/toast';

interface AdminStatusFormProps {
  entityLabel: string;
  entityName: string;
  isActive: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isPending: boolean;
  error?: unknown;
  activationBlockedReason?: string;
}

export function AdminStatusForm({
  entityLabel,
  entityName,
  isActive,
  onCancel,
  onConfirm,
  isPending,
  error,
  activationBlockedReason,
}: AdminStatusFormProps) {
  const toast = useAppToast();
  const actionLabel = isActive ? 'deshabilitar' : 'habilitar';
  const confirmLabel = isActive ? 'Confirmar deshabilitacion' : 'Confirmar habilitacion';

  useEffect(() => {
    if (!error) {
      return;
    }

    toast.error(
      isApiError(error) ? error.detail : `No se pudo ${actionLabel} ${entityLabel.toLowerCase()}.`,
    );
  }, [actionLabel, entityLabel, error, toast]);

  return (
    <Stack gap="lg">
      <Alert color={isActive ? 'red' : 'green'} variant="light">
        {isActive
          ? `${entityName} quedara deshabilitado/a.`
          : `${entityName} volvera a quedar habilitado/a.`}
      </Alert>

      {activationBlockedReason ? (
        <Alert color="yellow" variant="light">
          {activationBlockedReason}
        </Alert>
      ) : null}

      <Group justify="flex-end">
        <Button type="button" variant="default" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button
          color={isActive ? 'red' : 'green'}
          onClick={onConfirm}
          loading={isPending}
          disabled={Boolean(activationBlockedReason)}
        >
          {confirmLabel}
        </Button>
      </Group>
    </Stack>
  );
}
