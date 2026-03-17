import type { TableColumn } from 'shared/components/generic-table';
import type { AppointmentViewModel } from '../viewmodel';

export const appointmentColumns: TableColumn<AppointmentViewModel>[] = [
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
    key: 'clientName',
    title: 'Cliente',
    accessor: 'clientName',
    sortable: true,
  },
  {
    key: 'clientPhone',
    title: 'Teléfono',
    accessor: 'clientPhone',
    noWrap: true,
  },
  {
    key: 'status',
    title: 'Estado',
    accessor: 'status',
    sortable: true,
    noWrap: true,
  },
  {
    key: 'durationMinutes',
    title: 'Duración',
    accessor: 'durationMinutes',
    textAlign: 'center',
    width: 100,
    sortable: true,
    render: (row) => `${row.durationMinutes} min`,
  },
];
