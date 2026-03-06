import { Group, ActionIcon, Button, Text } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

type HeaderMode = 'public' | 'branding';

interface AppHeaderProps {
  mode: HeaderMode;
  showMenuButton?: boolean;
  onToggleSidebar?: () => void;
}

export function AppHeader({ mode, showMenuButton, onToggleSidebar }: AppHeaderProps) {
  return (
    <Group h="100%" px="md" justify="space-between" align="center">
      <Group gap="sm" align="center">
        {showMenuButton && (
          <ActionIcon variant="subtle" color="brand" onClick={onToggleSidebar} size="lg">
            <FontAwesomeIcon icon={faBars} />
          </ActionIcon>
        )}

        <Text fw={800} c="brand.6">
          Bookly
        </Text>
      </Group>

      {mode === 'public' ? (
        <Group gap="xs">
          <Button variant="subtle" color="brand" component="a" href="/auth/register">
            Registrarme
          </Button>
          <Button color="brand" component="a" href="/auth/login">
            Iniciar sesión
          </Button>
        </Group>
      ) : (
        <Group gap="xs">
          {/* branding / acciones del user */}
          <Button variant="subtle" color="brand">
            Mi cuenta
          </Button>
        </Group>
      )}
    </Group>
  );
}