import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { GenericTable, type SortState } from 'shared/components/generic-table';
import type { AppointmentViewModel } from '../viewmodel';
import { useGetAppointments } from '../hooks/appointments.hook';
import { appointmentColumns } from '../defaults';

const appointmentSortFn = (
  a: AppointmentViewModel,
  b: AppointmentViewModel,
  sort: SortState,
): number => {
  if (!sort.columnKey) return 0;

  let cmp = 0;

  switch (sort.columnKey) {
    case 'dateLabel':
      cmp = new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime();
      break;
    case 'clientName':
      cmp = a.clientName.localeCompare(b.clientName, 'es-AR');
      break;
    case 'status':
      cmp = a.status.localeCompare(b.status, 'es-AR');
      break;
    case 'durationMinutes':
      cmp = a.durationMinutes - b.durationMinutes;
      break;
    default:
      cmp = 0;
  }

  return sort.direction === 'asc' ? cmp : -cmp;
};

interface AppointmentTableProps {
  onDelete?: (row: AppointmentViewModel) => void;
}

export function AppointmentTable({ onDelete }: AppointmentTableProps) {
  const { data = [], isLoading, isFetching, refetch, isError } = useGetAppointments();

  return (
    <GenericTable<AppointmentViewModel>
      data={data}
      columns={appointmentColumns}
      rowKey="id"
      defaultSort={{ columnKey: 'dateLabel', direction: 'asc' }}
      sortFn={appointmentSortFn}
      showPaginator
      pageSize={10}
      pageSizeOptions={[5, 10, 20, 50]}
      showSearch
      searchPlaceholder="Buscar por fecha, cliente, teléfono..."
      loading={isLoading}
      fetching={isFetching}
      emptyMessage="No hay turnos registrados"
      isRequestError={isError}
      titleRefetchMessage="Error al cargar los turnos."
      onHandleTableRefetch={refetch}
      minWidth={750}
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
