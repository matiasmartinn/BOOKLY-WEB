import type { AdminDashboardQueryDto, AdminOwnersQueryDto, AdminServicesQueryDto } from '../models';

export const adminDashboardQueryKey = (query?: AdminDashboardQueryDto) =>
  query == null
    ? (['admin', 'dashboard'] as const)
    : (['admin', 'dashboard', query.months ?? 6] as const);

export const adminOwnersQueryKey = (query?: AdminOwnersQueryDto) =>
  query == null
    ? (['admin', 'owners'] as const)
    : ([
        'admin',
        'owners',
        query.search ?? null,
        query.status ?? null,
        query.plan ?? null,
        query.createdFrom ?? null,
        query.createdTo ?? null,
        query.page ?? 1,
        query.pageSize ?? 20,
      ] as const);

export const adminServicesQueryKey = (query?: AdminServicesQueryDto) =>
  query == null
    ? (['admin', 'services'] as const)
    : ([
        'admin',
        'services',
        query.search ?? null,
        query.status ?? null,
        query.ownerId ?? null,
        query.ownerSearch ?? null,
        query.plan ?? null,
        query.page ?? 1,
        query.pageSize ?? 20,
      ] as const);
