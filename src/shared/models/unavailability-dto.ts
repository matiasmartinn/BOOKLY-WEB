export interface UnavailabilityDto {
  id: number;
  startDate: string;
  endDate: string;
  startTime: string | null;
  endTime: string | null;
  reason: string | null;
  isFullDay: boolean;
}
