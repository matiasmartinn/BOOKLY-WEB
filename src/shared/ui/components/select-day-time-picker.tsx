import { ActionIcon, Flex, Select } from '@mantine/core';
import { memo, useMemo } from 'react';

type Props = {
  startValue: string | null;
  endValue: string | null;
  onStartChange: (value: string | null) => void;
  onEndChange: (value: string | null) => void;
  onRemove?: () => void;
  disabled?: boolean;
};

const TIME_OPTIONS_5 = Array.from({ length: 288 }, (_, i) => {
  const totalMinutes = i * 5;
  const h = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  const m = String(totalMinutes % 60).padStart(2, '0');
  return `${h}:${m}`;
});

export const SelectDayTimePicker = memo(function SelectDayTimePicker({
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  onRemove,
  disabled = false,
}: Props) {
  const endOptions = useMemo(
    () => (startValue ? TIME_OPTIONS_5.filter((t) => t > startValue) : TIME_OPTIONS_5),
    [startValue],
  );

  return (
    <Flex gap="xs" align="center" wrap="nowrap">
      <Select
        placeholder="Inicio"
        data={TIME_OPTIONS_5}
        value={startValue}
        onChange={onStartChange}
        disabled={disabled}
        w={110}
        comboboxProps={{ width: 130 }}
      />

      <Select
        placeholder="Fin"
        data={endOptions}
        value={endValue}
        onChange={onEndChange}
        disabled={disabled}
        w={110}
        comboboxProps={{ width: 130 }}
      />

      {onRemove && (
        <ActionIcon
          color="red"
          variant="light"
          size="lg"
          onClick={onRemove}
          aria-label="Eliminar franja"
          disabled={disabled}
        >
          x
        </ActionIcon>
      )}
    </Flex>
  );
});
