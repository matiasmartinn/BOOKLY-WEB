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
import { useMemo, useState, type ReactNode } from 'react';
import type { ServicePublicBookingDto } from 'shared/models';
import { useAppToast } from 'shared/ui/toast';
import { formatDateTime } from 'shared/utils';

import { buildPublicBookingUrl } from '../utils';

interface PublicBookingSharePanelProps {
  serviceId: number;
  ownerId?: number;
  slug?: string | null;
  slugField?: ReactNode;
  code?: string | null;
  codeUpdatedAt?: string | null;
  isEnabled: boolean;
  onPublicBookingUpdated?: (publicBooking: ServicePublicBookingDto) => void;
}

const formatPublicBookingTimestamp = (value?: string | null) => {
  if (!value) return 'Sin registros';
  return formatDateTime(value) || 'Fecha no disponible';
};

export function PublicBookingSharePanel({
  serviceId,
  ownerId,
  slug,
  slugField,
  code,
  codeUpdatedAt,
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
    if (!slug?.trim() || !code?.trim()) return '';
    return buildPublicBookingUrl(slug, code);
  }, [code, slug]);

  const currentPublicBooking = publicBooking ?? {
    serviceId,
    slug: slug?.trim() ?? '',
    isEnabled,
    publicBookingCode: code?.trim() ?? '',
    publicBookingCodeUpdatedAt: codeUpdatedAt ?? null,
    publicUrl: fallbackPublicUrl,
  };

  const isPublicBookingActive = currentPublicBooking.isEnabled;
  const localSlug = slug?.trim() ?? '';
  const remoteSlug = currentPublicBooking.slug?.trim() ?? '';
  const shouldPreferLocalUrl = Boolean(localSlug && localSlug !== remoteSlug && fallbackPublicUrl);
  const publicUrl = shouldPreferLocalUrl
    ? fallbackPublicUrl
    : currentPublicBooking.publicUrl?.trim() || fallbackPublicUrl;

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
          ? 'La reserva pública se habilitó correctamente.'
          : 'La reserva pública se deshabilitó correctamente.',
      );
    } catch (error) {
      handleMutationError(error, 'No se pudo actualizar el estado de la reserva pública.');
    }
  };

  const handleRegeneratePublicBooking = async () => {
    setActionError(null);

    try {
      const nextPublicBooking = await regeneratePublicBookingMutation.mutateAsync();
      onPublicBookingUpdated?.(nextPublicBooking);
      toast.success('Se generó un nuevo código público. El enlace anterior dejó de ser válido.');
    } catch (error) {
      handleMutationError(error, 'No se pudo regenerar el código público.');
    }
  };

  return (
    <Stack gap="lg">
      {isPublicBookingError && (
        <Alert color="yellow" variant="light">
          {isApiError(publicBookingError)
            ? `${publicBookingError.detail} Se muestran los datos locales del servicio.`
            : 'No se pudo validar la reserva pública con el servidor. Se muestran los datos locales del servicio.'}
        </Alert>
      )}

      {actionError && (
        <Alert color="red" variant="light">
          {actionError}
        </Alert>
      )}

      <Group justify="space-between" align="center" wrap="wrap" gap="md">
        <Group gap="sm" wrap="wrap">
          <Badge color={isPublicBookingActive ? 'green' : 'gray'} variant="light" radius="xl">
            {isPublicBookingActive ? 'Reserva activa' : 'Reserva inactiva'}
          </Badge>

          <Text size="sm" c="dimmed">
            {isPublicBookingActive ? 'Acepta reservas online.' : 'No acepta reservas online.'}
          </Text>
        </Group>

        <Switch
          color="brand"
          checked={isPublicBookingActive}
          onChange={(event) => void handleTogglePublicBooking(event.currentTarget.checked)}
          disabled={isPending}
          label={isPublicBookingActive ? 'Activa' : 'Pausada'}
        />
      </Group>

      <Stack
        gap="md"
        p="lg"
        style={{
          borderRadius: 'var(--mantine-radius-lg)',
          backgroundColor: 'var(--app-color-surface-soft)',
          border: '1px solid var(--app-color-border)',
        }}
      >
        <Group justify="space-between" align="center" wrap="wrap" gap="sm">
          <Text fw={800} size="lg">
            Enlace para compartir
          </Text>

          <Group gap="sm" wrap="wrap">
            <Button
              type="button"
              variant="light"
              color="brand"
              onClick={() => void handleRegeneratePublicBooking()}
              disabled={!publicUrl || isPending}
              loading={regeneratePublicBookingMutation.isPending}
            >
              Regenerar código
            </Button>

            <CopyButton value={publicUrl} timeout={2000}>
              {({ copied, copy }) => (
                <Button
                  type="button"
                  color="brand"
                  disabled={!publicUrl}
                  onClick={() => {
                    copy();
                    toast.success('El link público se copió al portapapeles.');
                  }}
                >
                  {copied ? 'Copiado' : 'Copiar enlace'}
                </Button>
              )}
            </CopyButton>
          </Group>
        </Group>

        <TextInput
          value={publicUrl}
          readOnly
          placeholder="Sin enlace disponible"
          size="md"
          rightSection={
            isLoadingPublicBooking || isFetchingPublicBooking ? <Loader size="xs" /> : undefined
          }
          styles={{
            input: {
              fontFamily: 'monospace',
              backgroundColor: 'var(--app-color-surface)',
              color: 'var(--app-color-text-primary)',
            },
          }}
        />

        <Text size="sm" c="dimmed">
          Actualizado:{' '}
          {formatPublicBookingTimestamp(currentPublicBooking.publicBookingCodeUpdatedAt)}
        </Text>
      </Stack>

      <Stack
        gap="md"
        pt="md"
        style={{
          borderTop: '1px solid var(--app-color-border)',
        }}
      >
        <Text fw={700}>Slug público</Text>
        {slugField}
      </Stack>
    </Stack>
  );
}
