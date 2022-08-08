import { Client } from 'jayson';
import http from 'http';
const keepAliveAgent = new http.Agent({ keepAlive: true });

const router = {
  host: process.env.ROUTER_HOST || 'router',
  port: process.env.ROUTER_PORT || 3003,
  agent: keepAliveAgent
};

export default Client.http(router);
