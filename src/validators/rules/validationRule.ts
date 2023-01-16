import { FieldValidationError } from '../../errors/fieldValidationError';

export interface KeyWithValidationRules<T> {
  key: keyof T;
  validationRules: ValidationRule[]
}

export interface ValidationRule {
  checkProperty: (propertyName: string, propertyValue: any) => FieldValidationError[];
}
