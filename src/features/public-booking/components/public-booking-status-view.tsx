import { Badge, Button, Paper, Stack, Text, Title } from '@mantine/core';

interface PublicBookingStatusViewProps {
  title: string;
  description: string;
  supportingText?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function PublicBookingStatusView({
  title,
  description,
  supportingText,
  actionLabel = 'Intentar de nuevo',
  onAction,
}: PublicBookingStatusViewProps) {
  return (
    <Paper
      p={{ base: 'xl', sm: '2rem' }}
      radius="xl"
      withBorder
      style={{
        maxWidth: 720,
        margin: '0 auto',
        backgroundColor: 'white',
        boxShadow: '0 20px 44px rgba(15, 23, 42, 0.08)',
      }}
    >
      <Stack gap="lg">
        <Badge
          color="brand"
          variant="light"
          radius="xl"
          style={{ alignSelf: 'flex-start' }}
        >
          Reserva online
        </Badge>

        <Stack gap="sm">
          <Title order={2}>{title}</Title>
          <Text c="dimmed">{description}</Text>
          {supportingText ? <Text c="dimmed">{supportingText}</Text> : null}
        </Stack>

        {onAction ? (
          <div>
            <Button type="button" color="brand" onClick={onAction}>
              {actionLabel}
            </Button>
          </div>
        ) : null}
      </Stack>
    </Paper>
  );
}
