export interface ActivityEventViewModel {
  id: string;
  appointmentId: number;
  eventType: string;
  eventTypeColor: string;
  clientName: string;
  clientEmail: string | null;
  actorUserId: number | null;
  actorDisplayName: string | null;
  actorLabel: string;
  eventDateTime: string;
  appointmentDateLabel: string;
  appointmentTimeLabel: string;
  status: string;
}
