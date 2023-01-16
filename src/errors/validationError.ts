import { FieldValidationError } from './fieldValidationError';

export class ValidationError extends Error {
  private errors: FieldValidationError[];

  constructor(errors: FieldValidationError[]) {
    super('Validation error.');

    this.errors = errors;
  }

  public getErrors = (): string[] => this.errors.map((error) => error.message);
}
