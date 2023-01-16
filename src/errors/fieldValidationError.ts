export class FieldValidationError extends Error {
  constructor(message = 'Bad request.') {
    super(message);
  }
}
