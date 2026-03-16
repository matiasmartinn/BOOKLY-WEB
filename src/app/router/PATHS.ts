export const PATHS = {
  auth: {
    root: '/auth',
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    secretarySetup: '/auth/secretary-setup',
    auth: '/auth/create-business',
  },
  dashboard: {
    overview: '/dashboard',
    appointments: '/dashboard/appointments',
    schedules: '/dashboard/schedules',
    service: '/dashboard/business',
    unavailability: '/dashboard/unavailability',
    status: '/dashboard/status',
    team: '/dashboard/team',
    profile: '/dashboard/profile',
    settings: '/dashboard/settings',
  },

  service: {
    create: '/service/new',
  },
} as const;
