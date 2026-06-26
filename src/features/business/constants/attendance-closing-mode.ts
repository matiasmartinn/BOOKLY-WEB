export const ATTENDANCE_CLOSING_MODE = {
  MANUAL: 1,
  AUTO_MARK_AS_ATTENDED: 2,
} as const;

export type AttendanceClosingModeValue =
  (typeof ATTENDANCE_CLOSING_MODE)[keyof typeof ATTENDANCE_CLOSING_MODE];

export const ATTENDANCE_CLOSING_MODE_OPTIONS = [
  {
    value: ATTENDANCE_CLOSING_MODE.MANUAL,
    label: 'Manual',
    description: 'Los turnos pendientes vencidos deberán resolverse manualmente.',
  },
  {
    value: ATTENDANCE_CLOSING_MODE.AUTO_MARK_AS_ATTENDED,
    label: 'Marcar como asistido automáticamente',
    description:
      'Los turnos pendientes vencidos de este servicio se marcarán como asistidos al finalizar el día.',
  },
] as const;
