import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPen,
  faCalendarDays,
  faBan,
  faCircleCheck,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import { GenericTable, type SortState } from 'shared/components/generic-table';
import { compareLocalDateTime } from 'shared/utils';
import type { AppointmentViewModel } from '../viewmodel';
import { appointmentColumns } from '../defaults';
import { getAppointmentActionVisibility } from '../utils';

const appointmentSortFn = (
  a: AppointmentViewModel,
  b: AppointmentViewModel,
  sort: SortState,
): number => {
  if (!sort.columnKey) return 0;

  let cmp = 0;

  switch (sort.columnKey) {
    case 'dateLabel':
      cmp = compareLocalDateTime(a.startDateTime, b.startDateTime);
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
  appointmentData: AppointmentViewModel[];
  isLoading: boolean;
  isFetching: boolean;
  onRefetch: () => void;
  isError: boolean;
  onEdit: (row: AppointmentViewModel) => void;
  onReschedule: (row: AppointmentViewModel) => void;
  onCancel: (row: AppointmentViewModel) => void;
  onMarkAsAttended: (row: AppointmentViewModel) => void;
  onMarkAsNoShow: (row: AppointmentViewModel) => void;
  emptyMessage?: string;
}

export function AppointmentTable({
  appointmentData,
  isLoading,
  isFetching,
  onRefetch,
  isError,
  onEdit,
  onReschedule,
  onCancel,
  onMarkAsAttended,
  onMarkAsNoShow,
  emptyMessage,
}: AppointmentTableProps) {
  return (
    <GenericTable<AppointmentViewModel>
      data={appointmentData}
      columns={appointmentColumns}
      rowKey="id"
      defaultSort={{ columnKey: 'dateLabel', direction: 'asc' }}
      sortFn={appointmentSortFn}
      showPaginator
      pageSize={10}
      pageSizeOptions={[5, 10, 20, 50]}
      showSearch
      searchPlaceholder="Buscar por cliente, telefono o email..."
      searchFn={(row, query) => {
        const value = query.toLowerCase();

        return [
          row.clientName,
          row.clientPhone,
          row.clientEmail ?? '',
          row.dateLabel,
          row.timeLabel,
          row.status,
        ].some((field) => field.toLowerCase().includes(value));
      }}
      loading={isLoading}
      fetching={isFetching}
      emptyMessage={emptyMessage ?? 'No hay turnos registrados'}
      isRequestError={isError}
      titleRefetchMessage="Error al cargar los turnos del dia."
      onHandleTableRefetch={onRefetch}
      minWidth={900}
      columnOfActions={{
        width: 220,
        textAlign: 'center',
        render: (row) => {
          const actions = getAppointmentActionVisibility(row);

          return (
            <Group justify="center" gap="xs">
              {actions.canEdit && (
                <Tooltip label="Editar" withArrow>
                  <ActionIcon
                    variant="subtle"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(row);
                    }}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </ActionIcon>
                </Tooltip>
              )}

              {actions.canReschedule && (
                <Tooltip label="Reprogramar" withArrow>
                  <ActionIcon
                    variant="subtle"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReschedule(row);
                    }}
                  >
                    <FontAwesomeIcon icon={faCalendarDays} />
                  </ActionIcon>
                </Tooltip>
              )}

              {actions.canCancel && (
                <Tooltip label="Cancelar" withArrow>
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancel(row);
                    }}
                  >
                    <FontAwesomeIcon icon={faBan} />
                  </ActionIcon>
                </Tooltip>
              )}

              {actions.canMarkAsAttended && (
                <Tooltip label="Marcar asistio" withArrow>
                  <ActionIcon
                    color="green"
                    variant="subtle"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsAttended(row);
                    }}
                  >
                    <FontAwesomeIcon icon={faCircleCheck} />
                  </ActionIcon>
                </Tooltip>
              )}

              {actions.canMarkAsNoShow && (
                <Tooltip label="Marcar no asistio" withArrow>
                  <ActionIcon
                    color="orange"
                    variant="subtle"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsNoShow(row);
                    }}
                  >
                    <FontAwesomeIcon icon={faCircleXmark} />
                  </ActionIcon>
                </Tooltip>
              )}
            </Group>
          );
        },
      }}
    />
  );
}
