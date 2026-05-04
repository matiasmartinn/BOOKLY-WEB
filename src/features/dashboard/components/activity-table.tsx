import { GenericTable, type SortState } from 'shared/components';
import { compareLocalDateTime, formatDateOnly, formatTime } from 'shared/utils';

import { activityColumns } from '../defaults';
import type { ActivityEventViewModel } from '../viewmodel/activity-event-view-model';

interface ActivityTableProps {
  data: ActivityEventViewModel[];
  loading?: boolean;
  fetching?: boolean;
  isError?: boolean;
  onRefetch?: () => void;
  resetPageKey?: string | number | null;
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
  resetPageKey,
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
      resetPageKey={resetPageKey}
      minWidth={1120}
      emptyMessage="Todavia no hay eventos para mostrar."
      searchPlaceholder="Buscar por cliente, evento, actor o fecha"
      searchFn={(row, query) => {
        const value = query.toLowerCase();
        return [
          row.appointmentDateLabel,
          row.appointmentTimeLabel,
          row.clientName,
          row.clientEmail ?? '',
          row.eventType,
          row.actorLabel,
          formatDateOnly(row.eventDateTime),
          formatTime(row.eventDateTime),
        ].some((field) => field.toLowerCase().includes(value));
      }}
    />
  );
}
