import { Alert, Button, ScrollArea, SimpleGrid, Skeleton, Stack, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { formatTime } from 'shared/utils';

import classes from './schedule-slot-picker.module.css';

interface ScheduleSlotPickerProps {
  availableDateSet: Set<string>;
  calendarDate: string | null;
  dateError?: string;
  isAvailableDatesError: boolean;
  isFetchingSlots: boolean;
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
  disabled?: boolean;
  slotError?: string;
  datesErrorMessage?: string;
  slotsErrorMessage?: string;
  withSlotsScrollArea?: boolean;
}

export function ScheduleSlotPicker({
  availableDateSet,
  calendarDate,
  dateError,
  isAvailableDatesError,
  isFetchingSlots,
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
  disabled = false,
  slotError,
  datesErrorMessage = 'No se pudieron cargar las fechas disponibles.',
  slotsErrorMessage = 'No se pudieron cargar los horarios disponibles para la fecha elegida.',
  withSlotsScrollArea = false,
}: ScheduleSlotPickerProps) {
  const getDayProps = (date: string) =>
    availableDateSet.has(date.trim()) ? { className: classes.availableDay } : {};

  const shouldDisableDate = (date: string) => !availableDateSet.has(date.trim());
  const showSlots = selectedDate && !isLoadingSlots && !isFetchingSlots && !isSlotsError;

  const slotsGrid = (
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
  );

  return (
    <Stack gap="md">
      {isAvailableDatesError ? (
        <Alert color="red" variant="light">
          {datesErrorMessage}
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
        disabled={disabled || isPending || isLoadingAvailableDates}
      />

      <Stack gap="xs">
        <Text className={classes.sectionLabel}>Horarios disponibles</Text>

        {!selectedDate ? (
          <Text size="sm" c="dimmed">
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
            {slotsErrorMessage}
          </Alert>
        ) : null}

        {showSlots && slots.length === 0 ? (
          <Alert color="yellow" variant="light">
            No hay horarios disponibles para ese dia.
          </Alert>
        ) : null}

        {showSlots && slots.length > 0 ? (
          withSlotsScrollArea ? (
            <ScrollArea.Autosize mah={220} offsetScrollbars scrollbarSize={8}>
              {slotsGrid}
            </ScrollArea.Autosize>
          ) : (
            slotsGrid
          )
        ) : null}

        {slotError ? (
          <Text size="sm" c="red">
            {slotError}
          </Text>
        ) : null}
      </Stack>
    </Stack>
  );
}
