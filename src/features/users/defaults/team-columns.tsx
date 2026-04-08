import { Badge } from '@mantine/core';
import type { TableColumn } from 'shared/components/generic-table';
import type { SecretaryDto } from 'shared/models';

export const teamColumns = (selectedServiceId?: number): TableColumn<SecretaryDto>[] => [
  {
    key: 'fullName',
    title: 'Nombre',
    accessor: 'fullName',
    sortable: true,
  },
  {
    key: 'email',
    title: 'Email',
    accessor: 'email',
    sortable: true,
  },
  {
    key: 'isActive',
    title: 'Estado',
    accessor: 'isActive',
    sortable: true,
    render: (row) => (
      <Badge color={row.isActive ? 'green' : 'gray'} variant="light">
        {row.isActive ? 'Activo' : 'Dado de baja'}
      </Badge>
    ),
  },
  {
    key: 'type',
    title: 'Tipo',
    render: () => (
      <Badge color="blue" variant="light">
        Secretario/a
      </Badge>
    ),
  },
  {
    key: 'currentServiceAccess',
    title: 'Servicio actual',
    render: (row) => {
      if (!selectedServiceId) {
        return 'Selecciona un servicio';
      }

      const hasAccess = row.serviceIds.includes(selectedServiceId);

      return (
        <Badge color={hasAccess ? 'green' : 'gray'} variant="light">
          {hasAccess ? 'Con acceso' : 'Sin acceso'}
        </Badge>
      );
    },
  },
  {
    key: 'serviceIds',
    title: 'Servicios asignados',
    render: (row) => String(row.serviceIds.length),
  },
];
