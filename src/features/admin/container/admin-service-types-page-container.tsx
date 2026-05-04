import { Alert, Select, Stack, Tabs, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useMemo, useState } from 'react';
import { GenericModal } from 'shared/components';
import { PageCard } from 'shared/layout';
import type {
  ServiceTypeDto,
  ServiceTypeFieldDefinitionDto,
} from 'shared/models';
import { useAppToast } from 'shared/ui/toast';
import {
  useCreateServiceTypeField,
  useDeactivateServiceTypeField,
  useGetServiceTypeFields,
  useUpdateServiceTypeField,
} from 'features/service-types/hooks';

import {
  AdminServiceTypeFieldForm,
  AdminServiceTypeForm,
  AdminServiceTypeFieldsTable,
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
type ServiceTypeFieldFormMode = 'create' | 'edit';
type AdminServiceTypesTab = 'service-types' | 'service-type-fields';

const sortByName = (left: ServiceTypeDto, right: ServiceTypeDto) =>
  left.name.localeCompare(right.name, 'es-AR', { sensitivity: 'base' });

const sortFields = (
  left: ServiceTypeFieldDefinitionDto,
  right: ServiceTypeFieldDefinitionDto,
) => {
  const sortOrderDifference = left.sortOrder - right.sortOrder;

  if (sortOrderDifference !== 0) {
    return sortOrderDifference;
  }

  return left.label.localeCompare(right.label, 'es-AR', { sensitivity: 'base' });
};

const upsertServiceType = (items: ServiceTypeDto[], nextItem: ServiceTypeDto) => {
  const nextItems = items.filter((item) => item.id !== nextItem.id);
  nextItems.unshift(nextItem);
  return nextItems.sort(sortByName);
};

export function AdminServiceTypesPageContainer() {
  const toast = useAppToast();
  const [activeTab, setActiveTab] = useState<AdminServiceTypesTab>('service-types');
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceTypeDto | null>(null);
  const [selectedFieldServiceTypeId, setSelectedFieldServiceTypeId] = useState<number | null>(null);
  const [selectedField, setSelectedField] = useState<ServiceTypeFieldDefinitionDto | null>(null);
  const [serviceTypeFormMode, setServiceTypeFormMode] =
    useState<ServiceTypeFormMode>('create');
  const [fieldFormMode, setFieldFormMode] =
    useState<ServiceTypeFieldFormMode>('create');
  const [localServiceTypes, setLocalServiceTypes] = useState<ServiceTypeDto[]>([]);
  const [serviceTypeFormOpened, serviceTypeFormHandlers] = useDisclosure(false);
  const [serviceTypeStatusOpened, serviceTypeStatusHandlers] = useDisclosure(false);
  const [fieldFormOpened, fieldFormHandlers] = useDisclosure(false);
  const [fieldStatusOpened, fieldStatusHandlers] = useDisclosure(false);

  const serviceTypesQuery = useAdminServiceTypes();
  const createServiceTypeMutation = useCreateAdminServiceType();
  const updateServiceTypeMutation = useUpdateAdminServiceType(selectedServiceType?.id);
  const disableServiceTypeMutation = useDisableAdminServiceType();
  const serviceTypeFieldsQuery = useGetServiceTypeFields(selectedFieldServiceTypeId ?? undefined);
  const createFieldMutation = useCreateServiceTypeField(selectedFieldServiceTypeId ?? undefined);
  const updateFieldMutation = useUpdateServiceTypeField(
    selectedFieldServiceTypeId ?? undefined,
    selectedField?.id,
  );
  const deactivateFieldMutation = useDeactivateServiceTypeField(
    selectedFieldServiceTypeId ?? undefined,
  );

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

  const serviceTypeOptions = useMemo(
    () =>
      serviceTypes.map((serviceType) => ({
        value: String(serviceType.id),
        label: serviceType.name,
      })),
    [serviceTypes],
  );

  const selectedFieldServiceType = useMemo(
    () =>
      serviceTypeFieldsQuery.data ??
      serviceTypes.find((serviceType) => serviceType.id === selectedFieldServiceTypeId) ??
      null,
    [selectedFieldServiceTypeId, serviceTypeFieldsQuery.data, serviceTypes],
  );

  const serviceTypeFields = useMemo(
    () => [...(serviceTypeFieldsQuery.data?.fieldDefinitions ?? [])].sort(sortFields),
    [serviceTypeFieldsQuery.data?.fieldDefinitions],
  );

  useEffect(() => {
    if (serviceTypes.length === 0) {
      setSelectedFieldServiceTypeId(null);
      return;
    }

    const selectionExists = serviceTypes.some(
      (serviceType) => serviceType.id === selectedFieldServiceTypeId,
    );

    if (!selectionExists) {
      setSelectedFieldServiceTypeId(serviceTypes[0].id);
    }
  }, [selectedFieldServiceTypeId, serviceTypes]);

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
    setServiceTypeFormMode('create');
    serviceTypeFormHandlers.open();
  };

  const handleEdit = (serviceType: ServiceTypeDto) => {
    createServiceTypeMutation.reset();
    updateServiceTypeMutation.reset();
    setSelectedServiceType(serviceType);
    setServiceTypeFormMode('edit');
    serviceTypeFormHandlers.open();
  };

  const handleDisable = (serviceType: ServiceTypeDto) => {
    disableServiceTypeMutation.reset();
    setSelectedServiceType(serviceType);
    serviceTypeStatusHandlers.open();
  };

  const handleCloseServiceTypeForm = () => {
    if (createServiceTypeMutation.isPending || updateServiceTypeMutation.isPending) {
      return;
    }

    createServiceTypeMutation.reset();
    updateServiceTypeMutation.reset();
    serviceTypeFormHandlers.close();
    setSelectedServiceType(null);
    setServiceTypeFormMode('create');
  };

  const handleCloseServiceTypeStatus = () => {
    if (disableServiceTypeMutation.isPending) {
      return;
    }

    disableServiceTypeMutation.reset();
    serviceTypeStatusHandlers.close();
    setSelectedServiceType(null);
  };

  const handleServiceTypeFormSuccess = (serviceType: ServiceTypeDto) => {
    syncLocalServiceType(serviceType);
    handleCloseServiceTypeForm();
    toast.success(
      serviceTypeFormMode === 'create'
        ? 'Tipo de servicio creado correctamente.'
        : 'Tipo de servicio actualizado correctamente.',
    );
  };

  const handleConfirmDisableServiceType = async () => {
    if (!selectedServiceType) {
      return;
    }

    try {
      await disableServiceTypeMutation.mutateAsync(selectedServiceType.id);
      syncLocalServiceType({ ...selectedServiceType, isActive: false });
      handleCloseServiceTypeStatus();
      toast.success('Tipo de servicio deshabilitado correctamente.');
    } catch {
      // El error se muestra dentro del modal.
    }
  };

  const handleCreateField = () => {
    if (selectedFieldServiceTypeId == null) {
      return;
    }

    createFieldMutation.reset();
    updateFieldMutation.reset();
    setSelectedField(null);
    setFieldFormMode('create');
    fieldFormHandlers.open();
  };

  const handleEditField = (field: ServiceTypeFieldDefinitionDto) => {
    createFieldMutation.reset();
    updateFieldMutation.reset();
    setSelectedField(field);
    setFieldFormMode('edit');
    fieldFormHandlers.open();
  };

  const handleDisableField = (field: ServiceTypeFieldDefinitionDto) => {
    deactivateFieldMutation.reset();
    setSelectedField(field);
    fieldStatusHandlers.open();
  };

  const handleCloseFieldForm = () => {
    if (createFieldMutation.isPending || updateFieldMutation.isPending) {
      return;
    }

    createFieldMutation.reset();
    updateFieldMutation.reset();
    fieldFormHandlers.close();
    setSelectedField(null);
    setFieldFormMode('create');
  };

  const handleCloseFieldStatus = () => {
    if (deactivateFieldMutation.isPending) {
      return;
    }

    deactivateFieldMutation.reset();
    fieldStatusHandlers.close();
    setSelectedField(null);
  };

  const handleFieldFormSuccess = () => {
    handleCloseFieldForm();
    toast.success(
      fieldFormMode === 'create'
        ? 'Campo creado correctamente.'
        : 'Campo actualizado correctamente.',
    );
  };

  const handleConfirmDisableField = async () => {
    if (!selectedField) {
      return;
    }

    try {
      await deactivateFieldMutation.mutateAsync(selectedField.id);
      handleCloseFieldStatus();
      toast.success('Campo deshabilitado correctamente.');
    } catch {
      // El error se muestra dentro del modal.
    }
  };

  return (
    <>
      <Stack gap="md">
        <Tabs
          value={activeTab}
          onChange={(value) => setActiveTab((value as AdminServiceTypesTab | null) ?? 'service-types')}
        >
          <Tabs.List>
            <Tabs.Tab value="service-types">Tipos de servicio</Tabs.Tab>
            <Tabs.Tab value="service-type-fields">Campos de servicio</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="service-types" pt="md">
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
          </Tabs.Panel>

          <Tabs.Panel value="service-type-fields" pt="md">
            <PageCard>
              {serviceTypes.length === 0 ? (
                <Alert color="yellow" variant="light">
                  Primero debes crear al menos un tipo de servicio para poder administrar sus
                  campos.
                </Alert>
              ) : (
                <Stack gap="md">
                  <Select
                    label="Tipo de servicio"
                    description="Selecciona el tipo de servicio sobre el que quieres configurar campos dinamicos."
                    data={serviceTypeOptions}
                    value={selectedFieldServiceTypeId != null ? String(selectedFieldServiceTypeId) : null}
                    onChange={(value) => {
                      setSelectedFieldServiceTypeId(value ? Number(value) : null);
                      setSelectedField(null);
                    }}
                    allowDeselect={false}
                  />

                  {selectedFieldServiceType ? (
                    <Text size="sm" c="dimmed">
                      Gestionando campos para <Text span fw={600} c="inherit">{selectedFieldServiceType.name}</Text>.
                    </Text>
                  ) : null}

                  {selectedFieldServiceTypeId == null ? (
                    <Alert color="yellow" variant="light">
                      Selecciona un tipo de servicio para administrar sus campos.
                    </Alert>
                  ) : (
                    <AdminServiceTypeFieldsTable
                      fields={serviceTypeFields}
                      isLoading={serviceTypeFieldsQuery.isLoading}
                      isFetching={serviceTypeFieldsQuery.isFetching}
                      isError={serviceTypeFieldsQuery.isError}
                      onRefetch={() => {
                        void serviceTypeFieldsQuery.refetch();
                      }}
                      resetPageKey={selectedFieldServiceTypeId}
                      onCreate={handleCreateField}
                      onEdit={handleEditField}
                      onDisable={handleDisableField}
                    />
                  )}
                </Stack>
              )}
            </PageCard>
          </Tabs.Panel>
        </Tabs>
      </Stack>

      <GenericModal
        opened={serviceTypeFormOpened}
        onClose={handleCloseServiceTypeForm}
        title={
          serviceTypeFormMode === 'create'
            ? 'Nuevo tipo de servicio'
            : 'Editar tipo de servicio'
        }
        size="lg"
      >
        {serviceTypeFormOpened ? (
          <AdminServiceTypeForm
            mode={serviceTypeFormMode}
            serviceType={selectedServiceType}
            createMutation={createServiceTypeMutation}
            updateMutation={updateServiceTypeMutation}
            onCancel={handleCloseServiceTypeForm}
            onSuccess={handleServiceTypeFormSuccess}
          />
        ) : null}
      </GenericModal>

      <GenericModal
        opened={serviceTypeStatusOpened}
        onClose={handleCloseServiceTypeStatus}
        title="Deshabilitar tipo de servicio"
      >
        {serviceTypeStatusOpened && selectedServiceType ? (
          <AdminStatusForm
            entityLabel="tipo de servicio"
            entityName={selectedServiceType.name}
            isActive={selectedServiceType.isActive}
            onCancel={handleCloseServiceTypeStatus}
            onConfirm={() => {
              void handleConfirmDisableServiceType();
            }}
            isPending={disableServiceTypeMutation.isPending}
            error={disableServiceTypeMutation.error}
          />
        ) : null}
      </GenericModal>

      <GenericModal
        opened={fieldFormOpened}
        onClose={handleCloseFieldForm}
        title={fieldFormMode === 'create' ? 'Nuevo campo de servicio' : 'Editar campo de servicio'}
        size="lg"
      >
        {fieldFormOpened ? (
          <AdminServiceTypeFieldForm
            mode={fieldFormMode}
            field={selectedField}
            existingFields={serviceTypeFields}
            createMutation={createFieldMutation}
            updateMutation={updateFieldMutation}
            onCancel={handleCloseFieldForm}
            onSuccess={handleFieldFormSuccess}
          />
        ) : null}
      </GenericModal>

      <GenericModal
        opened={fieldStatusOpened}
        onClose={handleCloseFieldStatus}
        title="Deshabilitar campo"
      >
        {fieldStatusOpened && selectedField ? (
          <AdminStatusForm
            entityLabel="campo"
            entityName={selectedField.label}
            isActive={selectedField.isActive}
            onCancel={handleCloseFieldStatus}
            onConfirm={() => {
              void handleConfirmDisableField();
            }}
            isPending={deactivateFieldMutation.isPending}
            error={deactivateFieldMutation.error}
          />
        ) : null}
      </GenericModal>
    </>
  );
}
