import { faBan, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { GenericTable } from 'shared/components';

import { adminServiceColumns } from '../defaults';
import type { AdminServiceListItemDto } from '../models';

interface AdminServicesTableProps {
  services: AdminServiceListItemDto[];
  page: number;
  pageSize: number;
  totalCount: number;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRefetch: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onToggleStatus: (service: AdminServiceListItemDto) => void;
}

export function AdminServicesTable({
  services,
  page,
  pageSize,
  totalCount,
  isLoading,
  isFetching,
  isError,
  onRefetch,
  onPageChange,
  onPageSizeChange,
  onToggleStatus,
}: AdminServicesTableProps) {
  return (
    <GenericTable
      data={services}
      columns={adminServiceColumns}
      rowKey="id"
      loading={isLoading}
      fetching={isFetching}
      isRequestError={isError}
      onHandleTableRefetch={onRefetch}
      titleRefetchMessage="No se pudo cargar el listado de servicios."
      showPaginator
      minWidth={1160}
      emptyMessage="No hay servicios para los filtros aplicados."
      pageSizeOptions={[10, 20, 50]}
      serverPagination={{
        page,
        pageSize,
        total: totalCount,
        onPageChange,
        onPageSizeChange,
      }}
      columnOfActions={{
        header: 'Acciones',
        width: 120,
        textAlign: 'center',
        render: (row) => (
          <Group justify="center" gap="xs">
            <Tooltip
              label={row.isActive ? 'Deshabilitar servicio' : 'Habilitar servicio'}
              withArrow
            >
              <ActionIcon
                variant="subtle"
                color={row.isActive ? 'red' : 'green'}
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleStatus(row);
                }}
              >
                <FontAwesomeIcon icon={row.isActive ? faBan : faCheck} />
              </ActionIcon>
            </Tooltip>
          </Group>
        ),
      }}
    />
  );
}
