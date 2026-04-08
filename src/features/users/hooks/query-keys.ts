export const userQueryKey = (userId?: number) => ['users', userId] as const;

export const ownerSecretariesQueryKey = (ownerId?: number) =>
  ['users', 'owners', ownerId, 'secretaries'] as const;
