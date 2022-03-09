import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import _ from "lodash";

interface ValidationResult {
  data?: any;
  errors?: any;
}

export async function validateAndConvert(
  classToConvert: any,
  body: Object
): Promise<ValidationResult> {
  const result: ValidationResult = {};
  result.data = plainToClass(classToConvert, body);
  const errors = await validate(result.data, { forbidNonWhitelisted: true });

  if (errors.length > 0) {
    const errorTexts = errors.map((error) => ({
      key: error.property,
      error: _.values(error.constraints),
    }));

    console.log(errorTexts);

    result.errors = errorTexts;
  }
  return result;
}
