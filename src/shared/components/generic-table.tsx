// components/GenericTable/GenericTable.tsx
import { faSort, faSortUp, faSortDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Center,
  Group,
  Loader,
  Pagination,
  ScrollArea,
  Select,
  Table,
  Text,
  TextInput,
  LoadingOverlay,
  UnstyledButton,
} from '@mantine/core';
import { useEffect, useMemo, useState, useRef, type ReactNode, type CSSProperties } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Align = 'left' | 'center' | 'right';
type SortDirection = 'asc' | 'desc';

export interface SortState {
  columnKey: string | null;
  direction: SortDirection;
}

export interface TableColumn<T> {
  key: string;
  title: ReactNode;
  accessor?: keyof T;
  width?: number | string;
  textAlign?: Align;
  render?: (row: T, index: number) => ReactNode;
  visible?: boolean;
  noWrap?: boolean;
  sortable?: boolean;
  headerClassName?: string;
  cellClassName?: string | ((row: T, index: number) => string | undefined);
}

export interface GenericTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  rowKey: keyof T | ((row: T, index: number) => string | number);

  // Title
  title?: string;
  showTitle?: boolean;

  // Search (client-side)
  showSearch?: boolean;
  searchPlaceholder?: string;
  /**
   * Función de búsqueda personalizada.
   * Si no se provee, se hace toString() sobre todos los accessors.
   */
  searchFn?: (row: T, query: string) => boolean;
  searchDebounceMs?: number;

  // Sort (client-side cuando no se pasa onSortChange externo)
  defaultSort?: SortState;
  sort?: SortState;
  onSortChange?: (sort: SortState) => void;
  /**
   * Función de ordenamiento personalizada para sort client-side.
   * Si no se provee, se compara con < / > sobre el valor del accessor o render string.
   */
  sortFn?: (a: T, b: T, sort: SortState) => number;

  // Pagination (client-side cuando total no se pasa)
  showPaginator?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  resetPageKey?: string | number | null;

  // Server-side pagination (opcional, toma precedencia)
  serverPagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
  };

  // Loading
  loading?: boolean;
  fetching?: boolean;
  isRequestError?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  titleRefetchMessage?: string;
  onHandleTableRefetch?: () => void;

  // Custom buttons
  customButtons?: ReactNode;
  footerCustomButtons?: ReactNode;
  showFooterCustomButtons?: boolean;

  // Column of actions (appended as last column, equivalente al <Column> de PrimeReact)
  columnOfActions?: {
    header?: ReactNode;
    width?: number | string;
    textAlign?: Align;
    render: (row: T, index: number) => ReactNode;
  };

  // Table props
  minWidth?: number | string;
  scrollHeight?: string | number;
  striped?: boolean;
  highlightOnHover?: boolean;
  withTableBorder?: boolean;
  withColumnBorders?: boolean;
  horizontalSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  verticalSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  stickyHeader?: boolean;
  stickyHeaderOffset?: number;
  tableClassName?: string;

  rowClassName?: (row: T, index: number) => string | undefined;
  onRowClick?: (row: T, index: number) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getRowKey<T>(
  row: T,
  index: number,
  rowKey: GenericTableProps<T>['rowKey'],
): string | number {
  if (typeof rowKey === 'function') return rowKey(row, index);
  return String(row[rowKey]);
}

function getTextAlign(value?: Align): CSSProperties['textAlign'] {
  if (value === 'center') return 'center';
  if (value === 'right') return 'right';
  return 'left';
}

function getNextSort(current: SortState | undefined, columnKey: string): SortState {
  if (!current || current.columnKey !== columnKey) return { columnKey, direction: 'asc' };
  if (current.direction === 'asc') return { columnKey, direction: 'desc' };
  return { columnKey: null, direction: 'asc' }; // 3rd click: limpia el sort
}

function defaultSearchFn<T>(row: T, query: string, columns: TableColumn<T>[]): boolean {
  const q = query.toLowerCase();
  return columns.some((col) => {
    if (col.accessor == null) return false;
    const val = row[col.accessor];
    return val != null && String(val).toLowerCase().includes(q);
  });
}

function defaultSortFn<T>(a: T, b: T, sort: SortState, columns: TableColumn<T>[]): number {
  if (!sort.columnKey) return 0;
  const col = columns.find((c) => c.key === sort.columnKey);
  if (!col?.accessor) return 0;
  const aVal = a[col.accessor];
  const bVal = b[col.accessor];
  if (aVal == null && bVal == null) return 0;
  if (aVal == null) return 1;
  if (bVal == null) return -1;
  const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
  return sort.direction === 'asc' ? cmp : -cmp;
}

// ─── SortIcon ─────────────────────────────────────────────────────────────────

function SortIcon({ active, direction }: { active: boolean; direction?: SortDirection }) {
  if (!active) return <FontAwesomeIcon icon={faSort} style={{ opacity: 0.4 }} />;
  if (direction === 'asc') return <FontAwesomeIcon icon={faSortUp} />;
  return <FontAwesomeIcon icon={faSortDown} />;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GenericTable<T>({
  data,
  columns,
  rowKey,

  title,
  showTitle = false,

  showSearch = false,
  searchPlaceholder = 'Buscar...',
  searchFn,
  searchDebounceMs = 300,

  defaultSort,
  sort: sortProp,
  onSortChange,
  sortFn,

  showPaginator = false,
  pageSize: pageSizeProp = 10,
  pageSizeOptions = [5, 10, 20, 50],
  resetPageKey,

  serverPagination,

  loading = false,
  fetching = false,
  emptyMessage = 'No hay registros para mostrar',
  loadingMessage = 'Cargando registros...',
  titleRefetchMessage,
  isRequestError,
  onHandleTableRefetch,

  customButtons,
  footerCustomButtons,
  showFooterCustomButtons = false,

  columnOfActions,

  minWidth = 900,
  scrollHeight,
  striped = true,
  highlightOnHover = true,
  withTableBorder = false,
  withColumnBorders = false,
  horizontalSpacing = 'sm',
  verticalSpacing = 'sm',
  stickyHeader = false,
  stickyHeaderOffset = 0,
  tableClassName,

  rowClassName,
  onRowClick,
}: GenericTableProps<T>) {
  // ── Search state ──────────────────────────────────────────────────────────
  const [globalFilter, setGlobalFilter] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetPageKeyRef = useRef(resetPageKey);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const value = e.target.value;
    debounceRef.current = setTimeout(() => {
      setGlobalFilter(value);
      // Al buscar, volvemos a la primera página
      if (!serverPagination) setCurrentPage(1);
    }, searchDebounceMs);
  };

  // ── Client-side sort state ────────────────────────────────────────────────
  const isControlledSort = sortProp !== undefined;
  const [internalSort, setInternalSort] = useState<SortState>(
    defaultSort ?? { columnKey: null, direction: 'asc' },
  );
  const activeSort = isControlledSort ? sortProp! : internalSort;

  const handleSort = (col: TableColumn<T>) => {
    if (!col.sortable) return;
    const next = getNextSort(activeSort, col.key);
    if (isControlledSort) {
      onSortChange?.(next);
    } else {
      setInternalSort(next);
      onSortChange?.(next);
    }
  };

  // ── Client-side pagination state ──────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeProp);

  // ── Visible columns ───────────────────────────────────────────────────────
  const visibleColumns = useMemo(() => columns.filter((col) => col.visible !== false), [columns]);

  // ── Pipeline: filter → sort → paginate ───────────────────────────────────
  const filteredData = useMemo(() => {
    if (!globalFilter.trim()) return data;
    const fn = searchFn
      ? (row: T) => searchFn(row, globalFilter)
      : (row: T) => defaultSearchFn(row, globalFilter, visibleColumns);
    return data.filter(fn);
  }, [data, globalFilter, searchFn, visibleColumns]);

  const sortedData = useMemo(() => {
    if (!activeSort.columnKey || serverPagination) return filteredData;
    const fn = sortFn
      ? (a: T, b: T) => sortFn(a, b, activeSort)
      : (a: T, b: T) => defaultSortFn(a, b, activeSort, columns);
    return [...filteredData].sort(fn);
  }, [filteredData, activeSort, sortFn, columns, serverPagination]);

  // Paginación server-side toma precedencia
  const paginatedData = useMemo(() => {
    if (serverPagination || !showPaginator) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, serverPagination, showPaginator, currentPage, pageSize]);

  const totalRecords = serverPagination ? serverPagination.total : filteredData.length;
  const activePage = serverPagination ? serverPagination.page : currentPage;
  const activePageSize = serverPagination ? serverPagination.pageSize : pageSize;
  const totalPages = Math.max(1, Math.ceil(totalRecords / activePageSize));

  const handlePageChange = (page: number) => {
    if (serverPagination) {
      serverPagination.onPageChange(page);
    } else {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    if (!showPaginator || activePage <= totalPages) {
      return;
    }

    if (serverPagination) {
      serverPagination.onPageChange(1);
    } else {
      setCurrentPage(1);
    }
  }, [activePage, serverPagination, showPaginator, totalPages]);

  useEffect(() => {
    if (!showPaginator) {
      resetPageKeyRef.current = resetPageKey;
      return;
    }

    if (resetPageKeyRef.current === resetPageKey) {
      return;
    }

    resetPageKeyRef.current = resetPageKey;
    if (serverPagination) {
      serverPagination.onPageChange(1);
    } else {
      setCurrentPage(1);
    }
  }, [resetPageKey, serverPagination, showPaginator]);

  const handlePageSizeChange = (value: string | null) => {
    if (!value) return;
    const size = Number(value);
    if (serverPagination) {
      serverPagination.onPageSizeChange?.(size);
    } else {
      setPageSize(size);
      setCurrentPage(1);
    }
  };

  // ── Rows ──────────────────────────────────────────────────────────────────
  const rows = useMemo(
    () =>
      paginatedData.map((row, index) => {
        const cellClassName =
          typeof rowClassName === 'function' ? rowClassName(row, index) : undefined;

        return (
          <Table.Tr
            key={getRowKey(row, index, rowKey)}
            className={cellClassName}
            style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            onClick={() => onRowClick?.(row, index)}
          >
            {visibleColumns.map((col) => {
              const cc =
                typeof col.cellClassName === 'function'
                  ? col.cellClassName(row, index)
                  : col.cellClassName;

              const content = col.render
                ? col.render(row, index)
                : col.accessor != null
                  ? String(row[col.accessor] ?? '')
                  : null;

              return (
                <Table.Td
                  key={col.key}
                  className={cc}
                  style={{
                    width: col.width,
                    textAlign: getTextAlign(col.textAlign),
                    whiteSpace: col.noWrap ? 'nowrap' : undefined,
                  }}
                >
                  {content}
                </Table.Td>
              );
            })}

            {columnOfActions && (
              <Table.Td
                style={{
                  width: columnOfActions.width,
                  textAlign: getTextAlign(columnOfActions.textAlign),
                }}
              >
                {columnOfActions.render(row, index)}
              </Table.Td>
            )}
          </Table.Tr>
        );
      }),
    [paginatedData, rowKey, visibleColumns, rowClassName, onRowClick, columnOfActions],
  );

  const totalColumns = visibleColumns.length + (columnOfActions ? 1 : 0);
  const bodyContent = () => {
    if (loading) {
      return (
        <Table.Tr>
          <Table.Td colSpan={totalColumns}>
            <Center py="lg">
              <Group gap="sm">
                <Loader size="sm" />
                <Text size="sm" c="dimmed">
                  {loadingMessage}
                </Text>
              </Group>
            </Center>
          </Table.Td>
        </Table.Tr>
      );
    }

    if (paginatedData.length === 0) {
      return (
        <Table.Tr>
          <Table.Td colSpan={totalColumns}>
            <Center py="lg">
              {isRequestError && onHandleTableRefetch ? (
                <Group gap="sm">
                  <Text size="sm" c="red">
                    {titleRefetchMessage ?? 'Error al cargar los datos.'}
                  </Text>
                  <UnstyledButton
                    onClick={onHandleTableRefetch}
                    style={{
                      color: 'var(--mantine-color-blue-6)',
                      fontSize: 'var(--mantine-font-size-sm)',
                    }}
                  >
                    Reintentar
                  </UnstyledButton>
                </Group>
              ) : (
                <Text c="dimmed" size="sm">
                  {emptyMessage}
                </Text>
              )}
            </Center>
          </Table.Td>
        </Table.Tr>
      );
    }

    return rows;
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Box className={tableClassName} pos="relative">
      <LoadingOverlay
        visible={fetching}
        zIndex={10}
        overlayProps={{ radius: 'sm', blur: 1.5 }}
        loaderProps={{ type: 'oval' }}
      />

      {/* Header */}
      <Box mb="sm">
        {showTitle && title && (
          <Text fw={600} ta="center" mb="xs">
            {title}
          </Text>
        )}

        {customButtons && (
          <Group justify="flex-end" mb="xs">
            {customButtons}
          </Group>
        )}

        <Group justify="space-between" wrap="wrap" gap="sm">
          {showPaginator && (
            <Group gap="xs" align="center">
              <Text size="sm" c="dimmed">
                Mostrar
              </Text>
              <Select
                w={80}
                size="sm"
                value={String(activePageSize)}
                onChange={handlePageSizeChange}
                data={pageSizeOptions.map((n) => ({ value: String(n), label: String(n) }))}
              />
              <Text size="sm" c="dimmed">
                entradas
              </Text>
            </Group>
          )}

          {showSearch && (
            <TextInput
              size="sm"
              placeholder={searchPlaceholder}
              leftSection={<FontAwesomeIcon icon={faSearch} />}
              onChange={handleSearchInput}
              style={{ marginLeft: showPaginator ? undefined : 'auto' }}
            />
          )}
        </Group>
      </Box>

      {/* Table */}
      <ScrollArea h={scrollHeight}>
        <Table
          miw={minWidth}
          striped={striped}
          highlightOnHover={highlightOnHover}
          withTableBorder={withTableBorder}
          withColumnBorders={withColumnBorders}
          horizontalSpacing={horizontalSpacing}
          verticalSpacing={verticalSpacing}
          stickyHeader={stickyHeader}
          stickyHeaderOffset={stickyHeaderOffset}
        >
          <Table.Thead>
            <Table.Tr>
              {visibleColumns.map((col) => {
                const isSorted = activeSort.columnKey === col.key;
                return (
                  <Table.Th
                    key={col.key}
                    className={col.headerClassName}
                    style={{
                      width: col.width,
                      textAlign: getTextAlign(col.textAlign),
                      whiteSpace: col.noWrap ? 'nowrap' : undefined,
                    }}
                  >
                    {col.sortable ? (
                      <UnstyledButton
                        onClick={() => handleSort(col)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent:
                            col.textAlign === 'right'
                              ? 'flex-end'
                              : col.textAlign === 'center'
                                ? 'center'
                                : 'flex-start',
                        }}
                      >
                        <Group gap={6} wrap="nowrap">
                          <span>{col.title}</span>
                          <SortIcon
                            active={isSorted}
                            direction={isSorted ? activeSort.direction : undefined}
                          />
                        </Group>
                      </UnstyledButton>
                    ) : (
                      col.title
                    )}
                  </Table.Th>
                );
              })}

              {columnOfActions && (
                <Table.Th
                  style={{
                    width: columnOfActions.width,
                    textAlign: getTextAlign(columnOfActions.textAlign),
                  }}
                >
                  {columnOfActions.header ?? null}
                </Table.Th>
              )}
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>{bodyContent()}</Table.Tbody>
        </Table>
      </ScrollArea>

      {/* Pagination footer */}
      {showPaginator && (
        <Group justify="space-between" mt="md" wrap="wrap">
          <Text size="sm" c="dimmed">
            {paginatedData.length > 0
              ? `Mostrando ${(activePage - 1) * activePageSize + 1} a ${Math.min(activePage * activePageSize, totalRecords)} de ${totalRecords} entradas`
              : `Total: ${totalRecords}`}
          </Text>

          <Pagination value={activePage} onChange={handlePageChange} total={totalPages} size="sm" />
        </Group>
      )}

      {/* Footer custom buttons */}
      {showFooterCustomButtons && footerCustomButtons && (
        <Group justify="flex-end" mt="sm">
          {footerCustomButtons}
        </Group>
      )}
    </Box>
  );
}
