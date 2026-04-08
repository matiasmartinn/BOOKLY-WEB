import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheck } from '@fortawesome/free-solid-svg-icons';
import { GenericTable } from 'shared/components';
import type { AdminOwnerListItemDto } from '../models';
import { adminOwnerColumns } from '../defaults';

interface AdminOwnersTableProps {
  owners: AdminOwnerListItemDto[];
  page: number;
  pageSize: number;
  totalCount: number;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRefetch: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onToggleStatus: (owner: AdminOwnerListItemDto) => void;
}

export function AdminOwnersTable({
  owners,
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
}: AdminOwnersTableProps) {
  return (
    <GenericTable
      data={owners}
      columns={adminOwnerColumns}
      rowKey="id"
      loading={isLoading}
      fetching={isFetching}
      isRequestError={isError}
      onHandleTableRefetch={onRefetch}
      titleRefetchMessage="No se pudo cargar el listado de owners."
      showPaginator
      minWidth={1120}
      emptyMessage="No hay owners para los filtros aplicados."
      pageSizeOptions={[10, 20, 50]}
      serverPagination={{
        page,
        pageSize,
        total: totalCount,
        onPageChange,
        onPageSizeChange,
      }}
      columnOfActions={{
        width: 120,
        textAlign: 'center',
        render: (row) => {
          const activationBlocked =
            !row.isActive && row.accountStatus === 'pending_email_confirmation';

          const tooltipLabel = row.isActive
            ? 'Deshabilitar owner'
            : activationBlocked
              ? 'Debe confirmar el email antes de habilitarse'
              : 'Habilitar owner';

          return (
            <Group justify="center" gap="xs">
              <Tooltip label={tooltipLabel} withArrow>
                <div>
                  <ActionIcon
                    variant="subtle"
                    color={row.isActive ? 'red' : 'green'}
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleStatus(row);
                    }}
                    disabled={activationBlocked}
                  >
                    <FontAwesomeIcon icon={row.isActive ? faBan : faCheck} />
                  </ActionIcon>
                </div>
              </Tooltip>
            </Group>
          );
        },
      }}
    />
  );
}
