import { Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useMemo, useState } from 'react';
import { GenericModal } from 'shared/components';
import { PageCard } from 'shared/layout';
import type { ServiceTypeDto } from 'shared/models';
import { useAppToast } from 'shared/ui/toast';

import {
  AdminServiceTypeForm,
  AdminServiceTypesTable,
  AdminStatusForm,
} from '../components';
import {
  useAdminServiceTypes,
  useCreateAdminServiceType,
  useDisableAdminServiceType,
  useUpdateAdminServiceType,
} from '../hooks';

type ServiceTypeFormMode = 'create' | 'edit';

const sortByName = (left: ServiceTypeDto, right: ServiceTypeDto) =>
  left.name.localeCompare(right.name, 'es-AR', { sensitivity: 'base' });

const upsertServiceType = (items: ServiceTypeDto[], nextItem: ServiceTypeDto) => {
  const nextItems = items.filter((item) => item.id !== nextItem.id);
  nextItems.unshift(nextItem);
  return nextItems.sort(sortByName);
};

export function AdminServiceTypesPageContainer() {
  const toast = useAppToast();
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceTypeDto | null>(null);
  const [formMode, setFormMode] = useState<ServiceTypeFormMode>('create');
  const [localServiceTypes, setLocalServiceTypes] = useState<ServiceTypeDto[]>([]);
  const [formOpened, formHandlers] = useDisclosure(false);
  const [statusOpened, statusHandlers] = useDisclosure(false);

  const serviceTypesQuery = useAdminServiceTypes();
  const createServiceTypeMutation = useCreateAdminServiceType();
  const updateServiceTypeMutation = useUpdateAdminServiceType(selectedServiceType?.id);
  const disableServiceTypeMutation = useDisableAdminServiceType();

  const serviceTypes = useMemo(() => {
    const mergedItems = new Map<number, ServiceTypeDto>();

    (serviceTypesQuery.data ?? []).forEach((serviceType) => {
      mergedItems.set(serviceType.id, serviceType);
    });

    localServiceTypes.forEach((serviceType) => {
      mergedItems.set(serviceType.id, serviceType);
    });

    return [...mergedItems.values()].sort(sortByName);
  }, [localServiceTypes, serviceTypesQuery.data]);

  const syncLocalServiceType = (serviceType: ServiceTypeDto) => {
    setLocalServiceTypes((current) => {
      if (serviceType.isActive) {
        return current.filter((item) => item.id !== serviceType.id);
      }

      return upsertServiceType(current, serviceType);
    });
  };

  const handleCreate = () => {
    createServiceTypeMutation.reset();
    updateServiceTypeMutation.reset();
    setSelectedServiceType(null);
    setFormMode('create');
    formHandlers.open();
  };

  const handleEdit = (serviceType: ServiceTypeDto) => {
    createServiceTypeMutation.reset();
    updateServiceTypeMutation.reset();
    setSelectedServiceType(serviceType);
    setFormMode('edit');
    formHandlers.open();
  };

  const handleDisable = (serviceType: ServiceTypeDto) => {
    disableServiceTypeMutation.reset();
    setSelectedServiceType(serviceType);
    statusHandlers.open();
  };

  const handleCloseForm = () => {
    if (createServiceTypeMutation.isPending || updateServiceTypeMutation.isPending) {
      return;
    }

    createServiceTypeMutation.reset();
    updateServiceTypeMutation.reset();
    formHandlers.close();
    setSelectedServiceType(null);
    setFormMode('create');
  };

  const handleCloseStatus = () => {
    if (disableServiceTypeMutation.isPending) {
      return;
    }

    disableServiceTypeMutation.reset();
    statusHandlers.close();
    setSelectedServiceType(null);
  };

  const handleFormSuccess = (serviceType: ServiceTypeDto) => {
    syncLocalServiceType(serviceType);
    handleCloseForm();
    toast.success(
      formMode === 'create'
        ? 'Tipo de servicio creado correctamente.'
        : 'Tipo de servicio actualizado correctamente.',
    );
  };

  const handleConfirmDisable = async () => {
    if (!selectedServiceType) {
      return;
    }

    try {
      await disableServiceTypeMutation.mutateAsync(selectedServiceType.id);
      syncLocalServiceType({ ...selectedServiceType, isActive: false });
      handleCloseStatus();
      toast.success('Tipo de servicio deshabilitado correctamente.');
    } catch {
      // El error se muestra dentro del modal.
    }
  };

  return (
    <>
      <Stack gap="md">
        <PageCard>
          <AdminServiceTypesTable
            serviceTypes={serviceTypes}
            isLoading={serviceTypesQuery.isLoading}
            isFetching={serviceTypesQuery.isFetching}
            isError={serviceTypesQuery.isError}
            onRefetch={() => {
              void serviceTypesQuery.refetch();
            }}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onDisable={handleDisable}
          />
        </PageCard>
      </Stack>

      <GenericModal
        opened={formOpened}
        onClose={handleCloseForm}
        title={formMode === 'create' ? 'Nuevo tipo de servicio' : 'Editar tipo de servicio'}
        size="lg"
      >
        {formOpened ? (
          <AdminServiceTypeForm
            mode={formMode}
            serviceType={selectedServiceType}
            createMutation={createServiceTypeMutation}
            updateMutation={updateServiceTypeMutation}
            onCancel={handleCloseForm}
            onSuccess={handleFormSuccess}
          />
        ) : null}
      </GenericModal>

      <GenericModal
        opened={statusOpened}
        onClose={handleCloseStatus}
        title="Deshabilitar tipo de servicio"
      >
        {statusOpened && selectedServiceType ? (
          <AdminStatusForm
            entityLabel="tipo de servicio"
            entityName={selectedServiceType.name}
            isActive={selectedServiceType.isActive}
            onCancel={handleCloseStatus}
            onConfirm={() => {
              void handleConfirmDisable();
            }}
            isPending={disableServiceTypeMutation.isPending}
            error={disableServiceTypeMutation.error}
          />
        ) : null}
      </GenericModal>
    </>
  );
}
