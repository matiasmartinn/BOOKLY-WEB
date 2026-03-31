export const PATHS = {
  auth: {
    root: '/auth',
    login: '/auth/login',
    register: '/auth/register',
    confirmEmail: '/auth/confirm-email',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    secretaryInvitation: '/auth/secretary-invitation',
    secretarySetup: '/auth/secretary-password-form',
    auth: '/auth/create-business',
  },
  dashboard: {
    overview: '/dashboard',
    events: '/dashboard/events',
    activity: '/dashboard/activity',
    appointments: '/dashboard/appointments',
    schedules: '/dashboard/schedules',
    history: '/dashboard/history',
    metrics: '/dashboard/metrics',
    service: '/dashboard/business',
    unavailability: '/dashboard/unavailability',
    status: '/dashboard/status',
    team: '/dashboard/team',
    account: '/dashboard/account',
    profile: '/dashboard/profile',
    settings: '/dashboard/settings',
  },

  service: {
    create: '/service/new',
  },
} as const;
