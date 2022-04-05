import { Client } from 'jayson';

const router = {
  host: process.env.ROUTER_HOST || 'router',
  port: process.env.ROUTER_PORT || 3003,
};

export default Client.http(router);
