import { isDateString } from "class-validator";

export const tranformZeroOrDate = ({ value }) => {
  if (isDateString(value)) {
    return value;
  }
  const num = parseInt(value);

  return num === 0 ? num : value;
};
