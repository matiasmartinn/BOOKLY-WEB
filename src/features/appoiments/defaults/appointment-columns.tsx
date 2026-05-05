import { Badge } from '@mantine/core';
import { getAppointmentStatusColor, getAppointmentStatusLabel } from 'features/dashboard/utils';
import type { TableColumn } from 'shared/components/generic-table';

import type { AppointmentDynamicColumnViewModel, AppointmentViewModel } from '../viewmodel';

const appointmentBaseColumns: TableColumn<AppointmentViewModel>[] = [
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
    title: 'Telefono',
    accessor: 'clientPhone',
    noWrap: true,
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
    key: 'clientNotes',
    title: 'notas',
    accessor: 'clientNotes',
    sortable: true,
    render: (row) => (
      <span
        title={row.clientNotes ?? ''}
        style={{
          display: 'block',
          maxWidth: '100%',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {row.clientNotes || '-'}
      </span>
    ),
  },
];

export const buildAppointmentColumns = (
  dynamicColumns: AppointmentDynamicColumnViewModel[] = [],
): TableColumn<AppointmentViewModel>[] => [
  ...appointmentBaseColumns,
  ...dynamicColumns.map<TableColumn<AppointmentViewModel>>((dynamicColumn) => ({
    key: `extra-field-${dynamicColumn.key}`,
    title: dynamicColumn.label,
    width: 180,
    render: (row) => row.extraFields.find((field) => field.key === dynamicColumn.key)?.value ?? '-',
  })),
];
