import { Badge, Stack, Text } from '@mantine/core';
import { GenericTable, type SortState, type TableColumn } from 'shared/components/generic-table';
import { compareLocalDateTime, formatDateTime, formatTime } from 'shared/utils';
import { getAppointmentStatusColor, getAppointmentStatusLabel } from '../utils';
import type { HistoryAppointmentViewModel } from '../viewmodel/history-appointment-view-model';

interface HistoryTableProps {
  data: HistoryAppointmentViewModel[];
  loading?: boolean;
  fetching?: boolean;
  isError?: boolean;
  onRefetch?: () => void;
}

const columns: TableColumn<HistoryAppointmentViewModel>[] = [
  {
    key: 'startDateTime',
    title: 'Fecha',
    accessor: 'startDateTime',
    sortable: true,
    noWrap: true,
    render: (row) => formatDateTime(row.startDateTime),
  },
  {
    key: 'timeRange',
    title: 'Horario',
    render: (row) => `${formatTime(row.startDateTime)} - ${formatTime(row.endDateTime)}`,
    noWrap: true,
  },
  {
    key: 'clientName',
    title: 'Cliente',
    accessor: 'clientName',
    sortable: true,
    render: (row) => (
      <Stack gap={2}>
        <Text size="sm">{row.clientName}</Text>
        <Text size="xs" c="dimmed">
          {row.clientPhone}
          {row.clientEmail ? ` | ${row.clientEmail}` : ''}
        </Text>
      </Stack>
    ),
  },
  {
    key: 'serviceName',
    title: 'Servicio',
    accessor: 'serviceName',
    sortable: true,
  },
  {
    key: 'secretaryName',
    title: 'Secretario/a',
    accessor: 'secretaryName',
    sortable: true,
  },
  {
    key: 'status',
    title: 'Estado',
    accessor: 'status',
    sortable: true,
    noWrap: true,
    render: (row) => (
      <Badge color={getAppointmentStatusColor(row.status)} variant="light">
        {getAppointmentStatusLabel(row.status)}
      </Badge>
    ),
  },
  {
    key: 'detail',
    title: 'Detalle',
    accessor: 'detail',
    render: (row) => row.detail,
  },
];

const historySortFn = (
  a: HistoryAppointmentViewModel,
  b: HistoryAppointmentViewModel,
  sort: SortState,
) => {
  if (!sort.columnKey) return 0;

  let cmp = 0;

  switch (sort.columnKey) {
    case 'startDateTime':
      cmp = compareLocalDateTime(a.startDateTime, b.startDateTime);
      break;
    case 'clientName':
      cmp = a.clientName.localeCompare(b.clientName, 'es-AR');
      break;
    case 'serviceName':
      cmp = a.serviceName.localeCompare(b.serviceName, 'es-AR');
      break;
    case 'secretaryName':
      cmp = a.secretaryName.localeCompare(b.secretaryName, 'es-AR');
      break;
    case 'status':
      cmp = getAppointmentStatusLabel(a.status).localeCompare(
        getAppointmentStatusLabel(b.status),
        'es-AR',
      );
      break;
    default:
      cmp = 0;
  }

  return sort.direction === 'asc' ? cmp : -cmp;
};

export function HistoryTable({
  data,
  loading = false,
  fetching = false,
  isError = false,
  onRefetch,
}: HistoryTableProps) {
  return (
    <GenericTable
      data={data}
      columns={columns}
      rowKey="id"
      loading={loading}
      fetching={fetching}
      isRequestError={isError}
      onHandleTableRefetch={onRefetch}
      titleRefetchMessage="No se pudo cargar el historico de turnos."
      defaultSort={{ columnKey: 'startDateTime', direction: 'desc' }}
      sortFn={historySortFn}
      showPaginator
      pageSize={10}
      minWidth={1180}
      emptyMessage="No hay turnos historicos que coincidan con los filtros seleccionados."
    />
  );
}
