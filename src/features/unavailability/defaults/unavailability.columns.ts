import type { TableColumn } from 'shared/components/generic-table';
import type { UnavailabilityViewModel } from '../viewmodel';

export const unavailabilityColumns: TableColumn<UnavailabilityViewModel>[] = [
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
