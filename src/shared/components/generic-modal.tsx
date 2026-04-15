import { Group, Modal, Stack, type ModalProps } from '@mantine/core';
import type { ReactNode } from 'react';
import { ModalHeader } from 'shared/ui/components';

import classes from './generic-modal.module.css';

interface GenericModalProps {
  opened: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
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
  description,
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
  const modalTitle = description ? (
    <ModalHeader title={title} description={description} />
  ) : title ? (
    <span className={classes.plainTitle}>{title}</span>
  ) : (
    undefined
  );

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
      radius="xl"
      padding="xl"
      styles={styles}
      classNames={{
        content: classes.content,
        header: classes.header,
        title: classes.title,
        body: classes.body,
      }}
    >
      <Stack gap="md">
        <div>{children}</div>

        {footer ? <Group justify="flex-end">{footer}</Group> : null}
      </Stack>
    </Modal>
  );
}
