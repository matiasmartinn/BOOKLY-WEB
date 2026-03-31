import { type QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ProblemDetails } from 'app/api';
import type { SubscriptionDto, SubscriptionPlanOptionDto } from 'shared/models';
import { subscriptionsService, type ChangePlanDto, type RenewSubscriptionDto } from '../services';

const ownerSubscriptionQueryKey = (ownerId?: number) => ['subscriptions', 'owner', ownerId] as const;
const ownerSubscriptionPlansQueryKey = (ownerId?: number) =>
  ['subscriptions', 'owner', ownerId, 'plans'] as const;

const createMissingOwnerProblem = (): ProblemDetails => ({
  status: 400,
  title: 'Cuenta no disponible',
  detail: 'No se pudo resolver la cuenta para gestionar la suscripcion.',
});

const invalidateSubscriptionQueries = (queryClient: QueryClient, ownerId?: number) => {
  if (ownerId == null) {
    return;
  }

  queryClient.invalidateQueries({ queryKey: ownerSubscriptionQueryKey(ownerId) });
  queryClient.invalidateQueries({ queryKey: ownerSubscriptionPlansQueryKey(ownerId) });
};

export const useOwnerSubscription = (ownerId?: number, enabled = true) =>
  useQuery<SubscriptionDto, ProblemDetails>({
    queryKey: ownerSubscriptionQueryKey(ownerId),
    queryFn: () => subscriptionsService.getByOwnerId(ownerId!),
    enabled: enabled && ownerId != null,
  });

export const useOwnerSubscriptionPlans = (ownerId?: number, enabled = true) =>
  useQuery<SubscriptionPlanOptionDto[], ProblemDetails>({
    queryKey: ownerSubscriptionPlansQueryKey(ownerId),
    queryFn: () => subscriptionsService.getPlansByOwnerId(ownerId!),
    enabled: enabled && ownerId != null,
  });

export const useCancelSubscription = (ownerId?: number) => {
  const queryClient = useQueryClient();

  return useMutation<SubscriptionDto, ProblemDetails, void>({
    mutationFn: () => {
      if (ownerId == null) {
        return Promise.reject(createMissingOwnerProblem());
      }

      return subscriptionsService.cancel(ownerId);
    },
    onSuccess: (subscription) => {
      invalidateSubscriptionQueries(queryClient, subscription.ownerId);
    },
  });
};

export const useRenewSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation<SubscriptionDto, ProblemDetails, RenewSubscriptionDto>({
    mutationFn: subscriptionsService.renew,
    onSuccess: (subscription) => {
      invalidateSubscriptionQueries(queryClient, subscription.ownerId);
    },
  });
};

export const useChangePlan = () => {
  const queryClient = useQueryClient();

  return useMutation<SubscriptionDto, ProblemDetails, ChangePlanDto>({
    mutationFn: subscriptionsService.changePlan,
    onSuccess: (subscription) => {
      invalidateSubscriptionQueries(queryClient, subscription.ownerId);
    },
  });
};
