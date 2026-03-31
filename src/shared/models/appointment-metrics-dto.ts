export interface AppointmentMetricsDayBucketDto {
  date: string;
  totalAppointments: number;
}

export interface AppointmentMetricsHourBucketDto {
  hour: number;
  label: string;
  totalAppointments: number;
}

export interface AppointmentMetricsWeekdayBucketDto {
  dayOfWeek: number;
  label: string;
  totalAppointments: number;
}

export interface AppointmentMetricsDto {
  from: string;
  to: string;
  previousFrom: string;
  previousTo: string;
  totalAppointments: number;
  previousPeriodTotal: number;
  absoluteChange: number;
  percentageChange: number | null;
  cancellationRate: number;
  noShowRate: number;
  attendanceRate: number;
  appointmentsByDay: AppointmentMetricsDayBucketDto[];
  appointmentsByHour: AppointmentMetricsHourBucketDto[];
  appointmentsByWeekday: AppointmentMetricsWeekdayBucketDto[];
  busiestDays: AppointmentMetricsDayBucketDto[];
  busiestHours: AppointmentMetricsHourBucketDto[];
}
