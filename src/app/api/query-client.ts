import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      // 60s evita refetches por remontaje sin dejar datos operativos viejos;
      // las mutaciones siguen refrescando al instante via invalidateQueries.
      staleTime: 60 * 1000
    }
  }
})