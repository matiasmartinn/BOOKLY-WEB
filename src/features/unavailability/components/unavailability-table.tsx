import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { GenericTable } from 'shared/components/generic-table';

import { unavailabilityColumns } from '../defaults';
import { useScheduleUnavailability } from '../hooks';
import type { UnavailabilityViewModel } from '../viewmodel';

interface UnavailabilityTableProps {
  onDelete?: (row: UnavailabilityViewModel) => void;
  resetPageKey?: string | number | null;
}

export function UnavailabilityTable({ onDelete, resetPageKey }: UnavailabilityTableProps) {
  const { data = [], isLoading, isFetching, refetch, isError } = useScheduleUnavailability();

  return (
    <GenericTable<UnavailabilityViewModel>
      data={data}
      columns={unavailabilityColumns}
      rowKey="id"
      defaultSort={{ columnKey: 'dateLabel', direction: 'asc' }}
      showPaginator
      pageSize={10}
      resetPageKey={resetPageKey}
      pageSizeOptions={[5, 10, 20, 50]}
      showSearch
      searchPlaceholder="Buscar por fecha, motivo..."
      loading={isLoading}
      fetching={isFetching}
      emptyMessage="No hay inhabilitaciones registradas"
      isRequestError={isError}
      titleRefetchMessage="Error al cargar las inhabilitaciones."
      onHandleTableRefetch={refetch}
      minWidth={600}
      columnOfActions={
        onDelete
          ? {
              width: 56,
              textAlign: 'center',
              render: (row) => (
                <Group justify="center">
                  <Tooltip label="Eliminar" withArrow>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(row);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              ),
            }
          : undefined
      }
    />
  );
}
