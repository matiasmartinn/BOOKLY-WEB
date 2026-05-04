export interface DynamicFieldOptionDto {
  id: number;
  value: string;
  label: string;
  sortOrder: number;
  isActive?: boolean;
}

export interface DynamicFieldDefinitionDto {
  id: number;
  key: string;
  label: string;
  description?: string | null;
  fieldType: number;
  isRequired: boolean;
  isActive?: boolean;
  sortOrder: number;
  options: DynamicFieldOptionDto[];
}
