import { Badge, Stack, Text } from '@mantine/core';
import type { TableColumn } from 'shared/components';

import type { AdminOwnerListItemDto } from '../models';
import {
  formatAdminDate,
  formatAdminNumber,
  formatAdminPlan,
  getOwnerStatusMeta,
  getSubscriptionStatusMeta,
} from '../utils';

export const adminOwnerColumns: TableColumn<AdminOwnerListItemDto>[] = [
  {
    key: 'owner',
    title: 'Owner',
    width: 250,
    render: (row) => (
      <Stack gap={2}>
        <Text fw={600}>{row.fullName}</Text>
        <Text size="sm" c="dimmed">
          {row.email}
        </Text>
      </Stack>
    ),
  },
  {
    key: 'accountStatus',
    title: 'Estado',
    width: 170,
    render: (row) => {
      const status = getOwnerStatusMeta(row.accountStatus);

      return (
        <Badge color={status.color} variant="light" radius="sm">
          {status.label}
        </Badge>
      );
    },
  },
  {
    key: 'plan',
    title: 'Plan',
    width: 120,
    render: (row) => (
      <Badge color="blue" variant="light" radius="sm">
        {formatAdminPlan(row.currentPlan)}
      </Badge>
    ),
  },
  {
    key: 'subscriptionStatus',
    title: 'Suscripcion',
    width: 180,
    render: (row) => {
      const status = getSubscriptionStatusMeta(row.subscriptionStatus);

      return (
        <Badge color={status.color} variant="light" radius="sm">
          {status.label}
        </Badge>
      );
    },
  },
  {
    key: 'serviceCount',
    title: 'Servicios',
    width: 110,
    textAlign: 'center',
    render: (row) => formatAdminNumber(row.serviceCount),
  },
  {
    key: 'createdAt',
    title: 'Alta',
    width: 120,
    render: (row) => formatAdminDate(row.createdAt),
  },
  {
    key: 'lastLoginAt',
    title: 'Ultimo acceso',
    width: 140,
    render: (row) => formatAdminDate(row.lastLoginAt),
  },
];
