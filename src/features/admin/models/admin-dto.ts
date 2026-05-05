export type AdminOwnerAccountStatus =
  | 'active'
  | 'disabled'
  | 'pending_email_confirmation'
  | 'pending_invitation_acceptance';
export type AdminServiceStatus = 'active' | 'disabled';
export type AdminSubscriptionStatus =
  | 'active'
  | 'pending_cancellation'
  | 'expired'
  | 'implicit_free';

export interface AdminPlanDto {
  code: number;
  key: string;
  displayName: string;
}

export interface AdminPlanDistributionItemDto {
  plan: AdminPlanDto;
  totalOwners: number;
}

export interface AdminStatusCountDto {
  status: string;
  label: string;
  total: number;
}

export interface AdminTimeSeriesPointDto {
  periodStart: string;
  periodLabel: string;
  total: number;
}

export interface AdminServiceTypeUsageItemDto {
  serviceTypeId: number;
  serviceTypeName: string;
  colorHex: string;
  iconKey?: string | null;
  total: number;
}

export interface AdminDashboardSummaryDto {
  totalUsers: number;
  totalOwners: number;
  totalServices: number;
  totalActiveSubscriptions: number;
  totalPaidSubscriptions: number;
  activeOwners: number;
  disabledOwners: number;
  pendingConfirmationOwners: number;
  pendingInvitationOwners: number;
  activeServices: number;
  disabledServices: number;
  recentActiveOwners: number;
}

export interface AdminDashboardDto {
  generatedAt: string;
  recentMonths: number;
  recentActiveOwnerWindowDays: number;
  summary: AdminDashboardSummaryDto;
  planDistribution: AdminPlanDistributionItemDto[];
  ownerRegistrations: AdminTimeSeriesPointDto[];
  serviceRegistrations: AdminTimeSeriesPointDto[];
  serviceTypeUsage: AdminServiceTypeUsageItemDto[];
  ownerRecentActivity: AdminTimeSeriesPointDto[];
  ownerStatusDistribution: AdminStatusCountDto[];
  serviceStatusDistribution: AdminStatusCountDto[];
}

export interface AdminPagedResultDto<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface AdminOwnerListItemDto {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  accountStatus: AdminOwnerAccountStatus;
  isActive: boolean;
  emailConfirmed: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
  serviceCount: number;
  currentPlan: AdminPlanDto;
  hasPersistedSubscription: boolean;
  subscriptionStatus: AdminSubscriptionStatus;
  subscriptionStartDate?: string | null;
  subscriptionEndDate?: string | null;
}

export interface AdminServiceListItemDto {
  id: number;
  name: string;
  slug: string;
  status: AdminServiceStatus;
  isActive: boolean;
  createdAt: string;
  ownerId: number;
  ownerName: string;
  ownerEmail: string;
  ownerAccountStatus: AdminOwnerAccountStatus;
  ownerPlan: AdminPlanDto;
  serviceTypeId: number;
  serviceTypeName: string;
  serviceTypeColorHex?: string | null;
  serviceTypeIconKey?: string | null;
  price?: number | null;
}

export interface AdminDashboardQueryDto {
  months?: number;
}

export interface InviteAdminDto {
  email: string;
  firstName: string;
  lastName: string;
}

export interface AdminOwnersQueryDto {
  search?: string;
  status?: AdminOwnerAccountStatus;
  plan?: string;
  createdFrom?: string;
  createdTo?: string;
  page?: number;
  pageSize?: number;
}

export interface AdminServicesQueryDto {
  search?: string;
  status?: AdminServiceStatus;
  ownerId?: number;
  ownerSearch?: string;
  plan?: string;
  page?: number;
  pageSize?: number;
}
