import { ActionIcon, Group, Select } from '@mantine/core';

type Props = {
  startValue: string | null;
  endValue: string | null;
  onStartChange: (value: string | null) => void;
  onEndChange: (value: string | null) => void;
  onRemove?: () => void;
};

const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, '0');
  const m = i % 2 === 0 ? '00' : '30';
  return `${h}:${m}`;
});

export function SelectDayTimePicker({
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  onRemove,
}: Props) {
  return (
    <Group wrap="nowrap">
      <Select
        placeholder="Inicio"
        data={timeOptions}
        value={startValue}
        onChange={onStartChange}
        w={120}
      />

      <Select
        placeholder="Fin"
        data={timeOptions}
        value={endValue}
        onChange={onEndChange}
        w={120}
      />

      {onRemove && (
        <ActionIcon color="red" variant="light" onClick={onRemove} aria-label="Eliminar franja">
          x
        </ActionIcon>
      )}
    </Group>
  );
}
