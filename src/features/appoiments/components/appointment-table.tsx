import {
  faPen,
  faCalendarDays,
  faBan,
  faCircleCheck,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon, Group, Tooltip } from '@mantine/core';
import type { TableColumn } from 'shared/components/generic-table';
import { GenericTable, type SortState } from 'shared/components/generic-table';
import { compareLocalDateTime } from 'shared/utils';

import {
  getAppointmentActionVisibility,
  type AppointmentActionPermissions,
} from '../utils';
import type { AppointmentViewModel } from '../viewmodel';

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
  columns: TableColumn<AppointmentViewModel>[];
  isLoading: boolean;
  isFetching: boolean;
  onRefetch: () => void;
  isError: boolean;
  onEdit: (row: AppointmentViewModel) => void;
  onReschedule: (row: AppointmentViewModel) => void;
  onCancel: (row: AppointmentViewModel) => void;
  onMarkAsAttended: (row: AppointmentViewModel) => void;
  onMarkAsNoShow: (row: AppointmentViewModel) => void;
  permissions: AppointmentActionPermissions;
  emptyMessage?: string;
  resetPageKey?: string;
}

export function AppointmentTable({
  appointmentData,
  columns,
  isLoading,
  isFetching,
  onRefetch,
  isError,
  onEdit,
  onReschedule,
  onCancel,
  onMarkAsAttended,
  onMarkAsNoShow,
  permissions,
  emptyMessage,
  resetPageKey,
}: AppointmentTableProps) {
  const hasVisibleActions =
    permissions.canEdit ||
    permissions.canReschedule ||
    permissions.canCancel ||
    permissions.canMarkAttendance;

  return (
    <GenericTable<AppointmentViewModel>
      data={appointmentData}
      columns={columns}
      rowKey="id"
      defaultSort={{ columnKey: 'dateLabel', direction: 'asc' }}
      sortFn={appointmentSortFn}
      showPaginator
      pageSize={10}
      resetPageKey={resetPageKey}
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
          ...row.extraFields
            .map((field) => field.value)
            .filter((value) => value && value !== '-'),
        ].some((field) => field.toLowerCase().includes(value));
      }}
      loading={isLoading}
      fetching={isFetching}
      emptyMessage={emptyMessage ?? 'No hay turnos registrados'}
      isRequestError={isError}
      titleRefetchMessage="Error al cargar los turnos del dia."
      onHandleTableRefetch={onRefetch}
      minWidth={Math.max(900, columns.length * 160)}
      columnOfActions={
        hasVisibleActions
          ? {
              header: 'Acciones',
              width: 220,
              textAlign: 'center',
              render: (row) => {
                const actions = getAppointmentActionVisibility(row, permissions);

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

                    {actions.canShowMarkAsAttended && (
                      <Tooltip
                        label={actions.markAttendanceDisabledReason ?? 'Marcar asistió'}
                        withArrow
                      >
                        <div>
                          <ActionIcon
                            color="green"
                            variant="subtle"
                            disabled={!actions.canMarkAsAttended}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (actions.canMarkAsAttended) {
                                onMarkAsAttended(row);
                              }
                            }}
                          >
                            <FontAwesomeIcon icon={faCircleCheck} />
                          </ActionIcon>
                        </div>
                      </Tooltip>
                    )}

                    {actions.canShowMarkAsNoShow && (
                      <Tooltip
                        label={actions.markAttendanceDisabledReason ?? 'Marcar no asistió'}
                        withArrow
                      >
                        <div>
                          <ActionIcon
                            color="orange"
                            variant="subtle"
                            disabled={!actions.canMarkAsNoShow}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (actions.canMarkAsNoShow) {
                                onMarkAsNoShow(row);
                              }
                            }}
                          >
                            <FontAwesomeIcon icon={faCircleXmark} />
                          </ActionIcon>
                        </div>
                      </Tooltip>
                    )}
                  </Group>
                );
              },
            }
          : undefined
      }
    />
  );
}
