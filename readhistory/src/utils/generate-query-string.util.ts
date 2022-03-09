import _ from "lodash";

export function generateSqlCriteria(criteria: any) {
  return _.keys(criteria)
    .map((key, index) => {
      return `${key} = $${index + 1}`;
    })
    .join(" AND ");
}
