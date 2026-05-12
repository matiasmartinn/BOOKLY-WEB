import { Group, Modal, Stack, type ModalProps } from '@mantine/core';
import type { ReactNode } from 'react';
import { ModalHeader } from 'shared/ui/components';

import classes from './generic-modal.module.css';

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
  styles?: ModalProps['styles'];
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
  styles,
}: GenericModalProps) {
  const modalTitle = title ? <ModalHeader title={title} /> : undefined;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={modalTitle}
      size={size}
      centered={centered}
      closeOnClickOutside={!loading && closeOnClickOutside}
      closeOnEscape={!loading && closeOnEscape}
      withCloseButton={withCloseButton && !loading}
      radius="lg"
      padding={0}
      styles={styles}
      classNames={{
        content: classes.content,
        header: classes.header,
        close: classes.close,
        title: classes.title,
        body: classes.body,
      }}
    >
      <Stack gap="lg" className={classes.contentStack}>
        <div>{children}</div>

        {footer ? (
          <Group className={classes.footer} justify="flex-end" gap="sm" wrap="wrap">
            {footer}
          </Group>
        ) : null}
      </Stack>
    </Modal>
  );
}
