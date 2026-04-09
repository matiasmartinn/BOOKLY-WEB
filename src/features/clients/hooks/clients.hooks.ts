import { useQuery } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type {
  ClientAppointmentHistoryDto,
  ClientDetailDto,
  ClientListItemDto,
} from 'shared/models';

import { clientsService } from '../services';

export const useOwnerClients = (ownerId?: number, search?: string) =>
  useQuery<ClientListItemDto[], ProblemDetails>({
    queryKey: ['clients', ownerId, search ?? ''],
    queryFn: () => clientsService.getByOwner(ownerId!, search),
    enabled: ownerId != null,
  });

export const useClientDetail = (ownerId?: number, email?: string) =>
  useQuery<ClientDetailDto, ProblemDetails>({
    queryKey: ['clients', 'detail', ownerId, email ?? ''],
    queryFn: () => clientsService.getDetail(ownerId!, email!),
    enabled: ownerId != null && Boolean(email),
  });

export const useClientAppointmentHistory = (ownerId?: number, email?: string) =>
  useQuery<ClientAppointmentHistoryDto[], ProblemDetails>({
    queryKey: ['clients', 'appointments', ownerId, email ?? ''],
    queryFn: () => clientsService.getAppointmentHistory(ownerId!, email!),
    enabled: ownerId != null && Boolean(email),
  });
