import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Checkbox, Group, Stack, Text } from '@mantine/core';
import { isApiError } from 'app/api';
import {
  useGrantSecretaryPermission,
  useRevokeSecretaryPermission,
  useSetSecretaryServiceAccess,
} from 'features/users/hooks';
import {
  SecretaryPermission,
  type BusinessDto,
  type SecretaryDto,
  type ServiceSecretaryPermissionsDto,
} from 'shared/models';
import { useBusinessStore } from 'store/use-buisness-store';

interface SecretaryPermissionsFormProps {
  ownerId: number;
  currentUserRole: string;
  secretary: SecretaryDto;
  selectedService: BusinessDto;
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
  currentUserRole,
  secretary,
  selectedService,
  onCancel,
  onSuccess,
  onServiceUpdated,
}: SecretaryPermissionsFormProps) {
  const selectService = useBusinessStore((state) => state.selectService);

  const permissionEntry = useMemo<ServiceSecretaryPermissionsDto | undefined>(
    () =>
      selectedService.secretaryPermissions.find((item) => item.secretaryId === secretary.id),
    [secretary.id, selectedService.secretaryPermissions],
  );

  const currentHasAccess = selectedService.secretaryIds.includes(secretary.id);
  const currentPermissions = useMemo(
    () => permissionEntry?.permissions ?? [],
    [permissionEntry],
  );

  const [hasAccess, setHasAccess] = useState(currentHasAccess);
  const [selectedPermissions, setSelectedPermissions] = useState<SecretaryPermission[]>(
    currentPermissions,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setAccessMutation = useSetSecretaryServiceAccess(selectedService.id, ownerId);
  const grantPermissionMutation = useGrantSecretaryPermission(selectedService.id, secretary.id, ownerId);
  const revokePermissionMutation = useRevokeSecretaryPermission(selectedService.id, secretary.id, ownerId);

  const isPending =
    setAccessMutation.isPending ||
    grantPermissionMutation.isPending ||
    revokePermissionMutation.isPending;

  useEffect(() => {
    setHasAccess(currentHasAccess);
    setSelectedPermissions(currentPermissions);
    setSubmitError(null);
  }, [currentHasAccess, currentPermissions, selectedService.id, secretary.id]);

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

    const currentSecretaryIds = selectedService.secretaryIds.filter((id): id is number => id != null);
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
          currentUserId: ownerId,
          currentUserRole,
        });
      }

      for (const permission of permissionsToRevoke) {
        await revokePermissionMutation.mutateAsync({
          permission,
          currentUserId: ownerId,
          currentUserRole,
        });
      }

      await selectService(selectedService.id);

      const refreshedService = useBusinessStore.getState().selectedService;
      if (refreshedService) {
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
      <Stack gap={4}>
        <Text fw={600}>Permisos del servicio</Text>
        <Text size="sm" c="dimmed">
          Define si el secretario puede operar en este servicio y que acciones puede realizar.
        </Text>
      </Stack>

      {submitError && (
        <Alert color="red" variant="light">
          {submitError}
        </Alert>
      )}

      <Alert color="blue" variant="light">
        Servicio actual: {selectedService.name}
      </Alert>

      <Checkbox
        checked={hasAccess}
        onChange={(event) => setHasAccess(event.currentTarget.checked)}
        label={`Puede operar en ${selectedService.name}`}
        description="Si desactivas este acceso, el secretario deja de estar asignado al servicio."
        disabled={isPending}
      />

      <Stack gap="xs">
        <Text fw={500}>Permisos granulares</Text>
        <Text size="sm" c="dimmed">
          Estos permisos se aplican sobre el servicio actualmente seleccionado.
        </Text>

        {SECRETARY_PERMISSION_OPTIONS.map((option) => (
          <Checkbox
            key={option.value}
            checked={selectedPermissions.includes(option.value)}
            onChange={(event) => togglePermission(option.value, event.currentTarget.checked)}
            label={option.label}
            description={option.description}
            disabled={isPending || !hasAccess}
          />
        ))}
      </Stack>

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
