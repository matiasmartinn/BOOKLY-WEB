import { Group, Modal, Stack, type ModalProps } from '@mantine/core';
import type { ReactNode } from 'react';

interface GenericModalProps {
  opened: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalProps['size'];
  centered?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  withCloseButton?: boolean;
  loading?: boolean;
}

export function GenericModal({
  opened,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  centered = true,
  closeOnClickOutside = true,
  closeOnEscape = true,
  withCloseButton = true,
  loading = false,
}: GenericModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size={size}
      centered={centered}
      closeOnClickOutside={!loading && closeOnClickOutside}
      closeOnEscape={!loading && closeOnEscape}
      withCloseButton={withCloseButton && !loading}
      radius="md"
      padding="lg"
    >
      <Stack gap="md">
        <div>{children}</div>

        {footer ? <Group justify="flex-end">{footer}</Group> : null}
      </Stack>
    </Modal>
  );
}
