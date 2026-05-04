import { Badge } from '@mantine/core';
import type { TableColumn } from 'shared/components/generic-table';
import type { SecretaryDto } from 'shared/models';

const getSecretaryStatusMeta = (secretary: SecretaryDto) => {
  const normalizedStatus = secretary.status?.trim().toLowerCase();

  switch (normalizedStatus) {
    case 'pendingemailconfirmation':
      return { label: 'Email pendiente', color: 'yellow' };
    case 'pendinginvitationacceptance':
      return { label: 'Invitación pendiente', color: 'yellow' };
    case 'active':
      return { label: 'Activo', color: 'green' };
    case 'inactive':
      return { label: 'Dado de baja', color: 'gray' };
    default:
      return secretary.isActive
        ? { label: 'Activo', color: 'green' }
        : { label: 'Dado de baja', color: 'gray' };
  }
};

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
    render: (row) => {
      const status = getSecretaryStatusMeta(row);

      return (
        <Badge color={status.color} variant="light">
          {status.label}
        </Badge>
      );
    },
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
