export const formatDateOnly = (value: string) =>
  new Intl.DateTimeFormat('es-AR').format(new Date(`${value}T00:00:00`));
