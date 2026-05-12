import { Alert, Box, Button, Checkbox, Group, Select, Stack, Text } from '@mantine/core';
import { isApiError } from 'app/api';
import { useBusiness } from 'features/business/hooks';
import {
  useGrantSecretaryPermission,
  useRevokeSecretaryPermission,
  useSetSecretaryServiceAccess,
} from 'features/users/hooks';
import { useEffect, useMemo, useState } from 'react';
import {
  SecretaryPermission,
  type BusinessDto,
  type SecretaryDto,
  type ServiceSecretaryPermissionsDto,
} from 'shared/models';
import { useBusinessStore } from 'store/use-business-store';

import classes from './secretary-permissions-form.module.css';

interface SecretaryPermissionsFormProps {
  ownerId: number;
  secretary: SecretaryDto;
  services: BusinessDto[];
  initialServiceId?: number;
  onCancel: () => void;
  onSuccess: () => void;
  onServiceUpdated: (service: BusinessDto) => void;
}

interface PermissionOption {
  value: SecretaryPermission;
  label: string;
  description: string;
}

const SECRETARY_PERMISSION_OPTIONS: PermissionOption[] = [
  {
    value: SecretaryPermission.ViewAppointments,
    label: 'Ver turnos',
    description: 'Permite consultar la agenda y el detalle de los turnos del servicio.',
  },
  {
    value: SecretaryPermission.CreateAppointments,
    label: 'Crear turnos',
    description: 'Permite registrar nuevos turnos para el servicio seleccionado.',
  },
  {
    value: SecretaryPermission.EditAppointments,
    label: 'Editar turnos',
    description: 'Permite modificar informacion de turnos ya existentes.',
  },
  {
    value: SecretaryPermission.CancelAppointments,
    label: 'Cancelar turnos',
    description: 'Permite cancelar turnos del servicio.',
  },
  {
    value: SecretaryPermission.RescheduleAppointments,
    label: 'Reprogramar turnos',
    description: 'Permite mover turnos a otra fecha u horario.',
  },
  {
    value: SecretaryPermission.MarkAttendance,
    label: 'Marcar asistencia',
    description: 'Permite marcar asistencia o ausencia de clientes.',
  },
  {
    value: SecretaryPermission.ManageSchedules,
    label: 'Gestionar horarios',
    description: 'Permite administrar horarios y excepciones del servicio.',
  },
];

export function SecretaryPermissionsForm({
  ownerId,
  secretary,
  services,
  initialServiceId,
  onCancel,
  onSuccess,
  onServiceUpdated,
}: SecretaryPermissionsFormProps) {
  const updateService = useBusinessStore((state) => state.updateService);
  const [activeServiceId, setActiveServiceId] = useState<number | null>(
    initialServiceId ?? services[0]?.id ?? null,
  );
  const {
    data: serviceData,
    isLoading: isServiceLoading,
    isFetching: isServiceFetching,
    refetch: refetchService,
  } = useBusiness(activeServiceId ?? undefined);

  const activeService = useMemo(
    () => serviceData ?? services.find((service) => service.id === activeServiceId) ?? null,
    [activeServiceId, serviceData, services],
  );
  const serviceOptions = useMemo(
    () =>
      [...services]
        .sort((left, right) => left.name.localeCompare(right.name, 'es-AR'))
        .map((service) => ({
          value: String(service.id),
          label: service.name,
        })),
    [services],
  );

  const permissionEntry = useMemo<ServiceSecretaryPermissionsDto | undefined>(
    () => activeService?.secretaryPermissions.find((item) => item.secretaryId === secretary.id),
    [activeService, secretary.id],
  );

  const currentHasAccess = activeService?.secretaryIds.includes(secretary.id) ?? false;
  const currentPermissions = useMemo(() => permissionEntry?.permissions ?? [], [permissionEntry]);

  const [hasAccess, setHasAccess] = useState(currentHasAccess);
  const [selectedPermissions, setSelectedPermissions] =
    useState<SecretaryPermission[]>(currentPermissions);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setAccessMutation = useSetSecretaryServiceAccess(activeService?.id ?? 0, ownerId);
  const grantPermissionMutation = useGrantSecretaryPermission(
    activeService?.id ?? 0,
    secretary.id,
    ownerId,
  );
  const revokePermissionMutation = useRevokeSecretaryPermission(
    activeService?.id ?? 0,
    secretary.id,
    ownerId,
  );

  const isPending =
    isServiceLoading ||
    isServiceFetching ||
    setAccessMutation.isPending ||
    grantPermissionMutation.isPending ||
    revokePermissionMutation.isPending;

  useEffect(() => {
    setActiveServiceId(initialServiceId ?? services[0]?.id ?? null);
    setSubmitError(null);
  }, [initialServiceId, secretary.id, services]);

  useEffect(() => {
    setHasAccess(currentHasAccess);
    setSelectedPermissions(currentPermissions);
    setSubmitError(null);
  }, [activeService?.id, currentHasAccess, currentPermissions, secretary.id]);

  const togglePermission = (permission: SecretaryPermission, checked: boolean) => {
    setSelectedPermissions((current) => {
      if (checked) {
        return current.includes(permission) ? current : [...current, permission];
      }

      return current.filter((value) => value !== permission);
    });
  };

  const handleSubmit = async () => {
    setSubmitError(null);

    if (!activeService) {
      setSubmitError('No se pudo cargar el servicio a gestionar.');
      return;
    }

    const currentSecretaryIds = activeService.secretaryIds.filter((id): id is number => id != null);
    const nextSecretaryIds = hasAccess
      ? Array.from(new Set([...currentSecretaryIds, secretary.id]))
      : currentSecretaryIds.filter((id) => id !== secretary.id);

    const currentPermissionSet = new Set(currentPermissions);
    const nextPermissionSet = new Set(selectedPermissions);

    const permissionsToGrant = hasAccess
      ? selectedPermissions.filter((permission) => !currentPermissionSet.has(permission))
      : [];
    const permissionsToRevoke = hasAccess
      ? currentPermissions.filter((permission) => !nextPermissionSet.has(permission))
      : [];

    try {
      if (currentHasAccess !== hasAccess) {
        await setAccessMutation.mutateAsync({ secretaryIds: nextSecretaryIds });
      }

      for (const permission of permissionsToGrant) {
        await grantPermissionMutation.mutateAsync({
          permission,
        });
      }

      for (const permission of permissionsToRevoke) {
        await revokePermissionMutation.mutateAsync({
          permission,
        });
      }

      const refreshedResult = await refetchService();
      const refreshedService = refreshedResult.data;
      if (refreshedService) {
        updateService(refreshedService);
        onServiceUpdated(refreshedService);
      }

      onSuccess();
    } catch (error) {
      setSubmitError(
        isApiError(error) ? error.detail : 'No se pudieron actualizar los permisos del secretario.',
      );
    }
  };

  return (
    <Stack gap="lg">
      {submitError && (
        <Alert color="red" variant="light">
          {submitError}
        </Alert>
      )}

      <Stack gap="sm">
        <Text fw={600}>Servicio y acceso</Text>
        {serviceOptions.length > 0 ? (
          <Select
            data={serviceOptions}
            value={activeServiceId != null ? String(activeServiceId) : null}
            onChange={(value) => {
              setActiveServiceId(value ? Number(value) : null);
              setSubmitError(null);
            }}
            disabled={isPending || serviceOptions.length === 1}
            allowDeselect={false}
          />
        ) : (
          <Alert color="yellow" variant="light">
            No hay servicios disponibles para configurar.
          </Alert>
        )}

        <Box className={classes.accessBlock}>
          <Checkbox
            checked={hasAccess}
            onChange={(event) => setHasAccess(event.currentTarget.checked)}
            label={`Puede operar en ${activeService?.name ?? 'este servicio'}`}
            description="Si desactivas este acceso, el secretario deja de estar asignado al servicio."
            disabled={isPending || !activeService}
          />
        </Box>
      </Stack>

      <Stack gap="sm">
        <Stack gap={4}>
          <Text fw={600}>Permisos operativos</Text>
        </Stack>

        <Box className={classes.permissionList}>
          {SECRETARY_PERMISSION_OPTIONS.map((option, index) => (
            <Box key={option.value} className={classes.permissionRow} data-first={index === 0}>
              <Checkbox
                checked={selectedPermissions.includes(option.value)}
                onChange={(event) => togglePermission(option.value, event.currentTarget.checked)}
                label={option.label}
                description={option.description}
                disabled={isPending || !hasAccess || !activeService}
              />
            </Box>
          ))}
        </Box>
      </Stack>
      <Group className={classes.actions} justify="flex-end" gap="sm">
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
