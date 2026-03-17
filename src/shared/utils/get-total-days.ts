export const getDateOnlyRangeDays = (startDate: string, endDate: string) =>
  Math.floor(
    (new Date(`${endDate}T00:00:00`).getTime() - new Date(`${startDate}T00:00:00`).getTime()) /
      86400000,
  ) + 1;
