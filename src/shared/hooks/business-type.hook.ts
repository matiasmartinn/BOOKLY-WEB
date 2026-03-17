import { useQuery } from '@tanstack/react-query';
import { businessTypeService } from 'shared/services/business-type.service';

export function useGetAllBusinessType() {
  return useQuery({
    queryKey: ['business-types'],
    queryFn: () => businessTypeService.getAll(),
  });
}
