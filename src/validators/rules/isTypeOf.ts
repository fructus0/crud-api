import { ValidationRule } from './validationRule';
import { FieldValidationError } from '../../errors/fieldValidationError';

export class IsTypeOf implements ValidationRule {
  private readonly type: string;

  constructor(itemType: string) {
    this.type = itemType;
  }

  public checkProperty = (propertyName: string, propertyValue: any) => {
    if (typeof propertyValue !== this.type) {
      return [new FieldValidationError(`${propertyName} must be of type ${this.type}.`)];
    }

    return [];
  };
}
