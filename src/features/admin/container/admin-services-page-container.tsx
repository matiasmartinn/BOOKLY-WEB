import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Group, Select, SimpleGrid, Stack, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useMemo, useState } from 'react';
import { GenericModal } from 'shared/components';
import { PageCard } from 'shared/layout';

import { AdminServicesTable, AdminStatusForm } from '../components';
import { ADMIN_PLAN_OPTIONS, ADMIN_SERVICE_STATUS_OPTIONS } from '../defaults';
import {
  useAdminServices,
  useDisableService,
  useEnableService,
} from '../hooks';
import type { AdminServiceListItemDto, AdminServicesQueryDto } from '../models';

interface ServiceFiltersState {
  search: string;
  status: string | null;
  ownerSearch: string;
  plan: string | null;
}

const initialFilters: ServiceFiltersState = {
  search: '',
  status: null,
  ownerSearch: '',
  plan: null,
};

const normalizeFilter = (value?: string | null) => value?.trim() || undefined;

export function AdminServicesPageContainer() {
  const [filters, setFilters] = useState<ServiceFiltersState>(initialFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedService, setSelectedService] = useState<AdminServiceListItemDto | null>(null);
  const [debouncedSearch] = useDebouncedValue(filters.search, 300);
  const [debouncedOwnerSearch] = useDebouncedValue(filters.ownerSearch, 300);

  const servicesQueryParams = useMemo<AdminServicesQueryDto>(
    () => ({
      search: normalizeFilter(debouncedSearch),
      status: (normalizeFilter(filters.status) as AdminServicesQueryDto['status']) ?? undefined,
      ownerSearch: normalizeFilter(debouncedOwnerSearch),
      plan: normalizeFilter(filters.plan),
      page,
      pageSize,
    }),
    [debouncedOwnerSearch, debouncedSearch, filters.plan, filters.status, page, pageSize],
  );

  const servicesQuery = useAdminServices(servicesQueryParams);
  const enableServiceMutation = useEnableService();
  const disableServiceMutation = useDisableService();

  const activeMutation = selectedService?.isActive ? disableServiceMutation : enableServiceMutation;

  const handleFilterChange = <K extends keyof ServiceFiltersState>(
    key: K,
    value: ServiceFiltersState[K],
  ) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setPage(1);
  };

  const closeModal = () => {
    if (activeMutation.isPending) {
      return;
    }

    enableServiceMutation.reset();
    disableServiceMutation.reset();
    setSelectedService(null);
  };

  const handleConfirmStatus = async () => {
    if (!selectedService) {
      return;
    }

    try {
      if (selectedService.isActive) {
        await disableServiceMutation.mutateAsync(selectedService.id);
      } else {
        await enableServiceMutation.mutateAsync(selectedService.id);
      }

      closeModal();
    } catch {
      // El error se muestra dentro del modal.
    }
  };

  return (
    <>
      <Stack gap="md">
        <PageCard>
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, md: 2, xl: 4 }} spacing="sm">
              <TextInput
                label="Buscar servicio"
                placeholder="Nombre o slug"
                value={filters.search}
                onChange={(event) => {
                  handleFilterChange('search', event.currentTarget.value);
                }}
                leftSection={<FontAwesomeIcon icon={faSearch} />}
              />

              <TextInput
                label="Buscar owner"
                placeholder="Nombre o email"
                value={filters.ownerSearch}
                onChange={(event) => {
                  handleFilterChange('ownerSearch', event.currentTarget.value);
                }}
                leftSection={<FontAwesomeIcon icon={faSearch} />}
              />

              <Select
                label="Estado"
                placeholder="Todos"
                data={ADMIN_SERVICE_STATUS_OPTIONS}
                value={filters.status}
                onChange={(value) => {
                  handleFilterChange('status', value);
                }}
                clearable
              />

              <Select
                label="Plan owner"
                placeholder="Todos"
                data={ADMIN_PLAN_OPTIONS}
                value={filters.plan}
                onChange={(value) => {
                  handleFilterChange('plan', value);
                }}
                clearable
              />
            </SimpleGrid>

            <Group justify="flex-end">
              <Button variant="default" onClick={handleClearFilters}>
                Limpiar filtros
              </Button>
            </Group>
          </Stack>
        </PageCard>

        <PageCard>
          <AdminServicesTable
            services={servicesQuery.data?.items ?? []}
            page={servicesQuery.data?.page ?? page}
            pageSize={servicesQuery.data?.pageSize ?? pageSize}
            totalCount={servicesQuery.data?.totalCount ?? 0}
            isLoading={servicesQuery.isLoading}
            isFetching={servicesQuery.isFetching}
            isError={servicesQuery.isError}
            onRefetch={() => {
              void servicesQuery.refetch();
            }}
            onPageChange={setPage}
            onPageSizeChange={(nextPageSize) => {
              setPageSize(nextPageSize);
              setPage(1);
            }}
            onToggleStatus={setSelectedService}
          />
        </PageCard>
      </Stack>

      <GenericModal
        opened={selectedService != null}
        onClose={closeModal}
        title={
          selectedService
            ? `${selectedService.isActive ? 'Deshabilitar' : 'Habilitar'} servicio`
            : 'Actualizar servicio'
        }
      >
        {selectedService ? (
          <AdminStatusForm
            entityLabel="servicio"
            entityName={selectedService.name}
            isActive={selectedService.isActive}
            onCancel={closeModal}
            onConfirm={() => {
              void handleConfirmStatus();
            }}
            isPending={activeMutation.isPending}
            error={activeMutation.error}
          />
        ) : null}
      </GenericModal>
    </>
  );
}
