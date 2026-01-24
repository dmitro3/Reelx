import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsNonNegativeBigIntConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (value === undefined || value === null) {
      return true; // Опциональные поля пропускаем
    }
    if (typeof value !== 'string') {
      return false;
    }
    try {
      const bigIntValue = BigInt(value);
      return bigIntValue >= 0n;
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Invalid format or negative value: ${args.value}. Must be a non-negative BigInt string.`;
  }
}

export function IsNonNegativeBigInt(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNonNegativeBigIntConstraint,
    });
  };
}
