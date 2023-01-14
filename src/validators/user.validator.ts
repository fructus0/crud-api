import { validate } from 'uuid';
import { BadRequestError } from '../errors/badRequestError';
import { UserDto } from '../entities/user/userDto';
import { KeyWithValidationRules } from './rules/validationRule';
import { IsTypeOf } from './rules/isTypeOf';
import { IsArray } from './rules/isArray';
import { FieldValidationError } from '../errors/fieldValidationError';

const userDtoValidationRules: KeyWithValidationRules<UserDto>[] = [
  {
    key: 'username',
    validationRules: [
      new IsTypeOf('string'),
    ],
  },
  {
    key: 'age',
    validationRules: [
      new IsTypeOf('number'),
    ],
  },
  {
    key: 'hobbies',
    validationRules: [
      new IsArray('string'),
    ],
  },
];

export class UserValidator {
  public static validateUserDto = (body: Record<string, any>): FieldValidationError[] => {
    const keys = Object.keys(body);

    const validationErrors: FieldValidationError[] = [];

    for (const key of keys) {
      const dtoRule = userDtoValidationRules.find((rule) => rule.key === key);

      dtoRule!.validationRules.forEach((validation) => {
        validationErrors.push(...validation.checkProperty(key, body[key]));
      });
    }

    return validationErrors;
  };

  public static validateRequestKeys = (body: Record<string, any>): void => {
    const keys = Object.keys(body);

    const dtoKeys: (keyof UserDto)[] = ['username', 'age', 'hobbies'];

    if (keys.length > dtoKeys.length) {
      throw new BadRequestError('Extra options are not allowed.');
    }

    if (keys.length < dtoKeys.length || !dtoKeys.every((dtoKey) => keys.includes(dtoKey))) {
      throw new BadRequestError(`${dtoKeys.filter((key) => !keys.includes(key)).join(', ')} are required`);
    }
  };

  public static validateUuid = (uuid: string) => {
    const isValid = validate(uuid);

    if (!isValid) {
      throw new BadRequestError('Invalid uuid.');
    }
  };
}
