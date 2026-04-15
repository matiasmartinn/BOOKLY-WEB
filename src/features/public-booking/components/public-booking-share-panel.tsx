import {
  Alert,
  Badge,
  Button,
  CopyButton,
  Divider,
  Group,
  Loader,
  Paper,
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

import { buildPublicBookingUrl } from '../utils';

const publicBookingDateFormatter = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

interface PublicBookingSharePanelProps {
  serviceId: number;
  ownerId?: number;
  slug?: string | null;
  pendingSlug?: string;
  slugField?: ReactNode;
  code?: string | null;
  codeUpdatedAt?: string | null;
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
  pendingSlug,
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
    if (!slug?.trim() || !code?.trim()) {
      return '';
    }

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
  const publicBookingCode = currentPublicBooking.publicBookingCode?.trim() ?? '';
  const localSlug = slug?.trim() ?? '';
  const remoteSlug = currentPublicBooking.slug?.trim() ?? '';
  const shouldPreferLocalUrl = Boolean(localSlug && localSlug !== remoteSlug && fallbackPublicUrl);
  const publicUrl = shouldPreferLocalUrl
    ? fallbackPublicUrl
    : currentPublicBooking.publicUrl?.trim() || fallbackPublicUrl;
  const savedSlug = localSlug || remoteSlug;
  const draftSlug = pendingSlug?.trim() ?? '';
  const hasPendingSlugChanges = Boolean(draftSlug) && draftSlug !== savedSlug;
  const isPending =
    enablePublicBookingMutation.isPending ||
    disablePublicBookingMutation.isPending ||
    regeneratePublicBookingMutation.isPending;
  const publicUrlDescription = hasPendingSlugChanges
    ? 'Guarda los cambios del formulario para actualizar el enlace con el nuevo slug.'
    : publicUrl
      ? currentPublicBooking.isEnabled
        ? 'Este es el enlace listo para copiar y compartir con tus clientes.'
        : 'El enlace existe, pero la reserva publica esta deshabilitada.'
      : 'Todavia no hay un enlace disponible para compartir.';

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
      toast.success('Se genero un nuevo codigo publico. El enlace anterior dejo de ser valido.');
    } catch (error) {
      handleMutationError(error, 'No se pudo regenerar el codigo publico.');
    }
  };

  return (
    <Stack gap="lg">
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

      <Paper
        withBorder
        radius="lg"
        p="lg"
        style={{
          background: isPublicBookingActive
            ? 'linear-gradient(180deg, rgba(34,197,94,0.12) 0%, rgba(255,255,255,0.96) 100%)'
            : 'linear-gradient(180deg, rgba(99,102,241,0.06) 0%, rgba(255,255,255,0.96) 100%)',
          borderColor: isPublicBookingActive
            ? 'rgba(34, 197, 94, 0.22)'
            : 'var(--app-color-brand-outline)',
          boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)',
        }}
      >
        <Stack gap="md">
          <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
            <Stack gap={4} style={{ flex: 1, minWidth: 220 }}>
              <Group gap="xs" wrap="wrap">
                <Text
                  size="md"
                  fw={700}
                  style={{
                    color: 'var(--app-color-text-primary)',
                  }}
                >
                  Estado de la reserva publica
                </Text>

                <Badge color={currentPublicBooking.isEnabled ? 'green' : 'gray'} variant="light">
                  {currentPublicBooking.isEnabled ? 'Habilitada' : 'Deshabilitada'}
                </Badge>
              </Group>

              <Text
                size="sm"
                style={{
                  color: 'var(--app-color-text-secondary)',
                  lineHeight: 1.5,
                }}
              >
                {currentPublicBooking.isEnabled
                  ? 'Los clientes pueden usar este enlace para reservar sin iniciar sesion.'
                  : 'Puedes dejar listo el enlace y habilitar la reserva publica cuando quieras.'}
              </Text>
            </Stack>

            <Switch
              color="brand"
              size="md"
              checked={currentPublicBooking.isEnabled}
              onChange={(event) => void handleTogglePublicBooking(event.currentTarget.checked)}
              disabled={isPending}
              label={
                currentPublicBooking.isEnabled ? 'Reserva publica activa' : 'Reserva publica inactiva'
              }
              description={
                currentPublicBooking.isEnabled
                  ? 'Acepta nuevas reservas.'
                  : 'El enlace queda guardado sin aceptar nuevas reservas.'
              }
              styles={{
                label: {
                  color: 'var(--app-color-text-primary)',
                  fontWeight: 600,
                },
                description: {
                  color: 'var(--app-color-text-secondary)',
                  lineHeight: 1.4,
                },
              }}
            />
          </Group>

          {slugField ? (
            <>
              <Divider />
              {slugField}
            </>
          ) : null}
        </Stack>
      </Paper>

      <Paper
        withBorder
        radius="lg"
        p="lg"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(238,242,255,0.52) 100%)',
          borderColor: 'var(--app-color-brand-outline)',
          boxShadow: '0 12px 26px rgba(99, 102, 241, 0.08)',
        }}
      >
        <Stack gap="md">
          <TextInput
            label="Codigo publico actual"
            value={publicBookingCode}
            readOnly
            placeholder="Sin codigo disponible"
            size="md"
            description={
              publicBookingCode
                ? 'Codigo corto que protege el acceso al enlace publico.'
                : 'Se generara cuando el servicio tenga un codigo disponible.'
            }
            styles={{
              label: {
                marginBottom: 6,
                fontWeight: 600,
                color: 'var(--app-color-text-primary)',
              },
              description: {
                marginTop: 6,
                color: 'var(--app-color-text-secondary)',
                lineHeight: 1.45,
              },
              input: {
                fontFamily: 'monospace',
                backgroundColor: 'rgba(255,255,255,0.9)',
                border: '1px solid var(--app-color-brand-outline)',
                color: 'var(--app-color-text-primary)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
              },
            }}
          />

          <TextInput
            label="Enlace publico generado"
            value={publicUrl}
            readOnly
            placeholder="Sin enlace disponible"
            size="md"
            description={publicUrlDescription}
            rightSection={
              isLoadingPublicBooking || isFetchingPublicBooking ? <Loader size="xs" /> : undefined
            }
            styles={{
              label: {
                marginBottom: 6,
                fontWeight: 600,
                color: 'var(--app-color-text-primary)',
              },
              description: {
                marginTop: 6,
                color: 'var(--app-color-text-secondary)',
                lineHeight: 1.45,
              },
              input: {
                fontFamily: 'monospace',
                backgroundColor: 'rgba(255,255,255,0.9)',
                border: '1px solid var(--app-color-brand-outline)',
                color: 'var(--app-color-text-primary)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
              },
            }}
          />

          <Group justify="space-between" align="center" wrap="wrap" gap="sm">
            <Text
              size="xs"
              style={{
                color: 'var(--app-color-text-secondary)',
              }}
            >
              Ultima actualizacion del codigo:{' '}
              {formatPublicBookingTimestamp(currentPublicBooking.publicBookingCodeUpdatedAt)}
            </Text>

            <Group align="flex-end" wrap="wrap" gap="sm">
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
                Regenerar codigo
              </Button>
            </Group>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );
}
