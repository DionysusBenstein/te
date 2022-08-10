import _ from "lodash";

export function fieldMatch(criteria: any) {
  return _.keys(criteria)
    .filter(key => criteria[key])
    .map((key) => {
      return `${key} = '${criteria[key]}'`;
    })
    .join(" AND ");
}
