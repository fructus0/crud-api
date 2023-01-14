import { Response } from '../router/response';
import { NotFoundError } from '../errors/notFoundError';
import { HttpStatusCodes } from '../constants/http';
import { BadRequestError } from '../errors/badRequestError';
import { ValidationError } from '../errors/validationError';

export const handleException = (response: Response, error: Error): void => {
  if (error instanceof NotFoundError) {
    response.json(HttpStatusCodes.NOT_FOUND, {
      message: error.message,
    });

    return;
  }

  if (error instanceof BadRequestError) {
    response.json(HttpStatusCodes.BAD_REQUEST, {
      message: error.message,
    });

    return;
  }

  if (error instanceof ValidationError) {
    response.json(HttpStatusCodes.BAD_REQUEST, {
      violations: error.getErrors(),
    });

    return;
  }

  response.json(HttpStatusCodes.INTERNAL_SERVER_ERROR, {
    message: 'Internal server error',
  });
};
