export interface UnavailabilityViewModel {
  id: number;
  startDate: string;
  endDate: string;
  startTime: string | null;
  endTime: string | null;
  reason: string | null;
  isFullDay: boolean;
  dateLabel: string;
  timeLabel: string;
  totalDays: number;
}
