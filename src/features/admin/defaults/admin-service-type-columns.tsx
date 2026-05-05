import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Group, Text, ThemeIcon } from '@mantine/core';
import type { TableColumn } from 'shared/components';
import type { ServiceTypeDto } from 'shared/models';
import { getServiceTypeColor, getServiceTypeIcon, getServiceTypeSoftColor } from 'shared/utils';

export const adminServiceTypeColumns: TableColumn<ServiceTypeDto>[] = [
  {
    key: 'name',
    title: 'Tipo de servicio',
    accessor: 'name',
    sortable: true,
    width: 260,
    render: (row) => {
      const color = getServiceTypeColor(row.colorHex);

      return (
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon
            size="sm"
            radius="sm"
            variant="light"
            style={{ backgroundColor: getServiceTypeSoftColor(color), color }}
          >
            <FontAwesomeIcon icon={getServiceTypeIcon(row.iconKey)} size="sm" />
          </ThemeIcon>
          <Text fw={600}>{row.name}</Text>
        </Group>
      );
    },
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
