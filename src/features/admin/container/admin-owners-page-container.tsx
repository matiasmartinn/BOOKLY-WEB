import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Group, Select, SimpleGrid, Stack, TextInput } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDebouncedValue } from '@mantine/hooks';
import { useMemo, useState } from 'react';
import { GenericModal } from 'shared/components';
import { PageCard } from 'shared/layout';

import { AdminOwnersTable, AdminStatusForm } from '../components';
import { ADMIN_OWNER_STATUS_OPTIONS, ADMIN_PLAN_OPTIONS } from '../defaults';
import { useAdminOwners, useDisableOwner, useEnableOwner } from '../hooks';
import type { AdminOwnerListItemDto, AdminOwnersQueryDto } from '../models';

interface OwnerFiltersState {
  search: string;
  status: string | null;
  plan: string | null;
  createdFrom: string | null;
  createdTo: string | null;
}

const initialFilters: OwnerFiltersState = {
  search: '',
  status: null,
  plan: null,
  createdFrom: null,
  createdTo: null,
};

const normalizeFilter = (value?: string | null) => value?.trim() || undefined;

export function AdminOwnersPageContainer() {
  const [filters, setFilters] = useState<OwnerFiltersState>(initialFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedOwner, setSelectedOwner] = useState<AdminOwnerListItemDto | null>(null);
  const [debouncedSearch] = useDebouncedValue(filters.search, 300);

  const ownersQueryParams = useMemo<AdminOwnersQueryDto>(
    () => ({
      search: normalizeFilter(debouncedSearch),
      status: (normalizeFilter(filters.status) as AdminOwnersQueryDto['status']) ?? undefined,
      plan: normalizeFilter(filters.plan),
      createdFrom: filters.createdFrom ?? undefined,
      createdTo: filters.createdTo ?? undefined,
      page,
      pageSize,
    }),
    [
      debouncedSearch,
      filters.createdFrom,
      filters.createdTo,
      filters.plan,
      filters.status,
      page,
      pageSize,
    ],
  );

  const ownersQuery = useAdminOwners(ownersQueryParams);
  const enableOwnerMutation = useEnableOwner();
  const disableOwnerMutation = useDisableOwner();

  const activeMutation = selectedOwner?.isActive ? disableOwnerMutation : enableOwnerMutation;

  const handleFilterChange = <K extends keyof OwnerFiltersState>(
    key: K,
    value: OwnerFiltersState[K],
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

    enableOwnerMutation.reset();
    disableOwnerMutation.reset();
    setSelectedOwner(null);
  };

  const handleConfirmStatus = async () => {
    if (!selectedOwner) {
      return;
    }

    try {
      if (selectedOwner.isActive) {
        await disableOwnerMutation.mutateAsync(selectedOwner.id);
      } else {
        await enableOwnerMutation.mutateAsync(selectedOwner.id);
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
            <SimpleGrid cols={{ base: 1, md: 2, xl: 5 }} spacing="sm">
              <TextInput
                label="Buscar"
                placeholder="Nombre o email"
                value={filters.search}
                onChange={(event) => {
                  handleFilterChange('search', event.currentTarget.value);
                }}
                leftSection={<FontAwesomeIcon icon={faSearch} />}
              />

              <Select
                label="Estado"
                placeholder="Todos"
                data={ADMIN_OWNER_STATUS_OPTIONS}
                value={filters.status}
                onChange={(value) => {
                  handleFilterChange('status', value);
                }}
                clearable
              />

              <Select
                label="Plan"
                placeholder="Todos"
                data={ADMIN_PLAN_OPTIONS}
                value={filters.plan}
                onChange={(value) => {
                  handleFilterChange('plan', value);
                }}
                clearable
              />

              <DatePickerInput
                label="Alta desde"
                placeholder="Seleccionar"
                value={filters.createdFrom}
                onChange={(value) => {
                  handleFilterChange('createdFrom', value);
                }}
                valueFormat="DD/MM/YYYY"
                clearable
              />

              <DatePickerInput
                label="Alta hasta"
                placeholder="Seleccionar"
                value={filters.createdTo}
                onChange={(value) => {
                  handleFilterChange('createdTo', value);
                }}
                valueFormat="DD/MM/YYYY"
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
          <AdminOwnersTable
            owners={ownersQuery.data?.items ?? []}
            page={ownersQuery.data?.page ?? page}
            pageSize={ownersQuery.data?.pageSize ?? pageSize}
            totalCount={ownersQuery.data?.totalCount ?? 0}
            isLoading={ownersQuery.isLoading}
            isFetching={ownersQuery.isFetching}
            isError={ownersQuery.isError}
            onRefetch={() => {
              void ownersQuery.refetch();
            }}
            onPageChange={setPage}
            onPageSizeChange={(nextPageSize) => {
              setPageSize(nextPageSize);
              setPage(1);
            }}
            onToggleStatus={setSelectedOwner}
          />
        </PageCard>
      </Stack>

      <GenericModal
        opened={selectedOwner != null}
        onClose={closeModal}
        title={
          selectedOwner
            ? `${selectedOwner.isActive ? 'Deshabilitar' : 'Habilitar'} owner`
            : 'Actualizar owner'
        }
      >
        {selectedOwner ? (
          <AdminStatusForm
            entityLabel="owner"
            entityName={selectedOwner.fullName}
            isActive={selectedOwner.isActive}
            onCancel={closeModal}
            onConfirm={() => {
              void handleConfirmStatus();
            }}
            isPending={activeMutation.isPending}
            error={activeMutation.error}
            activationBlockedReason={
              !selectedOwner.isActive &&
              selectedOwner.accountStatus === 'pending_email_confirmation'
                ? 'El owner debe confirmar el email antes de poder habilitarse.'
                : undefined
            }
          />
        ) : null}
      </GenericModal>
    </>
  );
}
