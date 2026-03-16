export interface UnavailabilityModel {
  id: number;
  startDate: Date;
  endDate: Date;
  startTime: string | null; // "HH:mm"
  endTime: string | null; // "HH:mm"
  reason: string | null;
  /** true cuando no tiene startTime ni endTime */
  isFullDay: boolean;
}
