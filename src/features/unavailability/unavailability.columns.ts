import type { TableColumn } from 'shared/components/generic-table';
import type { UnavailabilityAdapter } from './unavailability.adapter';

export const unavailabilityColumns: TableColumn<UnavailabilityAdapter>[] = [
  {
    key: 'dateLabel',
    title: 'Fecha',
    accessor: 'dateLabel',
    sortable: true,
    noWrap: true,
  },
  {
    key: 'timeLabel',
    title: 'Horario',
    accessor: 'timeLabel',
    noWrap: true,
  },
  {
    key: 'totalDays',
    title: 'Días',
    accessor: 'totalDays',
    textAlign: 'center',
    width: 80,
    sortable: true,
  },
  {
    key: 'reason',
    title: 'Motivo',
    accessor: 'reason',
    sortable: true,
    render: (row) => row.reason ?? '—',
  },
];
