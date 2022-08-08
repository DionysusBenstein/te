import _ from "lodash";
import client from '../config/router.config';

export function collapse(obj: any) {
  const constructed = {};

  _.keys(obj).map((key) => {
    _.keys(obj[key]).map((skey) => {
      constructed[key + "." + skey] = obj[key][skey];
    });
  });
  return constructed;
}

export async function rpcRequest(method: string, params: any) {
  return new Promise(resolve => {
    client.request(method, params, (err, error, result) => {
      if (err) console.log(err);
      resolve(result);
    });
  });
}
