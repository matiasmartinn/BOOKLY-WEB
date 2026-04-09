import { apiClient } from 'app/api';
import type { UserDto } from 'shared/models';

import type {
  AdminDashboardDto,
  AdminDashboardQueryDto,
  AdminOwnerListItemDto,
  AdminOwnersQueryDto,
  AdminPagedResultDto,
  AdminServiceListItemDto,
  AdminServicesQueryDto,
  InviteAdminDto,
} from '../models';

const buildQueryParams = (query?: object) =>
  Object.fromEntries(
    Object.entries(query ?? {}).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  );

const inviteAdmin = (dto: InviteAdminDto) =>
  apiClient.post<UserDto>('/admins/invite', dto).then((response) => response.data);

const getDashboard = (query?: AdminDashboardQueryDto) =>
  apiClient
    .get<AdminDashboardDto>('/admin/dashboard', { params: buildQueryParams(query) })
    .then((response) => response.data);

const getOwners = (query?: AdminOwnersQueryDto) =>
  apiClient
    .get<AdminPagedResultDto<AdminOwnerListItemDto>>('/admin/owners', {
      params: buildQueryParams(query),
    })
    .then((response) => response.data);

const enableOwner = (ownerId: number) =>
  apiClient.post<void>(`/admin/owners/${ownerId}/enable`).then((response) => response.data);

const disableOwner = (ownerId: number) =>
  apiClient.post<void>(`/admin/owners/${ownerId}/disable`).then((response) => response.data);

const getServices = (query?: AdminServicesQueryDto) =>
  apiClient
    .get<AdminPagedResultDto<AdminServiceListItemDto>>('/admin/services', {
      params: buildQueryParams(query),
    })
    .then((response) => response.data);

const enableService = (serviceId: number) =>
  apiClient.post<void>(`/admin/services/${serviceId}/enable`).then((response) => response.data);

const disableService = (serviceId: number) =>
  apiClient.post<void>(`/admin/services/${serviceId}/disable`).then((response) => response.data);

export const adminService = {
  inviteAdmin,
  getDashboard,
  getOwners,
  enableOwner,
  disableOwner,
  getServices,
  enableService,
  disableService,
};
