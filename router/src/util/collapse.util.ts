import _ from "lodash";

export function collapse(obj: any) {
  const constructed = {};

  _.keys(obj).map((key) => {
    _.keys(obj[key]).map((skey) => {
      constructed[key + "." + skey] = obj[key][skey];
    });
  });
  return constructed;
}
