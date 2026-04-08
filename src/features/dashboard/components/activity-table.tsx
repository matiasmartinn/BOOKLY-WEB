import { GenericTable, type SortState } from 'shared/components';
import { compareLocalDateTime } from 'shared/utils';
import { activityColumns } from '../defaults';
import type { ActivityEventViewModel } from '../viewmodel/activity-event-view-model';

interface ActivityTableProps {
  data: ActivityEventViewModel[];
  loading?: boolean;
  fetching?: boolean;
  isError?: boolean;
  onRefetch?: () => void;
}

const activitySortFn = (a: ActivityEventViewModel, b: ActivityEventViewModel, sort: SortState) => {
  if (!sort.columnKey) return 0;

  let comparison = 0;

  switch (sort.columnKey) {
    case 'eventDateTime':
      comparison = compareLocalDateTime(a.eventDateTime, b.eventDateTime);
      break;
    case 'clientName':
      comparison = a.clientName.localeCompare(b.clientName, 'es-AR');
      break;
    case 'status':
      comparison = a.status.localeCompare(b.status, 'es-AR');
      break;
    case 'eventType':
      comparison = a.eventType.localeCompare(b.eventType, 'es-AR');
      break;
    case 'actorLabel':
      comparison = a.actorLabel.localeCompare(b.actorLabel, 'es-AR');
      break;
    default:
      comparison = 0;
  }

  return sort.direction === 'asc' ? comparison : -comparison;
};

export function ActivityTable({
  data,
  loading = false,
  fetching = false,
  isError = false,
  onRefetch,
}: ActivityTableProps) {
  return (
    <GenericTable
      data={data}
      columns={activityColumns}
      rowKey="id"
      loading={loading}
      fetching={fetching}
      isRequestError={isError}
      onHandleTableRefetch={onRefetch}
      titleRefetchMessage="No se pudieron cargar los eventos del servicio."
      defaultSort={{ columnKey: 'eventDateTime', direction: 'desc' }}
      sortFn={activitySortFn}
      showSearch
      showPaginator
      pageSize={10}
      minWidth={980}
      emptyMessage="Todavia no hay eventos para mostrar."
      searchPlaceholder="Buscar por evento, cliente, actor o estado"
      searchFn={(row, query) => {
        const value = query.toLowerCase();
        return [
          row.eventType,
          row.clientName,
          row.clientEmail ?? '',
          row.actorLabel,
          row.status,
          row.appointmentDateLabel,
        ].some((field) => field.toLowerCase().includes(value));
      }}
    />
  );
}
