import { Paper, Stack, Text } from '@mantine/core';
import { ScheduleSlotPicker } from 'shared/components';

interface AppointmentScheduleSectionProps {
  availableDateSet: Set<string>;
  calendarDate: string | null;
  dateError?: string;
  isAvailableDatesError: boolean;
  isFetchingSlots: boolean;
  isFormDisabled: boolean;
  isLoadingAvailableDates: boolean;
  isLoadingSlots: boolean;
  isPending: boolean;
  isSlotsError: boolean;
  onCalendarDateChange: (value: string | null) => void;
  onDateChange: (value: string | null) => void;
  onSlotChange: (value: string) => void;
  selectedDate: string | null;
  selectedSlot: string;
  slots: string[];
}

export function AppointmentScheduleSection({
  isFormDisabled,
  ...pickerProps
}: AppointmentScheduleSectionProps) {
  return (
    <Paper
      radius="lg"
      p="md"
      style={{
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.92) 100%)',
        borderColor: 'var(--app-color-border)',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.04)',
      }}
    >
      <Stack gap="md">
        <Stack gap={4}>
          <Text fw={600}>Fecha y horario</Text>
          <Text
            size="sm"
            style={{
              color: 'var(--app-color-text-secondary)',
              lineHeight: 1.5,
            }}
          >
            Selecciona una fecha disponible para ver y elegir los horarios del servicio.
          </Text>
        </Stack>

        <ScheduleSlotPicker
          {...pickerProps}
          disabled={isFormDisabled}
          datesErrorMessage="No se pudieron cargar las fechas disponibles del servicio."
          slotsErrorMessage="No se pudieron cargar los horarios disponibles para la fecha seleccionada."
          withSlotsScrollArea
        />
      </Stack>
    </Paper>
  );
}
