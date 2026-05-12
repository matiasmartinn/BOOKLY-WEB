import { Badge, Text } from '@mantine/core';
import type { TableColumn } from 'shared/components';
import type { ServiceTypeFieldDefinitionDto } from 'shared/models';

import { getServiceTypeFieldTypeLabel } from '../utils';

export const adminServiceTypeFieldColumns: TableColumn<ServiceTypeFieldDefinitionDto>[] = [
  {
    key: 'label',
    title: 'Label',
    accessor: 'label',
    sortable: true,
    width: 240,
    render: (row) => <Text fw={600}>{row.label}</Text>,
  },
  {
    key: 'key',
    title: 'Key',
    accessor: 'key',
    sortable: true,
    width: 220,
    render: (row) => (
      <Text ff="monospace" size="sm">
        {row.key}
      </Text>
    ),
  },
  {
    key: 'fieldType',
    title: 'Tipo',
    width: 150,
    textAlign: 'center',
    render: (row) => getServiceTypeFieldTypeLabel(row.fieldType),
  },
  {
    key: 'isRequired',
    title: 'Obligatorio',
    width: 150,
    textAlign: 'center',
    render: (row) => (
      <Badge color={row.isRequired ? 'brand' : 'gray'} variant="light" radius="sm">
        {row.isRequired ? 'Si' : 'No'}
      </Badge>
    ),
  },
  {
    key: 'isActive',
    title: 'Estado',
    width: 150,
    textAlign: 'center',
    render: (row) => (
      <Badge color={row.isActive ? 'green' : 'red'} variant="light" radius="sm">
        {row.isActive ? 'Activo' : 'Inactivo'}
      </Badge>
    ),
  },
];
