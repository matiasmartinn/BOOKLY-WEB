import { Badge, Text } from '@mantine/core';
import type { TableColumn } from 'shared/components';
import type { ServiceTypeDto } from 'shared/models';

export const adminServiceTypeColumns: TableColumn<ServiceTypeDto>[] = [
  {
    key: 'name',
    title: 'Tipo de servicio',
    accessor: 'name',
    sortable: true,
    width: 260,
    render: (row) => <Text fw={600}>{row.name}</Text>,
  },
  {
    key: 'description',
    title: 'Descripcion',
    width: 360,
    render: (row) => (
      <Text size="sm" c={row.description?.trim() ? undefined : 'dimmed'} lineClamp={2}>
        {row.description?.trim() || 'Sin descripcion'}
      </Text>
    ),
  },
  {
    key: 'status',
    title: 'Estado',
    width: 160,
    textAlign: 'center',
    render: (row) => (
      <Badge color={row.isActive ? 'green' : 'red'} variant="light" radius="sm">
        {row.isActive ? 'Habilitado' : 'Deshabilitado'}
      </Badge>
    ),
  },
];
