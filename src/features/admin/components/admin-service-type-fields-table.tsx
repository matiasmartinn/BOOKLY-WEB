import { faBan, faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon, Button, Group, Tooltip } from '@mantine/core';
import { GenericTable } from 'shared/components';
import type { ServiceTypeFieldDefinitionDto } from 'shared/models';

import { adminServiceTypeFieldColumns } from '../defaults';

interface AdminServiceTypeFieldsTableProps {
  fields: ServiceTypeFieldDefinitionDto[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRefetch: () => void;
  onCreate: () => void;
  onEdit: (field: ServiceTypeFieldDefinitionDto) => void;
  onDisable: (field: ServiceTypeFieldDefinitionDto) => void;
  resetPageKey?: string | number | null;
}

export function AdminServiceTypeFieldsTable({
  fields,
  isLoading,
  isFetching,
  isError,
  onRefetch,
  onCreate,
  onEdit,
  onDisable,
  resetPageKey,
}: AdminServiceTypeFieldsTableProps) {
  return (
    <GenericTable
      data={fields}
      columns={adminServiceTypeFieldColumns}
      rowKey="id"
      loading={isLoading}
      fetching={isFetching}
      isRequestError={isError}
      onHandleTableRefetch={onRefetch}
      titleRefetchMessage="No se pudo cargar el listado de campos."
      showSearch
      showPaginator
      pageSize={10}
      resetPageKey={resetPageKey}
      pageSizeOptions={[5, 10, 20, 50]}
      minWidth={980}
      emptyMessage="Este tipo de servicio todavia no tiene campos configurados."
      searchPlaceholder="Buscar por label o key"
      searchFn={(row, query) => {
        const value = query.toLowerCase();

        return (
          row.label.toLowerCase().includes(value) ||
          row.key.toLowerCase().includes(value)
        );
      }}
      customButtons={
        <Button
          color="brand"
          onClick={onCreate}
          leftSection={<FontAwesomeIcon icon={faPlus} />}
        >
          Nuevo campo
        </Button>
      }
      columnOfActions={{
        header: 'Acciones',
        width: 120,
        textAlign: 'center',
        render: (row) => (
          <Group justify="center" gap="xs">
            <Tooltip label="Editar" withArrow>
              <ActionIcon
                variant="subtle"
                color="brand"
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(row);
                }}
              >
                <FontAwesomeIcon icon={faPen} />
              </ActionIcon>
            </Tooltip>

            <Tooltip
              label={row.isActive ? 'Deshabilitar campo' : 'Campo deshabilitado'}
              withArrow
            >
              <div>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDisable(row);
                  }}
                  disabled={!row.isActive}
                >
                  <FontAwesomeIcon icon={faBan} />
                </ActionIcon>
              </div>
            </Tooltip>
          </Group>
        ),
      }}
    />
  );
}
