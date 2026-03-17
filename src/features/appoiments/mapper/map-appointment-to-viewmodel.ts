import type { AppointmentDto } from 'shared/models/appointment-dto';
import type { AppointmentViewModel } from '../viewmodel';
import { formatDateTime, formatTime } from 'shared/utils';

const mapAppointmentToViewModel = (item: AppointmentDto): AppointmentViewModel => {
  return {
    id: item.id,
    clientName: item.clientName,
    clientPhone: item.clientPhone,
    clientEmail: item.clientEmail ?? null,
    startDateTime: item.startDateTime,
    endDateTime: item.endDateTime,
    durationMinutes: item.durationMinutes,
    status: item.status,
    clientNotes: item.clientNotes ?? null,
    createdOn: item.createdOn,
    dateLabel: formatDateTime(item.startDateTime),
    timeLabel: `${formatTime(item.startDateTime)} - ${formatTime(item.endDateTime)}`,
  };
};

export const mapAppointmentListToViewModel = (items: AppointmentDto[]): AppointmentViewModel[] =>
  items.map(mapAppointmentToViewModel);
