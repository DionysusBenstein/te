import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import _ from "lodash";

interface ValidationResult {
  data?: any;
  errors?: any;
}

export async function validateAndConvert(
  classToConvert: any,
  body: any
): Promise<ValidationResult> {
  const result: ValidationResult = {};
  result.data = plainToClass(classToConvert, body, {
    excludeExtraneousValues: true,
    strategy: "exposeAll",
  });
  console.log(result.data);

  const errors = await validate(result.data as any, {
    forbidNonWhitelisted: true,
  });

  if (errors.length > 0) {
    const errorTexts = errors.map((error) => ({
      key: error.property,
      error: _.values(error.constraints),
    }));

    result.errors = errorTexts;
  }
  return result;
}
