import { Alert, Button, Paper, ScrollArea, Skeleton, SimpleGrid, Stack, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { formatTime } from 'shared/utils';

import classes from './appointment-schedule-section.module.css';

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
  availableDateSet,
  calendarDate,
  dateError,
  isAvailableDatesError,
  isFetchingSlots,
  isFormDisabled,
  isLoadingAvailableDates,
  isLoadingSlots,
  isPending,
  isSlotsError,
  onCalendarDateChange,
  onDateChange,
  onSlotChange,
  selectedDate,
  selectedSlot,
  slots,
}: AppointmentScheduleSectionProps) {
  const getDayProps = (date: string) =>
    availableDateSet.has(date.trim()) ? { className: classes.availableDay } : {};

  const shouldDisableDate = (date: string) => !availableDateSet.has(date.trim());
  const showSlots = selectedDate && !isLoadingSlots && !isFetchingSlots && !isSlotsError;

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

        {isAvailableDatesError ? (
          <Alert color="red" variant="light">
            No se pudieron cargar las fechas disponibles del servicio.
          </Alert>
        ) : null}

        <DatePickerInput
          className={classes.dateField}
          label="Fecha"
          placeholder="Selecciona una fecha"
          withAsterisk
          value={selectedDate ?? null}
          date={calendarDate ?? undefined}
          onDateChange={onCalendarDateChange}
          onChange={onDateChange}
          getDayProps={getDayProps}
          error={dateError}
          clearable={false}
          valueFormat="DD/MM/YYYY"
          excludeDate={shouldDisableDate}
          disabled={isFormDisabled || isPending || isLoadingAvailableDates}
        />

        <Stack gap="xs">
          <Text className={classes.sectionLabel}>Horarios disponibles</Text>

          {!selectedDate ? (
            <Text
              size="sm"
              style={{
                color: 'var(--app-color-text-secondary)',
              }}
            >
              Primero selecciona una fecha para ver los horarios disponibles.
            </Text>
          ) : null}

          {selectedDate && (isLoadingSlots || isFetchingSlots) ? (
            <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="sm">
              <Skeleton h={42} radius="md" />
              <Skeleton h={42} radius="md" />
              <Skeleton h={42} radius="md" />
              <Skeleton h={42} radius="md" />
              <Skeleton h={42} radius="md" />
              <Skeleton h={42} radius="md" />
            </SimpleGrid>
          ) : null}

          {selectedDate && isSlotsError ? (
            <Alert color="red" variant="light">
              No se pudieron cargar los horarios disponibles para la fecha seleccionada.
            </Alert>
          ) : null}

          {showSlots && slots.length === 0 ? (
            <Alert color="yellow" variant="light">
              No hay horarios disponibles para ese dia.
            </Alert>
          ) : null}

          {showSlots && slots.length > 0 ? (
            <ScrollArea.Autosize mah={220} offsetScrollbars scrollbarSize={8}>
              <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="sm">
                {slots.map((slot) => {
                  const selected = selectedSlot === slot;

                  return (
                    <Button
                      key={slot}
                      type="button"
                      variant={selected ? 'filled' : 'default'}
                      color={selected ? 'brand' : undefined}
                      radius="md"
                      className={classes.slotButton}
                      data-selected={selected}
                      onClick={() => onSlotChange(slot)}
                      disabled={isPending}
                      fullWidth
                    >
                      {formatTime(slot)}
                    </Button>
                  );
                })}
              </SimpleGrid>
            </ScrollArea.Autosize>
          ) : null}
        </Stack>
      </Stack>
    </Paper>
  );
}
