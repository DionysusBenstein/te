import {
  isDateString,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint()
export class IsZeroOrDateValidation implements ValidatorConstraintInterface {
  validate(value: any): boolean | Promise<boolean> {
    return isDateString(value) || parseInt(value) === 0;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Value "${validationArguments.value}" must be either 0 or Date String in ISO format!`;
  }
}
