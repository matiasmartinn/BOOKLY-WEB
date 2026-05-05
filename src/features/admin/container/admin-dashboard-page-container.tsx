import {
  Alert,
  Badge,
  Box,
  Button,
  Group,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PATHS } from 'app/router/PATHS';
import { DashboardStatCard } from 'features/dashboard/components';
import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { GenericModal } from 'shared/components';
import { appChartColorVars, appChartTooltipStyles, appColorVars } from 'shared/ui/theme/theme';
import { useAppToast } from 'shared/ui/toast';
import { getServiceTypeColor, SERVICE_TYPE_DEFAULT_COLOR_HEX } from 'shared/utils';

import {
  AdminChartCard,
  AdminEmptyChartState,
  AdminSectionCard,
  type AdminSectionBadge,
  InviteAdminForm,
} from '../components';
import { ADMIN_MONTH_OPTIONS } from '../defaults';
import { useAdminDashboard } from '../hooks';
import { formatAdminDate, formatAdminNumber } from '../utils';

const CHART_COLORS = {
  owners: appChartColorVars.primaryStrong,
  services: appChartColorVars.info,
} as const;

const PLAN_COLORS = [
  { color: appChartColorVars.primaryStrong, softColor: appColorVars.brandSoft },
  { color: appChartColorVars.primary, softColor: appColorVars.brandSoftHover },
  { color: appChartColorVars.info, softColor: appColorVars.infoSoft },
  { color: appChartColorVars.violet, softColor: appColorVars.violetSoft },
] as const;

const REGISTRATIONS_LEGEND = [
  { label: 'Owners', color: CHART_COLORS.owners },
  { label: 'Servicios', color: CHART_COLORS.services },
] as const;

const MAX_SERVICE_TYPE_CHART_ITEMS = 5;
const SHARED_CHART_GRID = {
  stroke: appChartColorVars.grid,
  strokeDasharray: '4 4',
} as const;
const SHARED_CHART_TICK = {
  fontSize: 12,
  fill: appChartColorVars.axis,
} as const;
const SHARED_CHART_AXIS_LINE = {
  stroke: appChartColorVars.grid,
} as const;
const VERTICAL_BAR_RADIUS: [number, number, number, number] = [8, 8, 0, 0];
const HORIZONTAL_BAR_RADIUS: [number, number, number, number] = [0, 8, 8, 0];

const getPlanVisual = (planKey?: string | null, index = 0) => {
  const normalizedKey = planKey?.trim().toLowerCase();

  switch (normalizedKey) {
    case 'free':
    case 'basic':
      return {
        color: appChartColorVars.muted,
        softColor: appColorVars.surfaceSoft,
      };
    case 'pro':
      return {
        color: appChartColorVars.primaryStrong,
        softColor: appColorVars.brandSoft,
      };
    case 'max':
    case 'premium':
    case 'enterprise':
      return {
        color: appChartColorVars.violet,
        softColor: appColorVars.violetSoft,
      };
    default:
      return PLAN_COLORS[index % PLAN_COLORS.length];
  }
};

const buildRegistrationsChartData = (
  ownerRegistrations: { periodStart: string; periodLabel: string; total: number }[],
  serviceRegistrations: { periodStart: string; periodLabel: string; total: number }[],
) => {
  const periods = new Map<
    string,
    { periodStart: string; label: string; owners: number; services: number }
  >();

  ownerRegistrations.forEach((item) => {
    periods.set(item.periodStart, {
      periodStart: item.periodStart,
      label: item.periodLabel,
      owners: item.total,
      services: 0,
    });
  });

  serviceRegistrations.forEach((item) => {
    const current = periods.get(item.periodStart);

    periods.set(item.periodStart, {
      periodStart: item.periodStart,
      label: item.periodLabel,
      owners: current?.owners ?? 0,
      services: item.total,
    });
  });

  return [...periods.values()].sort((left, right) =>
    left.periodStart.localeCompare(right.periodStart),
  );
};

export function AdminDashboardPageContainer() {
  const [months, setMonths] = useState('6');
  const [inviteOpened, inviteHandlers] = useDisclosure(false);
  const toast = useAppToast();

  const { data: dashboard, isLoading, isError } = useAdminDashboard({ months: Number(months) });

  const registrationsChartData = useMemo(
    () =>
      buildRegistrationsChartData(
        dashboard?.ownerRegistrations ?? [],
        dashboard?.serviceRegistrations ?? [],
      ),
    [dashboard],
  );

  const planChartData = useMemo(
    () =>
      (dashboard?.planDistribution ?? []).map((item, index) => ({
        ...getPlanVisual(item.plan.key, index),
        name: item.plan.displayName,
        value: item.totalOwners,
      })),
    [dashboard],
  );

  const sortedServiceTypeUsage = useMemo(
    () =>
      [...(dashboard?.serviceTypeUsage ?? [])].sort((left, right) =>
        right.total === left.total
          ? left.serviceTypeName.localeCompare(right.serviceTypeName)
          : right.total - left.total,
      ),
    [dashboard],
  );

  const serviceTypeUsageChartData = useMemo(
    () =>
      sortedServiceTypeUsage.slice(0, MAX_SERVICE_TYPE_CHART_ITEMS).map((item) => ({
        ...item,
        color: getServiceTypeColor(item.colorHex),
      })),
    [sortedServiceTypeUsage],
  );

  const serviceTypeOverflowCount = Math.max(
    sortedServiceTypeUsage.length - MAX_SERVICE_TYPE_CHART_ITEMS,
    0,
  );

  const getKpiValue = (value?: number) => {
    if (isLoading) {
      return '...';
    }

    return formatAdminNumber(value ?? 0);
  };

  const topLevelKpis = [
    {
      label: 'Owners totales',
      value: getKpiValue(dashboard?.summary.totalOwners),
    },
    {
      label: 'Servicios totales',
      value: getKpiValue(dashboard?.summary.totalServices),
    },
    {
      label: 'Suscripciones pagas',
      value: getKpiValue(dashboard?.summary.totalPaidSubscriptions),
    },
  ];

  const ownerSectionBadges: AdminSectionBadge[] = [
    {
      label: 'Activos',
      value: getKpiValue(dashboard?.summary.activeOwners),
      color: 'success',
    },
    {
      label: 'Pendientes email',
      value: getKpiValue(dashboard?.summary.pendingConfirmationOwners),
      color: 'warning',
    },
    {
      label: 'Pendientes invitacion',
      value: getKpiValue(dashboard?.summary.pendingInvitationOwners),
      color: 'info',
    },
    {
      label: 'Deshabilitados',
      value: getKpiValue(dashboard?.summary.disabledOwners),
      color: 'error',
    },
  ];

  const serviceSectionBadges: AdminSectionBadge[] = [
    {
      label: 'Servicios activos',
      value: getKpiValue(dashboard?.summary.activeServices),
      color: 'success',
    },
    {
      label: 'Servicios deshabilitados',
      value: getKpiValue(dashboard?.summary.disabledServices),
      color: 'error',
    },
    {
      label: 'Suscripciones activas',
      value: getKpiValue(dashboard?.summary.totalActiveSubscriptions),
      color: 'brand',
    },
    {
      label: 'Suscripciones pagas',
      value: getKpiValue(dashboard?.summary.totalPaidSubscriptions),
      color: 'violetAccent',
    },
  ];

  return (
    <>
      <Stack gap="lg">
        <Group justify="flex-end" align="end" wrap="wrap">
          <Select
            w={190}
            label="Periodo"
            data={ADMIN_MONTH_OPTIONS}
            value={months}
            onChange={(value) => {
              if (value) {
                setMonths(value);
              }
            }}
          />

          <Button onClick={inviteHandlers.open}>Invitar admin</Button>
        </Group>

        {isError ? (
          <Alert color={dashboard ? 'warning' : 'error'} variant="light">
            {dashboard
              ? 'No se pudieron refrescar todos los indicadores. Se mantienen los ultimos datos disponibles.'
              : 'No se pudo cargar el resumen administrativo con los datos disponibles.'}
          </Alert>
        ) : null}

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {topLevelKpis.map((item) => (
            <DashboardStatCard key={item.label} label={item.label} value={item.value} />
          ))}
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="lg">
          <AdminSectionCard
            title="Operacion de owners"
            buttonLabel="Ver owners"
            buttonTo={PATHS.dashboard.adminOwners}
            badges={ownerSectionBadges}
          />

          <AdminSectionCard
            title="Operacion de servicios"
            buttonLabel="Ver servicios"
            buttonTo={PATHS.dashboard.adminServices}
            badges={serviceSectionBadges}
          />
        </SimpleGrid>

        <AdminChartCard
          title="Altas recientes"
          headerAside={
            <Group gap="lg" wrap="wrap">
              {REGISTRATIONS_LEGEND.map((item) => (
                <Group key={item.label} gap={8} wrap="nowrap">
                  <Box
                    w={10}
                    h={10}
                    style={{
                      borderRadius: 999,
                      backgroundColor: item.color,
                      flexShrink: 0,
                    }}
                  />
                  <Text size="sm" fw={500} c="dimmed">
                    {item.label}
                  </Text>
                </Group>
              ))}
            </Group>
          }
          footer={
            dashboard ? (
              <Group justify="flex-end">
                <Text size="sm" c="dimmed">
                  Actualizado el {formatAdminDate(dashboard.generatedAt)}.
                </Text>
              </Group>
            ) : undefined
          }
        >
          {isLoading ? (
            <Skeleton h="100%" radius="md" />
          ) : registrationsChartData.length === 0 ? (
            <AdminEmptyChartState message="Todavia no hay altas recientes para mostrar." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={registrationsChartData}
                margin={{ top: 8, right: 12, bottom: 4, left: -16 }}
                barCategoryGap="28%"
                barGap={6}
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
                  tick={SHARED_CHART_TICK}
                  tickLine={SHARED_CHART_AXIS_LINE}
                  axisLine={SHARED_CHART_AXIS_LINE}
                  width={36}
                  tickMargin={8}
                />
                <RechartsTooltip {...appChartTooltipStyles} />
                <Bar
                  dataKey="owners"
                  name="Owners"
                  fill={CHART_COLORS.owners}
                  radius={VERTICAL_BAR_RADIUS}
                  barSize={18}
                />
                <Bar
                  dataKey="services"
                  name="Servicios"
                  fill={CHART_COLORS.services}
                  radius={VERTICAL_BAR_RADIUS}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </AdminChartCard>

        <SimpleGrid cols={{ base: 1, xl: 2 }} spacing="lg">
          <AdminChartCard
            title="Tipos de servicio mas utilizados"
            footer={
              serviceTypeOverflowCount > 0 ? (
                <Group justify="flex-end">
                  <Badge variant="light" radius="sm">
                    Otros tipos: {formatAdminNumber(serviceTypeOverflowCount)}
                  </Badge>
                </Group>
              ) : undefined
            }
          >
            {isLoading ? (
              <Skeleton h="100%" radius="md" />
            ) : serviceTypeUsageChartData.length === 0 ? (
              <AdminEmptyChartState message="No hay tipos de servicio para mostrar." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={serviceTypeUsageChartData}
                  layout="vertical"
                  margin={{ top: 8, right: 12, bottom: 4, left: 8 }}
                  barCategoryGap="26%"
                >
                  <CartesianGrid {...SHARED_CHART_GRID} horizontal={false} />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={SHARED_CHART_TICK}
                    tickLine={SHARED_CHART_AXIS_LINE}
                    axisLine={SHARED_CHART_AXIS_LINE}
                    tickMargin={8}
                  />
                  <YAxis
                    type="category"
                    dataKey="serviceTypeName"
                    interval={0}
                    tick={SHARED_CHART_TICK}
                    tickLine={false}
                    axisLine={false}
                    width={156}
                    tickMargin={10}
                  />
                  <RechartsTooltip
                    {...appChartTooltipStyles}
                    formatter={(value) => formatAdminNumber(Number(value))}
                  />
                  <Bar
                    dataKey="total"
                    name="Servicios"
                    fill={SERVICE_TYPE_DEFAULT_COLOR_HEX}
                    radius={HORIZONTAL_BAR_RADIUS}
                    barSize={18}
                  >
                    {serviceTypeUsageChartData.map((item) => (
                      <Cell
                        key={`${item.serviceTypeId}-${item.serviceTypeName}`}
                        fill={item.color}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </AdminChartCard>

          <AdminChartCard
            title="Distribucion de planes"
            footer={
              planChartData.length > 0 ? (
                <Group gap="xs" justify="center" wrap="wrap">
                  {planChartData.map((item) => (
                    <Badge
                      key={item.name}
                      variant="light"
                      radius="sm"
                      style={{ backgroundColor: item.softColor, color: item.color }}
                    >
                      {item.name}: {formatAdminNumber(item.value)}
                    </Badge>
                  ))}
                </Group>
              ) : undefined
            }
          >
            {isLoading ? (
              <Skeleton h="100%" radius="md" />
            ) : planChartData.length === 0 ? (
              <AdminEmptyChartState message="No hay datos de planes para el rango actual." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={68}
                    outerRadius={102}
                    paddingAngle={3}
                  >
                    {planChartData.map((item) => (
                      <Cell
                        key={item.name}
                        fill={item.color}
                        stroke={appColorVars.surface}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    {...appChartTooltipStyles}
                    formatter={(value) => formatAdminNumber(Number(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </AdminChartCard>
        </SimpleGrid>
      </Stack>

      <GenericModal
        opened={inviteOpened}
        onClose={inviteHandlers.close}
        title="Invitar admin"
        size="lg"
      >
        {inviteOpened ? (
          <InviteAdminForm
            onCancel={inviteHandlers.close}
            onSuccess={(result) => {
              inviteHandlers.close();
              if (result.emailDispatch.emailSent) {
                toast.success(result.emailDispatch.message);
              } else {
                toast.error(result.emailDispatch.message, {
                  title: 'Admin creado con advertencia',
                });
              }
            }}
          />
        ) : null}
      </GenericModal>
    </>
  );
}
