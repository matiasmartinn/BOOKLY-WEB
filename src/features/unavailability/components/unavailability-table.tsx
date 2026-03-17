import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useScheduleUnavailability } from '../hooks/unavailability.hook';
import { GenericTable, type SortState } from 'shared/components/generic-table';
import { unavailabilityColumns } from '../defaults/unavailability.columns';
import type { UnavailabilityViewModel } from '../viewmodel';

// ─── Sort personalizado ───────────────────────────────────────────────────────

// const unavailabilitySortFn = (
//   a: UnavailabilityViewModel,
//   b: UnavailabilityViewModel,
//   sort: SortState,
// ): number => {
//   if (!sort.columnKey) return 0;

//   let cmp = 0;

//   switch (sort.columnKey) {
//     case 'dateLabel':
//       cmp = a.startDate.getTime() - b.startDate.getTime();
//       break;
//     case 'totalDays':
//       cmp = a.totalDays - b.totalDays;
//       break;
//     case 'reason':
//       cmp = (a.reason ?? '').localeCompare(b.reason ?? '', 'es-AR');
//       break;
//     default:
//       cmp = 0;
//   }

//   return sort.direction === 'asc' ? cmp : -cmp;
// };

interface UnavailabilityTableProps {
  onDelete?: (row: UnavailabilityViewModel) => void;
}

export function UnavailabilityTable({ onDelete }: UnavailabilityTableProps) {
  const { data = [], isLoading, isFetching, refetch, isError } = useScheduleUnavailability();

  return (
    <GenericTable<UnavailabilityViewModel>
      data={data}
      columns={unavailabilityColumns}
      rowKey="id"
      defaultSort={{ columnKey: 'dateLabel', direction: 'asc' }}
      // sortFn={unavailabilitySortFn}
      showPaginator
      pageSize={10}
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
