import { ActionIcon, Flex, Select } from '@mantine/core';

type Props = {
  startValue: string | null;
  endValue: string | null;
  onStartChange: (value: string | null) => void;
  onEndChange: (value: string | null) => void;
  onRemove?: () => void;
};

export function SelectDayTimePicker({
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  onRemove,
}: Props) {
  const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
    const h = String(Math.floor(i / 2)).padStart(2, '0');
    const m = i % 2 === 0 ? '00' : '30';
    return `${h}:${m}`;
  });

  return (
    <Flex direction={{ base: 'column', sm: 'row' }} gap="xs" w={{ base: '100%', sm: 'auto' }}>
      <Select
        placeholder="Inicio"
        data={timeOptions}
        value={startValue}
        onChange={onStartChange}
        w={{ base: '100%', sm: 120 }}
      />

      <Select
        placeholder="Fin"
        data={startValue ? timeOptions.filter((t) => t > startValue) : timeOptions}
        value={endValue}
        onChange={onEndChange}
        w={{ base: '100%', sm: 120 }}
      />

      {onRemove && (
        <ActionIcon
          color="red"
          variant="light"
          size="lg"
          onClick={onRemove}
          aria-label="Eliminar franja"
        >
          x
        </ActionIcon>
      )}
    </Flex>
  );
}
