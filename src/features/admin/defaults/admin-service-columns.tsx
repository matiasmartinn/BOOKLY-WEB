import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Text } from '@mantine/core';
import type { TableColumn } from 'shared/components';
import { getServiceTypeColor, getServiceTypeIcon, getServiceTypeSoftColor } from 'shared/utils';

import type { AdminServiceListItemDto } from '../models';
import { formatAdminDate, formatAdminPlan, getServiceStatusMeta } from '../utils';

export const adminServiceColumns: TableColumn<AdminServiceListItemDto>[] = [
  {
    key: 'service',
    title: 'Servicio',
    width: 200,
    render: (row) => <Text fw={600}>{row.name}</Text>,
  },
  {
    key: 'status',
    title: 'Estado',
    width: 100,
    render: (row) => {
      const status = getServiceStatusMeta(row.status);

      return (
        <Badge color={status.color} variant="light" radius="sm">
          {status.label}
        </Badge>
      );
    },
  },
  {
    key: 'owner',
    title: 'Owner',
    width: 140,
    render: (row) => {
      return <Text fw={500}>{row.ownerName}</Text>;
    },
  },
  {
    key: 'ownerPlan',
    title: 'Plan owner',
    width: 120,
    render: (row) => (
      <Badge color="brand" variant="light" radius="sm">
        {formatAdminPlan(row.ownerPlan)}
      </Badge>
    ),
  },
  {
    key: 'serviceTypeName',
    title: 'Tipo',
    width: 150,
    render: (row) => {
      const color = getServiceTypeColor(row.serviceTypeColorHex);

      return (
        <Badge
          variant="light"
          radius="sm"
          leftSection={<FontAwesomeIcon icon={getServiceTypeIcon(row.serviceTypeIconKey)} />}
          style={{ backgroundColor: getServiceTypeSoftColor(color), color }}
        >
          {row.serviceTypeName}
        </Badge>
      );
    },
  },
  {
    key: 'createdAt',
    title: 'Alta',
    width: 120,
    render: (row) => formatAdminDate(row.createdAt),
  },
];
