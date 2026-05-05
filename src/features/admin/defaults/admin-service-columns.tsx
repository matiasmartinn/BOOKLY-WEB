import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge, Stack, Text } from '@mantine/core';
import type { TableColumn } from 'shared/components';
import { getServiceTypeColor, getServiceTypeIcon, getServiceTypeSoftColor } from 'shared/utils';

import type { AdminServiceListItemDto } from '../models';
import {
  formatAdminDate,
  formatAdminPlan,
  formatAdminPrice,
  getOwnerStatusMeta,
  getServiceStatusMeta,
} from '../utils';

export const adminServiceColumns: TableColumn<AdminServiceListItemDto>[] = [
  {
    key: 'service',
    title: 'Servicio',
    width: 240,
    render: (row) => (
      <Stack gap={2}>
        <Text fw={600}>{row.name}</Text>
        <Text size="sm" c="dimmed">
          /{row.slug}
        </Text>
      </Stack>
    ),
  },
  {
    key: 'status',
    title: 'Estado',
    width: 140,
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
    width: 240,
    render: (row) => {
      const status = getOwnerStatusMeta(row.ownerAccountStatus);

      return (
        <Stack gap={4}>
          <Text fw={600}>{row.ownerName}</Text>
          <Text size="sm" c="dimmed">
            {row.ownerEmail}
          </Text>
          <Badge color={status.color} variant="light" radius="sm" w="fit-content">
            {status.label}
          </Badge>
        </Stack>
      );
    },
  },
  {
    key: 'ownerPlan',
    title: 'Plan owner',
    width: 120,
    render: (row) => (
      <Badge color="blue" variant="light" radius="sm">
        {formatAdminPlan(row.ownerPlan)}
      </Badge>
    ),
  },
  {
    key: 'price',
    title: 'Precio',
    width: 120,
    render: (row) => formatAdminPrice(row.price),
  },
  {
    key: 'serviceTypeName',
    title: 'Tipo',
    width: 150,
    textAlign: 'center',
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
