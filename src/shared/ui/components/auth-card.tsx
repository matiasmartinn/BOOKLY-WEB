import { Paper, type PaperProps } from '@mantine/core';

type AuthCardProps = PaperProps & {
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  children: React.ReactNode;
};

export function AuthCard({ children, onSubmit, ...props }: AuthCardProps) {
  return (
    <Paper
      component="form"
      noValidate
      onSubmit={onSubmit}
      shadow="sm"
      radius="md"
      p="lg"
      maw={500}
      mx="auto"
      mt="xl"
      withBorder
      {...props}
    >
      {children}
    </Paper>
  );
}
