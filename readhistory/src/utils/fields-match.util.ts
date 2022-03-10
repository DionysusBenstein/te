import _ from "lodash";

export function fieldMatch(criteria: any) {
  return _.keys(criteria)
    .map((key) => {
      return `${key} = '${criteria[key]}'`;
    })
    .join(" AND ");
}
