import { GenericTable, type SortState } from 'shared/components/generic-table';
import { compareLocalDateTime } from 'shared/utils';
import { getAppointmentStatusLabel } from '../utils';
import { historyColumns } from '../defaults';
import type { HistoryAppointmentViewModel } from '../viewmodel/history-appointment-view-model';

interface HistoryTableProps {
  data: HistoryAppointmentViewModel[];
  loading?: boolean;
  fetching?: boolean;
  isError?: boolean;
  onRefetch?: () => void;
}

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

const historySearchFn = (row: HistoryAppointmentViewModel, query: string) => {
  const value = query.trim().toLowerCase();

  return [row.clientName, row.clientPhone, row.clientEmail ?? ''].some((field) =>
    field.toLowerCase().includes(value),
  );
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
      columns={historyColumns}
      rowKey="id"
      loading={loading}
      fetching={fetching}
      isRequestError={isError}
      onHandleTableRefetch={onRefetch}
      titleRefetchMessage="No se pudo cargar el historico de turnos."
      defaultSort={{ columnKey: 'startDateTime', direction: 'desc' }}
      sortFn={historySortFn}
      showSearch
      searchPlaceholder="Buscar por nombre, telefono o email"
      searchFn={historySearchFn}
      showPaginator
      pageSize={10}
      minWidth={1180}
      emptyMessage="No hay turnos historicos que coincidan con los filtros seleccionados."
    />
  );
}
