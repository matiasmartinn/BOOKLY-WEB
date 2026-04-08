import {
  Alert,
  Badge,
  Button,
  CopyButton,
  Group,
  Loader,
  Stack,
  Switch,
  Text,
  TextInput,
} from '@mantine/core';
import { isApiError } from 'app/api';
import {
  useBusinessPublicBooking,
  useDisableBusinessPublicBooking,
  useEnableBusinessPublicBooking,
  useRegenerateBusinessPublicBooking,
} from 'features/business/hooks';
import { useMemo, useState } from 'react';
import type { ServicePublicBookingDto } from 'shared/models';
import { useAppToast } from 'shared/ui/toast';
import { buildPublicBookingUrl } from '../utils';

const publicBookingDateFormatter = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

interface PublicBookingSharePanelProps {
  serviceId: number;
  ownerId?: number;
  slug?: string | null;
  token?: string | null;
  tokenUpdatedAt?: string | null;
  isEnabled: boolean;
  onPublicBookingUpdated?: (publicBooking: ServicePublicBookingDto) => void;
}

const formatPublicBookingTimestamp = (value?: string | null) => {
  if (!value) {
    return 'Sin registros';
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return 'Fecha no disponible';
  }

  return publicBookingDateFormatter.format(parsed);
};

export function PublicBookingSharePanel({
  serviceId,
  ownerId,
  slug,
  token,
  tokenUpdatedAt,
  isEnabled,
  onPublicBookingUpdated,
}: PublicBookingSharePanelProps) {
  const toast = useAppToast();
  const [actionError, setActionError] = useState<string | null>(null);

  const {
    data: publicBooking,
    isLoading: isLoadingPublicBooking,
    isFetching: isFetchingPublicBooking,
    isError: isPublicBookingError,
    error: publicBookingError,
  } = useBusinessPublicBooking(serviceId);
  const enablePublicBookingMutation = useEnableBusinessPublicBooking(serviceId, ownerId);
  const disablePublicBookingMutation = useDisableBusinessPublicBooking(serviceId, ownerId);
  const regeneratePublicBookingMutation = useRegenerateBusinessPublicBooking(serviceId, ownerId);

  const fallbackPublicUrl = useMemo(() => {
    if (!slug?.trim() || !token?.trim()) {
      return '';
    }

    return buildPublicBookingUrl(slug, token);
  }, [slug, token]);

  const currentPublicBooking = publicBooking ?? {
    serviceId,
    slug: slug?.trim() ?? '',
    isEnabled,
    publicBookingToken: token?.trim() ?? '',
    publicBookingTokenUpdatedAt: tokenUpdatedAt ?? null,
    publicUrl: fallbackPublicUrl,
  };
  const publicUrl = currentPublicBooking.publicUrl?.trim() || fallbackPublicUrl;
  const isPending =
    enablePublicBookingMutation.isPending ||
    disablePublicBookingMutation.isPending ||
    regeneratePublicBookingMutation.isPending;

  const handleMutationError = (error: unknown, fallbackMessage: string) => {
    setActionError(isApiError(error) ? error.detail : fallbackMessage);
  };

  const handleTogglePublicBooking = async (nextEnabled: boolean) => {
    setActionError(null);

    try {
      const nextPublicBooking = nextEnabled
        ? await enablePublicBookingMutation.mutateAsync()
        : await disablePublicBookingMutation.mutateAsync();

      onPublicBookingUpdated?.(nextPublicBooking);
      toast.success(
        nextEnabled
          ? 'La reserva publica se habilito correctamente.'
          : 'La reserva publica se deshabilito correctamente.',
      );
    } catch (error) {
      handleMutationError(error, 'No se pudo actualizar el estado de la reserva publica.');
    }
  };

  const handleRegeneratePublicBooking = async () => {
    setActionError(null);

    try {
      const nextPublicBooking = await regeneratePublicBookingMutation.mutateAsync();

      onPublicBookingUpdated?.(nextPublicBooking);
      toast.success('Se genero un nuevo enlace publico. El anterior dejo de ser valido.');
    } catch (error) {
      handleMutationError(error, 'No se pudo regenerar el enlace publico.');
    }
  };

  return (
    <Stack gap="sm">
      <Group justify="space-between" align="center" wrap="wrap" gap="sm">
        <Stack gap={0}>
          <Text size="sm" fw={600}>
            Reserva publica
          </Text>
        </Stack>

        <Badge color={currentPublicBooking.isEnabled ? 'green' : 'gray'} variant="light">
          {currentPublicBooking.isEnabled ? 'Habilitada' : 'Deshabilitada'}
        </Badge>
      </Group>

      {isPublicBookingError && (
        <Alert color="yellow" variant="light">
          {isApiError(publicBookingError)
            ? `${publicBookingError.detail} Se muestran los datos locales del servicio.`
            : 'No se pudo validar la reserva publica con el servidor. Se muestran los datos locales del servicio.'}
        </Alert>
      )}

      {actionError && (
        <Alert color="red" variant="light">
          {actionError}
        </Alert>
      )}

      <Switch
        checked={currentPublicBooking.isEnabled}
        onChange={(event) => void handleTogglePublicBooking(event.currentTarget.checked)}
        disabled={isPending}
        label={
          currentPublicBooking.isEnabled
            ? 'Reserva publica habilitada'
            : 'Reserva publica deshabilitada'
        }
        description={
          currentPublicBooking.isEnabled
            ? 'Los clientes pueden usar el enlace para reservar sin iniciar sesion.'
            : 'El enlace queda guardado, pero no aceptara nuevas reservas hasta volver a habilitarlo.'
        }
      />

      <Group align="flex-end" wrap="wrap" gap="sm">
        <TextInput
          label="Link publico"
          value={publicUrl}
          readOnly
          placeholder="Sin enlace disponible"
          style={{ flex: 1, minWidth: 'min(100%, 320px)' }}
          rightSection={
            isLoadingPublicBooking || isFetchingPublicBooking ? <Loader size="xs" /> : undefined
          }
          styles={{
            input: {
              fontFamily: 'monospace',
            },
          }}
        />

        <CopyButton value={publicUrl} timeout={2000}>
          {({ copied, copy }) => (
            <Button
              type="button"
              variant="default"
              size="sm"
              disabled={!publicUrl}
              onClick={() => {
                copy();
                toast.success('El link publico se copio al portapapeles.');
              }}
            >
              {copied ? 'Copiado' : 'Copiar'}
            </Button>
          )}
        </CopyButton>

        <Button
          type="button"
          variant="light"
          size="sm"
          onClick={() => void handleRegeneratePublicBooking()}
          disabled={!publicUrl || isPending}
          loading={regeneratePublicBookingMutation.isPending}
        >
          Regenerar enlace
        </Button>
      </Group>

      <Text size="xs" c="dimmed">
        Ultima actualizacion del enlace:{' '}
        {formatPublicBookingTimestamp(currentPublicBooking.publicBookingTokenUpdatedAt)}
      </Text>
    </Stack>
  );
}
