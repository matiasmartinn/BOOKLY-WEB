export enum ServiceTypeFieldType {
  Text = 1,
  MultilineText = 2,
  Number = 3,
  Date = 4,
  Select = 5,
  Checkbox = 6,
}

export interface ServiceTypeFieldOptionDto {
  id: number;
  fieldDefinitionId: number;
  value: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ServiceTypeFieldDefinitionDto {
  id: number;
  serviceTypeId: number;
  key: string;
  label: string;
  description?: string | null;
  fieldType: number;
  isRequired: boolean;
  isActive: boolean;
  sortOrder: number;
  createdOn: string;
  updatedOn?: string | null;
  options: ServiceTypeFieldOptionDto[];
}

export interface ServiceTypeDto {
  id: number;
  name: string;
  description?: string | null;
  isActive: boolean;
  fieldDefinitions?: ServiceTypeFieldDefinitionDto[] | null;
}

export type BusinessTypeModel = ServiceTypeDto;
