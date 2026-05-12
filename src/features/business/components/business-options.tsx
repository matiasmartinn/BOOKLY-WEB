import { faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Divider,
  Group,
  Popover,
  ScrollArea,
  Stack,
  UnstyledButton,
  Text,
} from '@mantine/core';
import type { Service } from 'app/layouts';

interface BusinessOptionsProps {
  services: Service[];
  activeServiceId: string;
  onServiceChange: (serviceId: string) => void;
  onServiceClose: () => void;
  allowCreate: boolean;
  onCreateService: () => void;
}

export function BusinessOptions({
  services,
  activeServiceId,
  onServiceChange,
  onServiceClose,
  allowCreate,
  onCreateService,
}: BusinessOptionsProps) {
  return (
    <Popover.Dropdown p={4}>
      <ScrollArea.Autosize mah={240}>
        <Stack gap={2}>
          {services.map((service) => {
            const isActive = service.id === activeServiceId;
            return (
              <UnstyledButton
                key={service.id}
                px="sm"
                py={8}
                style={(theme) => ({
                  borderRadius: theme.radius.md,
                  backgroundColor: isActive ? 'var(--app-color-brand-soft)' : 'transparent',
                })}
                onClick={() => {
                  onServiceChange(service.id);
                  onServiceClose();
                }}
              >
                <Group gap={8} wrap="nowrap">
                  <Box
                    w={6}
                    h={6}
                    style={{
                      borderRadius: '50%',
                      backgroundColor: isActive
                        ? 'var(--mantine-color-brand-5)'
                        : 'var(--app-color-text-muted)',
                      flexShrink: 0,
                    }}
                  />
                  <Text
                    size="xs"
                    fw={isActive ? 600 : 400}
                    c={isActive ? 'brand.6' : 'dimmed'}
                    flex={1}
                    truncate
                  >
                    {service.name}
                  </Text>
                  {isActive && (
                    <FontAwesomeIcon
                      icon={faCheck}
                      style={{ fontSize: 9, color: 'var(--mantine-color-brand-5)' }}
                    />
                  )}
                </Group>
              </UnstyledButton>
            );
          })}

          {allowCreate && (
            <>
              <Divider my={4} />
              <UnstyledButton px="sm" py={8} onClick={onCreateService}>
                <Group gap={8} wrap="nowrap">
                  <Box
                    w={16}
                    h={16}
                    style={{
                      borderRadius: 4,
                      border: '1px solid var(--app-color-brand-outline)',
                      backgroundColor: 'var(--app-color-brand-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faPlus}
                      style={{ fontSize: 8, color: 'var(--mantine-color-brand-5)' }}
                    />
                  </Box>
                  <Text size="xs" fw={500} c="brand.6">
                    Nuevo servicio
                  </Text>
                </Group>
              </UnstyledButton>
            </>
          )}
        </Stack>
      </ScrollArea.Autosize>
    </Popover.Dropdown>
  );
}
