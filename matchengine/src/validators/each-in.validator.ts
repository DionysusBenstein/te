import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsEachIn(
  property: any[],
  validationOptions?: ValidationOptions
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: {
        message: `markets must be one of the following values: ${property}`,
        ...validationOptions
      },
      constraints: [property],
      validator: IsEachInConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsEachIn' })
export class IsEachInConstraint implements ValidatorConstraintInterface {
  validate(array: any[], args: ValidationArguments) {
    const [relatedArray] = args.constraints;
    return array.some((item: any) => relatedArray.indexOf(item) >= 0);
  }
}
