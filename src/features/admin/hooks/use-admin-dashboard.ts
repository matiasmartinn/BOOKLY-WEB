import { useQuery } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { AdminDashboardDto, AdminDashboardQueryDto } from '../models';
import { adminService } from '../services';
import { adminDashboardQueryKey } from './query-keys';

export const useAdminDashboard = (query?: AdminDashboardQueryDto) =>
  useQuery<AdminDashboardDto, ProblemDetails>({
    queryKey: adminDashboardQueryKey(query),
    queryFn: () => adminService.getDashboard(query),
  });
