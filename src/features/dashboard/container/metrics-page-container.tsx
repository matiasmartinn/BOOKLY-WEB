import {
  Alert,
  Badge,
  Box,
  Button,
  Center,
  Group,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useMemo, useState, type ReactNode } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useOwnerBusinesses } from 'features/business/hooks';
import { PageCard, PageShell } from 'shared/layout';
import { formatDateOnly } from 'shared/utils';
import { useAuthStore } from 'store/use-auth-store';
import { MetricsKpiCard } from '../components';
import { useAppointmentMetrics } from '../hooks';

const DEFAULT_RANGE_DAYS = 30;
const numberFormatter = new Intl.NumberFormat('es-AR');
const percentageFormatter = new Intl.NumberFormat('es-AR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});
const shortDateFormatter = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: 'short',
});
const longDateFormatter = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const COLORS = {
  brand: '#4f46e5',
  brandSoft: '#c7d2fe',
  success: '#2f9e44',
  warning: '#f08c00',
  danger: '#e03131',
  muted: '#adb5bd',
} as const;

const getTodayDateOnly = () => {
  const today = new Date();
  const year = String(today.getFullYear());
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const shiftDateOnly = (value: string, days: number) => {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
};

const getDefaultRange = () => {
  const to = getTodayDateOnly();

  return {
    from: shiftDateOnly(to, -(DEFAULT_RANGE_DAYS - 1)),
    to,
  };
};

const formatNumber = (value: number) => numberFormatter.format(value);
const formatPercentage = (value: number) => `${percentageFormatter.format(value)}%`;
const getDateOnlyObject = (value: string) => {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const formatShortDate = (value: string) => {
  const date = getDateOnlyObject(value);
  return date ? shortDateFormatter.format(date) : value;
};

const formatLongDate = (value: string) => {
  const date = getDateOnlyObject(value);
  return date ? longDateFormatter.format(date) : value;
};

const formatRange = (from: string, to: string) =>
  `${formatDateOnly(from)} al ${formatDateOnly(to)}`;

const getComparisonTone = (absoluteChange: number, percentageChange: number | null) => {
  if (percentageChange == null) {
    return 'muted' as const;
  }

  if (absoluteChange > 0) {
    return 'positive' as const;
  }

  if (absoluteChange < 0) {
    return 'negative' as const;
  }

  return 'neutral' as const;
};

const getComparisonLabel = (absoluteChange: number, percentageChange: number | null) => {
  if (percentageChange == null) {
    return 'Sin base comparable';
  }

  if (absoluteChange === 0) {
    return 'Sin variacion';
  }

  const signal = percentageChange > 0 ? '+' : '';
  return `${signal}${percentageFormatter.format(percentageChange)}% vs periodo anterior`;
};

const getDailyChartTickInterval = (points: number) => {
  if (points <= 7) {
    return 0;
  }

  if (points <= 14) {
    return 1;
  }

  if (points <= 31) {
    return 3;
  }

  return Math.max(4, Math.floor(points / 8));
};

const getWeekdaySortValue = (dayOfWeek: number) => {
  if (dayOfWeek >= 1 && dayOfWeek <= 7) {
    return dayOfWeek;
  }

  if (dayOfWeek === 0) {
    return 7;
  }

  return dayOfWeek;
};

interface MetricsChartCardProps {
  title: string;
  description: string;
  footer?: ReactNode;
  children: ReactNode;
}

function MetricsChartCard({ title, description, footer, children }: MetricsChartCardProps) {
  return (
    <PageCard>
      <Stack gap="md">
        <Stack gap={4}>
          <Text fw={600}>{title}</Text>
          <Text size="sm" c="dimmed">
            {description}
          </Text>
        </Stack>

        <Box h={300}>{children}</Box>

        {footer}
      </Stack>
    </PageCard>
  );
}

function EmptyChartState({ message }: { message: string }) {
  return (
    <Center h="100%">
      <Text size="sm" c="dimmed" ta="center" maw={320}>
        {message}
      </Text>
    </Center>
  );
}

export function MetricsPageContainer() {
  const authUser = useAuthStore((s) => s.user);
  const defaultRange = useMemo(() => getDefaultRange(), []);

  const [fromDate, setFromDate] = useState<string | null>(defaultRange.from);
  const [toDate, setToDate] = useState<string | null>(defaultRange.to);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const { data: services = [] } = useOwnerBusinesses(authUser?.id);
  const hasInvalidRange = Boolean(fromDate && toDate && fromDate > toDate);

  const metricsQuery = useMemo(() => {
    if (!authUser || !fromDate || !toDate || hasInvalidRange) {
      return undefined;
    }

    return {
      ownerId: authUser.id,
      serviceId: selectedServiceId ? Number(selectedServiceId) : undefined,
      from: fromDate,
      to: toDate,
    };
  }, [authUser, fromDate, hasInvalidRange, selectedServiceId, toDate]);

  const {
    data: metrics,
    error,
    isError,
    isFetching,
    isLoading,
  } = useAppointmentMetrics(metricsQuery);

  const serviceOptions = useMemo(
    () =>
      services
        .map((service) => ({
          value: String(service.id),
          label: service.name,
        }))
        .sort((a, b) => a.label.localeCompare(b.label, 'es-AR')),
    [services],
  );

  const selectedServiceName = useMemo(() => {
    if (!selectedServiceId) {
      return 'Todos los servicios';
    }

    return serviceOptions.find((option) => option.value === selectedServiceId)?.label ?? 'Servicio';
  }, [selectedServiceId, serviceOptions]);

  const periodLabel = useMemo(() => {
    if (!fromDate || !toDate) {
      return 'Selecciona un rango valido';
    }

    return formatRange(fromDate, toDate);
  }, [fromDate, toDate]);

  const dayChartData = useMemo(
    () =>
      metrics?.appointmentsByDay
        .map((item) => ({
          date: item.date,
          label: formatShortDate(item.date),
          totalAppointments: item.totalAppointments,
          sortValue: getDateOnlyObject(item.date)?.getTime() ?? Number.MAX_SAFE_INTEGER,
        }))
        .sort((a, b) => a.sortValue - b.sortValue)
        .map(({ sortValue, ...item }) => item) ?? [],
    [metrics],
  );

  const dayChartTickInterval = useMemo(
    () => getDailyChartTickInterval(dayChartData.length),
    [dayChartData.length],
  );

  const weekdayChartData = useMemo(() => {
    if (!metrics) {
      return [];
    }

    const sortedWeekdays = [...metrics.appointmentsByWeekday].sort(
      (a, b) => getWeekdaySortValue(a.dayOfWeek) - getWeekdaySortValue(b.dayOfWeek),
    );
    const busiestWeekdayTotal = Math.max(
      0,
      ...sortedWeekdays.map((item) => item.totalAppointments),
    );

    return sortedWeekdays.map((item) => ({
      dayOfWeek: item.dayOfWeek,
      label: item.label,
      totalAppointments: item.totalAppointments,
      isPeak: busiestWeekdayTotal > 0 && item.totalAppointments === busiestWeekdayTotal,
    }));
  }, [metrics]);

  const busiestWeekdayBadges = useMemo(
    () =>
      [...weekdayChartData]
        .filter((item) => item.totalAppointments > 0)
        .sort((a, b) => b.totalAppointments - a.totalAppointments || a.dayOfWeek - b.dayOfWeek)
        .slice(0, 3),
    [weekdayChartData],
  );

  const statusChartData = useMemo(() => {
    if (!metrics || metrics.totalAppointments === 0) {
      return [];
    }

    const pendingRate = Math.max(
      0,
      Number(
        (100 - metrics.attendanceRate - metrics.cancellationRate - metrics.noShowRate).toFixed(2),
      ),
    );

    return [
      {
        name: 'Asistio',
        value: metrics.attendanceRate,
        color: COLORS.success,
      },
      {
        name: 'Cancelado',
        value: metrics.cancellationRate,
        color: COLORS.warning,
      },
      {
        name: 'No asistio',
        value: metrics.noShowRate,
        color: COLORS.danger,
      },
      ...(pendingRate > 0
        ? [
            {
              name: 'Pendientes',
              value: pendingRate,
              color: COLORS.muted,
            },
          ]
        : []),
    ].filter((item) => item.value > 0);
  }, [metrics]);

  const resetFilters = () => {
    const nextRange = getDefaultRange();
    setFromDate(nextRange.from);
    setToDate(nextRange.to);
    setSelectedServiceId(null);
  };

  const comparisonLabel = metrics
    ? getComparisonLabel(metrics.absoluteChange, metrics.percentageChange)
    : undefined;
  const comparisonTone = metrics
    ? getComparisonTone(metrics.absoluteChange, metrics.percentageChange)
    : 'neutral';

  return (
    <PageShell
      title="Metricas"
      description="Vista analitica del negocio para entender volumen, asistencia y demanda del periodo seleccionado."
    >
      <Stack gap="md">
        {!authUser && (
          <Alert color="red" variant="light">
            No se pudo identificar la cuenta para consultar metricas.
          </Alert>
        )}

        {hasInvalidRange && (
          <Alert color="yellow" variant="light">
            El rango es invalido. La fecha Desde no puede ser mayor que Hasta.
          </Alert>
        )}

        {isError && (
          <Alert color="red" variant="light">
            {error?.detail || 'No se pudieron cargar las metricas del periodo seleccionado.'}
          </Alert>
        )}

        <PageCard>
          <Stack gap="md">
            <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
              <Stack gap={4}>
                <Text fw={600}>Rango analizado</Text>
                <Text size="sm" c="dimmed">
                  {periodLabel}. Alcance: {selectedServiceName}.
                </Text>
              </Stack>

              <Group gap="xs">
                {isFetching && (
                  <Badge color="brand" variant="light">
                    Actualizando
                  </Badge>
                )}

                <Button variant="default" onClick={resetFilters}>
                  Ultimos 30 dias
                </Button>
              </Group>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
              <DatePickerInput
                label="Desde"
                placeholder="Fecha inicial"
                value={fromDate}
                onChange={setFromDate}
                valueFormat="DD/MM/YYYY"
                clearable={false}
                disabled={!authUser}
              />

              <DatePickerInput
                label="Hasta"
                placeholder="Fecha final"
                value={toDate}
                onChange={setToDate}
                valueFormat="DD/MM/YYYY"
                clearable={false}
                disabled={!authUser}
              />

              <Select
                label="Servicio"
                placeholder="Todos los servicios"
                data={serviceOptions}
                value={selectedServiceId}
                onChange={setSelectedServiceId}
                clearable
                searchable
                disabled={!authUser}
              />
            </SimpleGrid>
          </Stack>
        </PageCard>

        <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }}>
          <MetricsKpiCard
            label="Total turnos"
            value={isLoading ? '...' : formatNumber(metrics?.totalAppointments ?? 0)}
            caption={
              metrics
                ? `Periodo anterior: ${formatNumber(metrics.previousPeriodTotal)}.`
                : 'Cantidad total de turnos creados dentro del rango.'
            }
            trendLabel={comparisonLabel}
            trendTone={comparisonTone}
          />
          <MetricsKpiCard
            label="% asistencia"
            value={isLoading ? '...' : formatPercentage(metrics?.attendanceRate ?? 0)}
            caption="Participacion de turnos atendidos sobre el total del periodo."
          />
          <MetricsKpiCard
            label="% cancelacion"
            value={isLoading ? '...' : formatPercentage(metrics?.cancellationRate ?? 0)}
            caption="Turnos cancelados respecto del volumen total analizado."
          />
          <MetricsKpiCard
            label="% no asistio"
            value={isLoading ? '...' : formatPercentage(metrics?.noShowRate ?? 0)}
            caption="Ausencias registradas sobre el total del periodo."
          />
        </SimpleGrid>

        <MetricsChartCard
          title="Turnos por dia"
          description="Cantidad de turnos registrados en cada dia del rango seleccionado."
          footer={
            metrics && metrics.busiestDays.length > 0 ? (
              <Group gap="xs" wrap="wrap">
                {metrics.busiestDays.map((item) => (
                  <Badge key={item.date} color="brand" variant="light">
                    {formatShortDate(item.date)}: {formatNumber(item.totalAppointments)}
                  </Badge>
                ))}
              </Group>
            ) : undefined
          }
        >
          {isLoading ? (
            <Skeleton h="100%" radius="md" />
          ) : dayChartData.length === 0 || !metrics || metrics.totalAppointments === 0 ? (
            <EmptyChartState message="No hay turnos en este rango para construir la evolucion diaria." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dayChartData}
                margin={{ top: 8, right: 8, bottom: 8, left: -12 }}
                barCategoryGap="24%"
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12 }}
                  interval={dayChartTickInterval}
                  minTickGap={16}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} width={32} />
                <Tooltip
                  formatter={(value) => [`${formatNumber(Number(value))} turnos`, 'Total']}
                  labelFormatter={(_, payload) => {
                    const rawDate = payload?.[0]?.payload?.date;
                    return typeof rawDate === 'string' ? formatLongDate(rawDate) : '';
                  }}
                />
                <Bar
                  dataKey="totalAppointments"
                  fill={COLORS.brandSoft}
                  stroke={COLORS.brand}
                  radius={[6, 6, 0, 0]}
                  minPointSize={dayChartData.some((item) => item.totalAppointments === 0) ? 0 : 2}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </MetricsChartCard>

        <SimpleGrid cols={{ base: 1, xl: 2 }}>
          <MetricsChartCard
            title="Concurrencia por dia de semana"
            description="Acumula los turnos del periodo por dia literal para detectar que dias concentran mas demanda."
            footer={
              busiestWeekdayBadges.length > 0 ? (
                <Group gap="xs" wrap="wrap">
                  {busiestWeekdayBadges.map((item) => (
                    <Badge
                      key={item.dayOfWeek}
                      color={item.isPeak ? 'brand' : 'gray'}
                      variant="light"
                    >
                      {item.label}: {formatNumber(item.totalAppointments)}
                    </Badge>
                  ))}
                </Group>
              ) : undefined
            }
          >
            {isLoading ? (
              <Skeleton h="100%" radius="md" />
            ) : weekdayChartData.length === 0 || !metrics || metrics.totalAppointments === 0 ? (
              <EmptyChartState message="No hay turnos en este rango para analizar la concurrencia por dia de semana." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weekdayChartData}
                  margin={{ top: 8, right: 8, bottom: 8, left: -12 }}
                  barCategoryGap="28%"
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} width={32} />
                  <Tooltip
                    formatter={(value) => [`${formatNumber(Number(value))} turnos`, 'Total']}
                    labelFormatter={(value) => `${value}`}
                  />
                  <Bar dataKey="totalAppointments" radius={[6, 6, 0, 0]}>
                    {weekdayChartData.map((item) => (
                      <Cell
                        key={item.dayOfWeek}
                        fill={item.isPeak ? COLORS.brand : COLORS.brandSoft}
                        stroke={COLORS.brand}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </MetricsChartCard>
          <MetricsChartCard
            title="Distribucion de estados"
            description="Resume la proporcion de turnos atendidos, perdidos y aun pendientes."
            footer={
              statusChartData.length > 0 ? (
                <Group gap="xs" wrap="wrap">
                  {statusChartData.map((item) => (
                    <Badge
                      key={item.name}
                      variant="light"
                      style={{ backgroundColor: `${item.color}1a`, color: item.color }}
                    >
                      {item.name}: {formatPercentage(item.value)}
                    </Badge>
                  ))}
                </Group>
              ) : undefined
            }
          >
            {isLoading ? (
              <Skeleton h="100%" radius="md" />
            ) : !metrics || metrics.totalAppointments === 0 ? (
              <EmptyChartState message="Todavia no hay turnos en el rango seleccionado para distribuir por estado." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={105}
                    paddingAngle={2}
                  >
                    {statusChartData.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatPercentage(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </MetricsChartCard>
        </SimpleGrid>
      </Stack>
    </PageShell>
  );
}
