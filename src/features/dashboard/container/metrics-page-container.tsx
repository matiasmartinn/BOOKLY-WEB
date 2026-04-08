import {
  Alert,
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useOwnerBusinesses } from 'features/business/hooks';
import { appChartColorVars, appChartTooltipStyles, appColorVars } from 'shared/ui/theme/theme';
import {
  addDaysToDateOnly,
  compareDateOnly,
  formatLongLocalDateOnly,
  formatShortLocalDateOnly,
  getCurrentBusinessDateOnly,
} from 'shared/utils';
import { useAuthStore } from 'store/use-auth-store';
import { EmptyChartState, MetricsChartCard, MetricsKpiCard } from '../components';
import { useAppointmentMetrics } from '../hooks';
import type { LabelFormatter } from 'recharts/types/component/Label';

const DEFAULT_RANGE_DAYS = 30;
const numberFormatter = new Intl.NumberFormat('es-AR');
const percentageFormatter = new Intl.NumberFormat('es-AR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const STATUS_VISUALS = {
  total: {
    accentColor: appChartColorVars.primary,
    accentBackground: appColorVars.brandSoft,
  },
  attended: {
    label: 'Asistido',
    color: appChartColorVars.success,
    softColor: appColorVars.successSoft,
  },
  cancelled: {
    label: 'Cancelado',
    color: appChartColorVars.warning,
    softColor: appColorVars.warningSoft,
  },
  noShow: {
    label: 'No asistio',
    color: appChartColorVars.danger,
    softColor: appColorVars.errorSoft,
  },
  pending: {
    label: 'Pendiente',
    color: appChartColorVars.primary,
    softColor: appColorVars.brandSoft,
  },
} as const;

const SHARED_CHART_GRID = {
  stroke: appChartColorVars.grid,
  strokeDasharray: '4 4',
} as const;

const SHARED_CHART_TICK = {
  fontSize: 12,
  fill: appColorVars.textSecondary,
} as const;

const SHARED_CHART_AXIS_LINE = {
  stroke: appColorVars.border,
} as const;

const CHART_LABEL_STYLE = {
  fill: appColorVars.textSecondary,
  fontSize: 12,
  fontWeight: 600,
} as const;

const VERTICAL_BAR_RADIUS: [number, number, number, number] = [8, 8, 0, 0];
const HORIZONTAL_BAR_RADIUS: [number, number, number, number] = [0, 8, 8, 0];

const compactFieldStyles = {
  label: {
    color: appColorVars.textSecondary,
    fontSize: 'var(--mantine-font-size-xs)',
    marginBottom: 4,
    fontWeight: 600,
  },
} as const;

const getDefaultRange = () => {
  const to = getCurrentBusinessDateOnly();

  return {
    from: addDaysToDateOnly(to, -(DEFAULT_RANGE_DAYS - 1)) ?? to,
    to,
  };
};

const formatNumber = (value: number) => numberFormatter.format(value);
const formatPercentage = (value: number) => `${percentageFormatter.format(value)}%`;

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

const getRateContext = (rate: number | undefined, total: number | undefined) => {
  const safeTotal = total ?? 0;
  const safeRate = rate ?? 0;
  const rateCount = Math.max(0, Math.round((safeRate / 100) * safeTotal));

  return `${formatNumber(rateCount)} de ${formatNumber(safeTotal)} turnos`;
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

const getDailyChartBarSize = (points: number) => {
  if (points <= 7) {
    return 34;
  }

  if (points <= 14) {
    return 24;
  }

  return 18;
};

const getDailyChartBarGap = (points: number) => {
  if (points <= 7) {
    return '12%';
  }

  if (points <= 14) {
    return '16%';
  }

  return '22%';
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

export function MetricsPageContainer() {
  const authUser = useAuthStore((s) => s.user);
  const defaultRange = useMemo(() => getDefaultRange(), []);

  const [fromDate, setFromDate] = useState<string | null>(defaultRange.from);
  const [toDate, setToDate] = useState<string | null>(defaultRange.to);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const { data: services = [] } = useOwnerBusinesses(authUser?.id);
  const hasInvalidRange = Boolean(fromDate && toDate && compareDateOnly(fromDate, toDate) > 0);

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

  const dayChartData = useMemo(
    () =>
      metrics?.appointmentsByDay
        .map((item) => ({
          date: item.date,
          label: formatShortLocalDateOnly(item.date),
          totalAppointments: item.totalAppointments,
        }))
        .sort((a, b) => compareDateOnly(a.date, b.date)) ?? [],
    [metrics],
  );

  const dayChartTickInterval = useMemo(
    () => getDailyChartTickInterval(dayChartData.length),
    [dayChartData.length],
  );

  const dayChartBarSize = useMemo(
    () => getDailyChartBarSize(dayChartData.length),
    [dayChartData.length],
  );

  const dayChartBarGap = useMemo(
    () => getDailyChartBarGap(dayChartData.length),
    [dayChartData.length],
  );

  const showDayLabels = dayChartData.length > 0 && dayChartData.length <= 10;

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
        name: STATUS_VISUALS.attended.label,
        value: metrics.attendanceRate,
        color: STATUS_VISUALS.attended.color,
        softColor: STATUS_VISUALS.attended.softColor,
      },
      {
        name: STATUS_VISUALS.cancelled.label,
        value: metrics.cancellationRate,
        color: STATUS_VISUALS.cancelled.color,
        softColor: STATUS_VISUALS.cancelled.softColor,
      },
      {
        name: STATUS_VISUALS.noShow.label,
        value: metrics.noShowRate,
        color: STATUS_VISUALS.noShow.color,
        softColor: STATUS_VISUALS.noShow.softColor,
      },
      ...(pendingRate > 0
        ? [
            {
              name: STATUS_VISUALS.pending.label,
              value: pendingRate,
              color: STATUS_VISUALS.pending.color,
              softColor: STATUS_VISUALS.pending.softColor,
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

  const hasAlerts = !authUser || hasInvalidRange || isError;
  const hasMetricsData = Boolean(metrics && metrics.totalAppointments > 0);

  const formatBarLabel: LabelFormatter = (value) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) && numericValue > 0 ? formatNumber(numericValue) : '';
  };

  const formatBarLabelPercentage: LabelFormatter = (value) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) && numericValue > 0 ? formatPercentage(numericValue) : '';
  };

  return (
    <Stack gap="lg">
      {hasAlerts && (
        <Stack gap="sm">
          {!authUser && (
            <Alert color="error" variant="light">
              No se pudo identificar la cuenta para consultar metricas.
            </Alert>
          )}

          {hasInvalidRange && (
            <Alert color="warning" variant="light">
              El rango es invalido. La fecha Desde no puede ser mayor que Hasta.
            </Alert>
          )}

          {isError && (
            <Alert color="error" variant="light">
              {error?.detail || 'No se pudieron cargar las metricas del periodo seleccionado.'}
            </Alert>
          )}
        </Stack>
      )}

      <Box maw={980} mx="auto" w="100%">
        <Paper
          radius="lg"
          p="xs"
          withBorder
          shadow="xs"
          style={{
            borderColor: appColorVars.border,
            backgroundColor: appColorVars.surface,
          }}
        >
          <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="sm" verticalSpacing="sm">
            <DatePickerInput
              label="Desde"
              placeholder="Fecha inicial"
              value={fromDate}
              onChange={setFromDate}
              valueFormat="DD/MM/YYYY"
              clearable={false}
              disabled={!authUser}
              size="sm"
              styles={compactFieldStyles}
            />

            <DatePickerInput
              label="Hasta"
              placeholder="Fecha final"
              value={toDate}
              onChange={setToDate}
              valueFormat="DD/MM/YYYY"
              clearable={false}
              disabled={!authUser}
              size="sm"
              styles={compactFieldStyles}
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
              size="sm"
              styles={compactFieldStyles}
            />

            <Group justify="flex-end" align="flex-end" gap="xs" wrap="wrap" h="100%">
              {isFetching && (
                <Badge color="brand" variant="light" radius="sm">
                  Actualizando
                </Badge>
              )}

              <Button variant="default" size="sm" onClick={resetFilters}>
                Ultimos 30 dias
              </Button>
            </Group>
          </SimpleGrid>
        </Paper>
      </Box>

      <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="md" verticalSpacing="md">
        <MetricsKpiCard
          label="Total turnos"
          value={isLoading ? '...' : formatNumber(metrics?.totalAppointments ?? 0)}
          meta={comparisonLabel ?? 'Comparacion con periodo anterior'}
          accentColor={STATUS_VISUALS.total.accentColor}
          accentBackground={STATUS_VISUALS.total.accentBackground}
        />
        <MetricsKpiCard
          label={STATUS_VISUALS.attended.label}
          value={isLoading ? '...' : formatPercentage(metrics?.attendanceRate ?? 0)}
          meta={getRateContext(metrics?.attendanceRate, metrics?.totalAppointments)}
          accentColor={STATUS_VISUALS.attended.color}
          accentBackground={STATUS_VISUALS.attended.softColor}
        />
        <MetricsKpiCard
          label={STATUS_VISUALS.cancelled.label}
          value={isLoading ? '...' : formatPercentage(metrics?.cancellationRate ?? 0)}
          meta={getRateContext(metrics?.cancellationRate, metrics?.totalAppointments)}
          accentColor={STATUS_VISUALS.cancelled.color}
          accentBackground={STATUS_VISUALS.cancelled.softColor}
        />
        <MetricsKpiCard
          label={STATUS_VISUALS.noShow.label}
          value={isLoading ? '...' : formatPercentage(metrics?.noShowRate ?? 0)}
          meta={getRateContext(metrics?.noShowRate, metrics?.totalAppointments)}
          accentColor={STATUS_VISUALS.noShow.color}
          accentBackground={STATUS_VISUALS.noShow.softColor}
        />
      </SimpleGrid>

      <MetricsChartCard
        title="Turnos por dia"
        chartHeight={320}
        padding="md"
        shadow="sm"
        footer={
          metrics && metrics.busiestDays.length > 0 ? (
            <Group gap="xs" wrap="wrap">
              {metrics.busiestDays.map((item) => (
                <Badge
                  key={item.date}
                  variant="light"
                  radius="sm"
                  style={{
                    backgroundColor: appColorVars.brandSoft,
                    color: appChartColorVars.primaryStrong,
                  }}
                >
                  {formatShortLocalDateOnly(item.date)}: {formatNumber(item.totalAppointments)}
                </Badge>
              ))}
            </Group>
          ) : undefined
        }
      >
        {isLoading ? (
          <Skeleton h="100%" radius="md" />
        ) : dayChartData.length === 0 || !hasMetricsData ? (
          <EmptyChartState message="No hay turnos para mostrar en este rango." />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dayChartData}
              margin={{
                top: showDayLabels ? 24 : 12,
                right: 12,
                bottom: 4,
                left: -12,
              }}
              barCategoryGap={dayChartBarGap}
            >
              <CartesianGrid {...SHARED_CHART_GRID} vertical={false} />
              <XAxis
                dataKey="label"
                tick={SHARED_CHART_TICK}
                tickLine={SHARED_CHART_AXIS_LINE}
                axisLine={SHARED_CHART_AXIS_LINE}
                interval={dayChartTickInterval}
                minTickGap={16}
                tickMargin={8}
                padding={dayChartData.length <= 7 ? { left: 12, right: 12 } : { left: 4, right: 4 }}
              />
              <YAxis
                allowDecimals={false}
                domain={[0, 'dataMax + 1']}
                tick={SHARED_CHART_TICK}
                tickLine={SHARED_CHART_AXIS_LINE}
                axisLine={SHARED_CHART_AXIS_LINE}
                width={36}
                tickMargin={8}
              />
              <Tooltip
                {...appChartTooltipStyles}
                formatter={(value) => [`${formatNumber(Number(value))} turnos`, 'Total']}
                labelFormatter={(_, payload) => {
                  const rawDate = payload?.[0]?.payload?.date;
                  return typeof rawDate === 'string' ? formatLongLocalDateOnly(rawDate) : '';
                }}
              />
              <Bar
                dataKey="totalAppointments"
                fill={appChartColorVars.primary}
                stroke={appChartColorVars.primaryStrong}
                strokeWidth={1}
                radius={VERTICAL_BAR_RADIUS}
                barSize={dayChartBarSize}
                minPointSize={dayChartData.some((item) => item.totalAppointments === 0) ? 0 : 3}
              >
                {showDayLabels ? (
                  <LabelList
                    dataKey="totalAppointments"
                    position="top"
                    offset={8}
                    formatter={formatBarLabel}
                    style={CHART_LABEL_STYLE}
                  />
                ) : null}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </MetricsChartCard>

      <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="md" verticalSpacing="md">
        <MetricsChartCard
          title="Concurrencia por dia de semana"
          chartHeight={220}
          padding="sm"
          shadow="sm"
          footer={
            busiestWeekdayBadges.length > 0 ? (
              <Group gap="xs" wrap="wrap">
                {busiestWeekdayBadges.map((item) => (
                  <Badge
                    key={item.dayOfWeek}
                    variant="light"
                    radius="sm"
                    style={{
                      backgroundColor: item.isPeak
                        ? appColorVars.brandSoft
                        : appColorVars.surfaceSoft,
                      color: item.isPeak
                        ? appChartColorVars.primaryStrong
                        : appColorVars.textSecondary,
                    }}
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
          ) : weekdayChartData.length === 0 || !hasMetricsData ? (
            <EmptyChartState message="No hay concurrencia semanal para mostrar." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weekdayChartData}
                margin={{ top: 20, right: 12, bottom: 4, left: -12 }}
                barCategoryGap="20%"
              >
                <CartesianGrid {...SHARED_CHART_GRID} vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={SHARED_CHART_TICK}
                  tickLine={SHARED_CHART_AXIS_LINE}
                  axisLine={SHARED_CHART_AXIS_LINE}
                  tickMargin={8}
                />
                <YAxis
                  allowDecimals={false}
                  domain={[0, 'dataMax + 1']}
                  tick={SHARED_CHART_TICK}
                  tickLine={SHARED_CHART_AXIS_LINE}
                  axisLine={SHARED_CHART_AXIS_LINE}
                  width={36}
                  tickMargin={8}
                />
                <Tooltip
                  {...appChartTooltipStyles}
                  formatter={(value) => [`${formatNumber(Number(value))} turnos`, 'Total']}
                  labelFormatter={(value) => `${value}`}
                />
                <Bar dataKey="totalAppointments" radius={VERTICAL_BAR_RADIUS} barSize={26}>
                  {weekdayChartData.map((item) => (
                    <Cell
                      key={item.dayOfWeek}
                      fill={
                        item.totalAppointments === 0
                          ? appColorVars.surfaceSoft
                          : item.isPeak
                            ? appChartColorVars.primaryStrong
                            : appChartColorVars.primary
                      }
                      stroke={
                        item.totalAppointments === 0
                          ? appColorVars.borderSoft
                          : appChartColorVars.primaryStrong
                      }
                      strokeWidth={item.isPeak ? 2 : 1}
                    />
                  ))}
                  <LabelList
                    dataKey="totalAppointments"
                    position="top"
                    offset={8}
                    formatter={formatBarLabel}
                    style={CHART_LABEL_STYLE}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </MetricsChartCard>

        <MetricsChartCard
          title="Distribucion de estados"
          chartHeight={220}
          padding="sm"
          shadow="sm"
          footer={
            statusChartData.length > 0 ? (
              <Group gap="xs" wrap="wrap">
                {statusChartData.map((item) => (
                  <Badge
                    key={item.name}
                    variant="light"
                    radius="sm"
                    style={{ backgroundColor: item.softColor, color: item.color }}
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
          ) : !hasMetricsData ? (
            <EmptyChartState message="Todavia no hay estados para distribuir." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statusChartData}
                layout="vertical"
                margin={{ top: 8, right: 34, bottom: 4, left: 4 }}
                barCategoryGap="18%"
              >
                <CartesianGrid {...SHARED_CHART_GRID} horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={SHARED_CHART_TICK}
                  tickLine={SHARED_CHART_AXIS_LINE}
                  axisLine={SHARED_CHART_AXIS_LINE}
                  tickMargin={8}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={SHARED_CHART_TICK}
                  tickLine={false}
                  axisLine={false}
                  width={88}
                  tickMargin={10}
                />
                <Tooltip
                  {...appChartTooltipStyles}
                  formatter={(value) => formatPercentage(Number(value))}
                />
                <Bar dataKey="value" radius={HORIZONTAL_BAR_RADIUS} barSize={24}>
                  {statusChartData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="right"
                    offset={8}
                    formatter={formatBarLabelPercentage}
                    style={CHART_LABEL_STYLE}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </MetricsChartCard>
      </SimpleGrid>
    </Stack>
  );
}
