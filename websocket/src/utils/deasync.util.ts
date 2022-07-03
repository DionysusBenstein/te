import deasync from 'deasync';

export function deasyncRequestHelper(method: string, params: any, client: any) {
  let res: any;

  client.request(method, params, (err: any, { result }) => (res = { err, result }));

  while (!res) {
    deasync.runLoopOnce();
  }

  return res.err || res.result;
}
