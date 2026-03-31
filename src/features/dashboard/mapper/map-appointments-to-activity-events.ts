import type { AppointmentStatusHistoryDto } from 'shared/models';
import type { AppointmentViewModel } from 'features/appoiments/viewmodel';
import { appointmentStatusIncludes } from '../utils';
import type { ActivityEventViewModel } from '../viewmodel/activity-event-view-model';

const resolveActorLabel = (
  userDisplayName?: string | null,
  userId?: number | null,
) => {
  if (userDisplayName) {
    return userDisplayName;
  }

  if (userId != null) {
    return `Usuario #${userId}`;
  }

  return 'Sin usuario del sistema';
};

const isCreationHistoryEvent = (item: AppointmentStatusHistoryDto) => item.oldStatus == null;

const createdEvent = (
  appointment: AppointmentViewModel,
  creationHistory?: AppointmentStatusHistoryDto,
): ActivityEventViewModel => ({
  id: `created-${appointment.id}`,
  appointmentId: appointment.id,
  eventType: 'Turno creado',
  eventTypeColor: 'blue',
  clientName: appointment.clientName,
  clientEmail: appointment.clientEmail,
  actorUserId: creationHistory?.userId ?? null,
  actorDisplayName: creationHistory?.userDisplayName ?? null,
  actorLabel: resolveActorLabel(creationHistory?.userDisplayName, creationHistory?.userId),
  eventDateTime: creationHistory?.occurredOn ?? appointment.createdOn,
  appointmentDateLabel: appointment.dateLabel,
  appointmentTimeLabel: appointment.timeLabel,
  status: 'CREATED',
});

const mapHistoryEventType = (
  item: AppointmentStatusHistoryDto,
) => {
  if (isCreationHistoryEvent(item)) {
    return null;
  }

  if (appointmentStatusIncludes(item.newStatus, 'CANCEL')) {
    return { label: 'Turno cancelado', color: 'red' };
  }

  if (appointmentStatusIncludes(item.newStatus, 'NO_SHOW', 'NOSHOW')) {
    return { label: 'Turno no asistio', color: 'orange' };
  }

  if (appointmentStatusIncludes(item.newStatus, 'ATTEND', 'CONFIRM')) {
    return { label: 'Turno asistio', color: 'green' };
  }

  if (appointmentStatusIncludes(item.newStatus, 'RESCHEDULE', 'REPROGRAM')) {
    return { label: 'Turno reprogramado', color: 'grape' };
  }

  return null;
};

const historyEvent = (
  item: AppointmentStatusHistoryDto,
  appointment?: AppointmentViewModel,
): ActivityEventViewModel | null => {
  const eventType = mapHistoryEventType(item);

  if (!eventType) {
    return null;
  }

  return {
    id: `history-${item.id}`,
    appointmentId: item.appointmentId,
    eventType: eventType.label,
    eventTypeColor: eventType.color,
    clientName: appointment?.clientName ?? `Turno #${item.appointmentId}`,
    clientEmail: appointment?.clientEmail ?? null,
    actorUserId: item.userId ?? null,
    actorDisplayName: item.userDisplayName ?? null,
    actorLabel: resolveActorLabel(item.userDisplayName, item.userId),
    eventDateTime: item.occurredOn,
    appointmentDateLabel: appointment?.dateLabel ?? 'Sin fecha asociada',
    appointmentTimeLabel: appointment?.timeLabel ?? 'Sin franja asociada',
    status: item.newStatus,
  };
};

export const mapAppointmentsToActivityEvents = (
  appointments: AppointmentViewModel[],
  history: AppointmentStatusHistoryDto[],
): ActivityEventViewModel[] => {
  const appointmentById = new Map(appointments.map((appointment) => [appointment.id, appointment]));
  const creationHistoryByAppointmentId = new Map<number, AppointmentStatusHistoryDto>();

  history
    .filter(isCreationHistoryEvent)
    .sort((a, b) => new Date(a.occurredOn).getTime() - new Date(b.occurredOn).getTime())
    .forEach((item) => {
      if (!creationHistoryByAppointmentId.has(item.appointmentId)) {
        creationHistoryByAppointmentId.set(item.appointmentId, item);
      }
    });

  const createdEvents = appointments.map((appointment) =>
    createdEvent(appointment, creationHistoryByAppointmentId.get(appointment.id)));
  const statusEvents = history
    .map((item) => historyEvent(item, appointmentById.get(item.appointmentId)))
    .filter((item): item is ActivityEventViewModel => item != null);

  return [...createdEvents, ...statusEvents].sort(
    (a, b) => new Date(b.eventDateTime).getTime() - new Date(a.eventDateTime).getTime(),
  );
};
