export interface ServiceTypeDto {
  id: number;
  name: string;
  description?: string | null;
  isActive: boolean;
}

export type BusinessTypeModel = ServiceTypeDto;
