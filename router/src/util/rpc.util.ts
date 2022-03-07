export function collapse(obj: any) {
  const constructed = {};

  Object.keys(obj).map((key) => {
    Object.keys(obj[key]).map((skey) => {
      constructed[key + "." + skey] = obj[key][skey];
    });
  });
  return constructed;
}
