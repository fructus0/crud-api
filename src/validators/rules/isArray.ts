import { ValidationRule } from './validationRule';
import { FieldValidationError } from '../../errors/fieldValidationError';

export class IsArray implements ValidationRule {
  private readonly itemType: string;

  constructor(itemType: string) {
    this.itemType = itemType;
  }

  public checkProperty = (propertyName: string, propertyValue: any) => {
    if (!Array.isArray(propertyValue)) {
      return [new FieldValidationError(`Property '${propertyName}' must be of type array.`)];
    }

    const validationErrors: FieldValidationError[] = [];

    propertyValue.forEach((item) => {
      if (typeof item !== this.itemType) {
        const error = new FieldValidationError(`Item ${item} in '${propertyName}' must be of type ${this.itemType}.`);

        validationErrors.push(error);
      }
    });

    return validationErrors;
  };
}
